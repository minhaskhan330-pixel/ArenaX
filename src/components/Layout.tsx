import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #0B0B0F 0%, #14141E 50%, #1A1A2E 100%)'
    }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 229, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 229, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.15) 0%, transparent 70%)'
          }}
        />

        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%)'
          }}
        />

        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.1) 0%, transparent 70%)'
          }}
        />

        <motion.div
        />
      </div>

      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 150px'
        }}
      />

      {/* Main Content */}
      <div className="relative flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 lg:ml-0 relative">
          {/* Top Gradient Bar */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 z-10"
            style={{
              background: 'linear-gradient(90deg, #00E5FF 0%, #8A2BE2 50%, #00E5FF 100%)',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)'
            }}
          />

          {/* Content Area */}
          <motion.div 
            className="p-6 lg:p-8 max-w-[1600px] mx-auto relative z-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>

          {/* Corner Accents */}
          <div className="fixed top-0 right-0 w-64 h-64 pointer-events-none z-0">
            <div 
              className="absolute top-0 right-0 w-32 h-32"
              style={{
                background: 'linear-gradient(225deg, rgba(0, 229, 255, 0.1) 0%, transparent 70%)',
                clipPath: 'polygon(100% 0, 100% 100%, 0 0)'
              }}
            />
          </div>

          <div className="fixed bottom-0 left-0 w-64 h-64 pointer-events-none z-0 lg:left-80">
            <div 
              className="absolute bottom-0 left-0 w-32 h-32"
              style={{
                background: 'linear-gradient(45deg, rgba(138, 43, 226, 0.1) 0%, transparent 70%)',
                clipPath: 'polygon(0 100%, 100% 100%, 0 0)'
              }}
            />
          </div>
        </main>
      </div>

      <style>{`
        /* Smooth transitions for all interactive elements */
        * {
          transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Custom Selection Color */
        ::selection {
          background-color: rgba(0, 229, 255, 0.3);
          color: white;
        }

        ::-moz-selection {
          background-color: rgba(0, 229, 255, 0.3);
          color: white;
        }

        /* Prevent layout shift on mobile */
        @media (max-width: 1024px) {
          main {
            margin-left: 0 !important;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom Scrollbar for main content */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(11, 11, 15, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00E5FF 0%, #8A2BE2 100%);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #00E5FF 20%, #8A2BE2 80%);
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Layout;