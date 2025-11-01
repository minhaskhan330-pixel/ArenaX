# ArenaX Backend - Refactored

Node.js + Express + MongoDB + Socket.io backend for ArenaX eSports Tournament Management Platform.

## Major Changes (Refactoring Summary)

### 1. Unified User System
- **Removed**: Separate Admin model
- **Unified**: Single User model with `role` field (`admin` or `player`)
- **Removed**: `organizer` and `moderator` roles
- **Feature**: Admin users have unlimited coins (virtual property)

### 2. Tournament Management
- Tournaments are now created by admins only
- `organizer` field replaced with `createdBy` field
- All tournaments created by admin are auto-approved

### 3. Real-Time Notifications
- Integrated Socket.io for real-time notifications
- Added bulk notification sending feature
- Notifications broadcast to all connected clients instantly

### 4. AX Coins System
- 1 AX Coin = 1 PKR
- Players purchase coins and use them to enter tournaments
- Admins have unlimited coins
- Transaction verification system for PayPro integration
- Complete transaction history and wallet management

## Installation

```bash
cd backend
npm install
```

## Configuration

Create a `.env` file with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
```

## Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication (Public)
- **POST** `/api/auth/register` - Register new user (admin or player)
- **POST** `/api/auth/login` - Login (returns JWT token)
- **GET** `/api/auth/profile` - Get current user profile (Protected)

### Dashboard (Admin Only)
- **GET** `/api/dashboard/stats` - Get dashboard statistics with charts

### Users Management (Admin Only)
- **GET** `/api/users` - Get all players (paginated, searchable)
- **GET** `/api/users/stats` - Get user statistics
- **GET** `/api/users/:id` - Get user details with transactions and tournaments
- **PUT** `/api/users/:id/status` - Update user account status (active/suspended/banned)
- **POST** `/api/users/:id/coins` - Adjust user coins (credit/debit)

### Tournaments (Admin Only)
- **GET** `/api/tournaments` - Get all tournaments (paginated, filterable)
- **POST** `/api/tournaments` - Create new tournament
- **GET** `/api/tournaments/stats` - Get tournament statistics
- **GET** `/api/tournaments/:id` - Get tournament details with participants
- **PUT** `/api/tournaments/:id/status` - Update tournament status
- **POST** `/api/tournaments/verify-result` - Verify participant results and distribute prizes
- **DELETE** `/api/tournaments/:id` - Delete tournament

### Transactions (Admin Only)
- **GET** `/api/transactions` - Get all transactions (paginated, filterable)
- **GET** `/api/transactions/stats` - Get transaction statistics with charts
- **GET** `/api/transactions/wallet/overview` - Get wallet overview

### Notifications (Admin Only)
- **POST** `/api/notifications` - Create notification (draft or scheduled)
- **GET** `/api/notifications` - Get all notifications (paginated)
- **GET** `/api/notifications/stats` - Get notification statistics
- **POST** `/api/notifications/send-bulk` - Send notification to all users instantly
- **POST** `/api/notifications/:id/send` - Send specific notification
- **DELETE** `/api/notifications/:id` - Delete notification

### Settings (Admin Only)
- **GET** `/api/settings` - Get all settings
- **GET** `/api/settings/:key` - Get setting by key
- **POST** `/api/settings` - Create new setting
- **PUT** `/api/settings/:key` - Update setting
- **DELETE** `/api/settings/:key` - Delete setting

## Database Schema

### User (Unified Model)
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  fullName: String (required),
  phoneNumber: String,
  role: String (enum: ['admin', 'player'], default: 'player'),
  coinBalance: Number (default: 0),
  totalCoinsEarned: Number (default: 0),
  totalCoinsSpent: Number (default: 0),
  accountStatus: String (enum: ['active', 'suspended', 'banned']),
  profileImage: String,
  gameStats: {
    totalTournamentsJoined: Number,
    totalWins: Number,
    totalKills: Number
  },
  lastLogin: Date,
  timestamps: true
}
```

**Note**: Admins have unlimited coins (virtual property).

### Tournament
```javascript
{
  title: String (required),
  description: String (required),
  gameType: String (enum: ['Free Fire', 'PUBG Mobile', 'Call of Duty Mobile', 'Valorant', 'Other']),
  createdBy: ObjectId (ref: 'User', admin who created),
  entryFee: Number (in AX Coins),
  prizePool: Number (in AX Coins),
  maxParticipants: Number,
  currentParticipants: Number,
  participants: [{
    userId: ObjectId,
    username: String,
    kills: Number,
    finalRank: Number,
    screenshot: String,
    coinsWon: Number,
    status: String (enum: ['pending', 'verified', 'rejected'])
  }],
  prizeDistribution: [{
    rank: Number,
    coins: Number,
    percentage: Number
  }],
  status: String (enum: ['pending', 'approved', 'live', 'completed', 'cancelled', 'rejected']),
  scheduledDate: Date,
  actualStartTime: Date,
  actualEndTime: Date,
  roomDetails: {
    roomId: String,
    roomPassword: String
  },
  rules: String,
  bannerImage: String,
  rejectionReason: String,
  adminApprovedBy: ObjectId,
  adminApprovedAt: Date,
  timestamps: true
}
```

### Transaction
```javascript
{
  userId: ObjectId (ref: 'User'),
  transactionType: String (enum: ['credit', 'debit']),
  amount: Number,
  balanceBefore: Number,
  balanceAfter: Number,
  category: String (enum: ['purchase', 'tournament_entry', 'tournament_win', 'refund', 'admin_adjustment', 'bonus']),
  description: String,
  relatedTournament: ObjectId,
  paymentMethod: String (enum: ['JazzCash', 'Easypaisa', 'PayPal', 'Bank Transfer', 'Admin', 'N/A']),
  paymentReference: String,
  processedBy: ObjectId (ref: 'User', admin who processed),
  status: String (enum: ['pending', 'completed', 'failed', 'reversed']),
  metadata: Mixed,
  timestamps: true
}
```

### Notification
```javascript
{
  title: String (required),
  message: String (required),
  type: String (enum: ['announcement', 'tournament', 'reward', 'system', 'warning']),
  targetAudience: String (enum: ['all', 'players', 'specific']),
  specificUsers: [ObjectId],
  relatedTournament: ObjectId,
  isScheduled: Boolean,
  scheduledFor: Date,
  sentAt: Date,
  status: String (enum: ['draft', 'scheduled', 'sent']),
  createdBy: ObjectId (ref: 'User', admin who created),
  timestamps: true
}
```

### Settings
```javascript
{
  settingKey: String (unique, required),
  settingValue: Mixed (required),
  description: String,
  category: String,
  lastModifiedBy: ObjectId (ref: 'User'),
  timestamps: true
}
```

## Real-Time Features (Socket.io)

### Events

#### Server → Client
- **`notification`** - Broadcasted when a notification is sent
  ```javascript
  {
    id: String,
    title: String,
    message: String,
    type: String,
    targetAudience: String,
    sentAt: Date
  }
  ```

#### Connection
- Clients connect to: `ws://localhost:5000` (or production URL)
- CORS is configured to allow connections from the frontend

### Usage Example (Frontend)
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('notification', (data) => {
  console.log('New notification:', data);
  // Show notification to user
});
```

## Authentication & Authorization

### JWT Token
- All protected routes require `Authorization: Bearer <token>` header
- Token contains user ID and role
- Token should be stored in localStorage on the frontend

### Middleware
- **`protect`** - Validates JWT token and attaches user to request
- **`adminOnly`** - Ensures only admin users can access the route

## AX Coins System

### How It Works
1. **Player Registration**: Player creates account (role: 'player')
2. **Coin Purchase**: Player buys AX Coins via PayPro (1 Coin = 1 PKR)
3. **Transaction Verification**: Admin verifies payment and credits coins
4. **Tournament Entry**: Player uses coins to enter tournaments
5. **Prize Distribution**: Winners receive coins based on rank

### Admin Features
- View all transactions
- Manually adjust player coins (credit/debit)
- Verify payment transactions
- View wallet overview and statistics

### Player Coin Operations
- **Purchase**: Player pays via PayPro → Admin verifies → Coins credited
- **Tournament Entry**: Coins deducted when joining tournament
- **Prize Win**: Coins credited when tournament results verified
- **Refund**: Admin can refund coins if needed

## Payment Integration (PayPro)

When implementing PayPro:
1. Player initiates coin purchase in mobile app
2. PayPro payment gateway processes payment
3. Payment reference sent to backend
4. Admin verifies transaction in admin panel
5. Coins credited to player account via `/api/users/:id/coins` endpoint

## Error Handling

All errors return consistent JSON format:
```javascript
{
  success: false,
  message: "Error message"
}
```

HTTP Status Codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## Security Best Practices

1. Passwords are hashed using bcrypt
2. JWT tokens expire and should be refreshed
3. Input validation on all endpoints
4. CORS configured for specific origin
5. Rate limiting recommended for production
6. Environment variables for sensitive data

## Phase 2 Preparation (Mobile App)

The backend is ready for mobile app integration:
- RESTful API endpoints for all features
- JWT authentication compatible with mobile
- Real-time notifications via Socket.io
- PayPro integration endpoints ready
- Player-specific endpoints will be added in Phase 2

## Development Notes

- MongoDB indexes are set on frequently queried fields
- All controllers follow async/await pattern
- Proper error handling in all routes
- Request validation using express-validator
- Population of references for detailed data

## Production Deployment

1. Set NODE_ENV to production
2. Use process manager (PM2 recommended)
3. Enable HTTPS
4. Set up MongoDB Atlas or production database
5. Configure proper CORS origin
6. Enable rate limiting
7. Set up monitoring and logging
8. Regular database backups

## Support

For issues or questions, please contact the development team.
