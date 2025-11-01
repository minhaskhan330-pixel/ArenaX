import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const createNotification = async (req, res) => {
  try {
    const { title, message, type, targetAudience, specificUsers, relatedTournament, isScheduled, scheduledFor } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type,
      targetAudience,
      specificUsers,
      relatedTournament,
      isScheduled,
      scheduledFor: isScheduled ? scheduledFor : null,
      status: isScheduled ? 'scheduled' : 'draft',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Notification created',
      notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (page - 1) * limit;

    const notifications = await Notification.find(query)
      .populate('createdBy', 'username')
      .populate('relatedTournament', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);

    res.json({
      success: true,
      notifications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.status = 'sent';
    notification.sentAt = new Date();
    await notification.save();

    if (req.io) {
      req.io.emit('notification', {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        targetAudience: notification.targetAudience,
        sentAt: notification.sentAt
      });
    }

    res.json({
      success: true,
      message: 'Notification sent successfully',
      notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendBulkNotification = async (req, res) => {
  try {
    const { title, message, type } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type: type || 'announcement',
      targetAudience: 'all',
      status: 'sent',
      sentAt: new Date(),
      createdBy: req.user._id
    });

    if (req.io) {
      req.io.emit('notification', {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        targetAudience: notification.targetAudience,
        sentAt: notification.sentAt
      });
    }

    res.json({
      success: true,
      message: 'Notification sent to all users',
      notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await notification.deleteOne();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNotificationStats = async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments();
    const sentNotifications = await Notification.countDocuments({ status: 'sent' });
    const scheduledNotifications = await Notification.countDocuments({ status: 'scheduled' });
    const draftNotifications = await Notification.countDocuments({ status: 'draft' });

    res.json({
      success: true,
      stats: {
        totalNotifications,
        sentNotifications,
        scheduledNotifications,
        draftNotifications
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
