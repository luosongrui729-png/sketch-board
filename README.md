# 🎨 Digital Workspace – Private Drawing Board

> **Your own offline-first, real-time collaborative canvas**  
> Like Miro or Excalidraw — but **100% private**, **no login**, **runs on your laptop**

---

## ✨ Features

| Feature | Status |
|---------|--------|
| 🎨 Infinite canvas with pan & zoom | ✅ Done |
| ✏️ Draw with pen, marker, highlighter | ✅ Done |
| 📝 Text, shapes, arrows, images | ✅ Done |
| 🔄 Real-time sync (2–10 users) | ✅ Done |
| 🔗 Share via short code (e.g., `AB12C3`) | ✅ Done |
| 💾 Auto-save every 5 seconds | ✅ Done |
| 📤 Export PNG & PDF | ✅ Done |
| 🌐 Works **offline** or **local network** | ✅ Done |
| 🔒 **No internet required** | ✅ Done |
| 🗂️ Multi-canvas management | ✅ Done |
| ↩️ Undo/Redo functionality | ✅ Done |

---

## 📋 Requirements

| Tool | Link | Notes |
|------|------|-------|
| **Node.js 18+** | [nodejs.org](https://nodejs.org) | Required for development |
| **Git** | [git-scm.com](https://git-scm.com) | To clone repository |
| **MongoDB** | Atlas or Local | Database for canvas storage |

---

## 🚀 Quick Start (One-Click)

### Windows
1. Double-click **`run.bat`** (if available)
2. Wait 30 seconds for setup
3. Open: [http://localhost:5000](http://localhost:5000)

### Mac / Linux
```bash
chmod +x run.sh
./run.sh
```

App opens automatically at `http://localhost:5000`  
First canvas code: `TEST123`

---

## 🛠️ Full Setup (Step-by-Step)

### 1. Clone the Repository
```bash
git clone https://github.com/yourname/digital-workspace.git
cd digital-workspace
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm install
```

### 3. Set Up Environment Variables
```bash
# Copy template
cp .env.example .env
```

Edit `.env` and configure your settings:
```env
# .env
MONGODB_URI=mongodb://localhost:27017/sketchboard
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sketchboard

PORT=5000
NODE_ENV=development
```

**⚠️ Keep this file private — never upload or share**

### 4. Database Setup

#### Option A: Local MongoDB (Recommended for Development)
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# OR install MongoDB locally
# Follow: https://docs.mongodb.com/manual/installation/
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create cluster and get connection string
3. Add to `.env` file

### 5. Start the Application

#### Option A: Development Mode
```bash
# Start backend server
npm run dev
```
Server runs on: [http://localhost:5000](http://localhost:5000)

#### Option B: Production Mode
```bash
# Build and start
npm run build
npm start
```

---

## 👥 Share with Team (Local Network)

### Real-Time Collaboration
1. **Host starts the app** on their machine
2. **Team members** open: `http://[HOST_IP]:5000`
3. **Use same canvas code** (e.g., `AB12C3D`)
4. **Draw together** in real-time ✨

### Find Host IP Address
```bash
# Windows
ipconfig | findstr IPv4

# Mac/Linux
ifconfig | grep inet
```

**💡 Works over WiFi — no internet needed!**

---

## 🎯 How to Use

### Creating & Managing Canvases
1. **📁 Canvas History**: Click the file icon in left toolbar
2. **➕ Create New**: Blue "Create New Canvas" button
3. **✏️ Rename**: Hover over canvas → pencil icon
4. **🗑️ Delete**: Hover over canvas → trash icon
5. **🔄 Switch**: Click any canvas to open it

### Drawing Tools
| Tool | Shortcut | Description |
|------|----------|-------------|
| 🖱️ Select | `V` | Select and move objects |
| ✋ Pan | `Space` | Move around canvas |
| ✏️ Pen | `P` | Draw freehand |
| 🧽 Eraser | `E` | Erase drawings |
| 📝 Text | `T` | Add text boxes |
| 🔷 Shapes | - | Rectangle, circle, triangle, etc. |
| 🖼️ Image | `I` | Insert images |

### Canvas Controls
- **🔍 Zoom**: Mouse wheel or zoom buttons
- **📐 Grid**: Toggle grid overlay
- **↩️ Undo**: `Ctrl+Z`
- **↪️ Redo**: `Ctrl+Y`
- **📤 Export**: `Ctrl+E`

---

## 📤 Export Drawings

1. **Click Download** icon in left toolbar
2. **Choose format**:
   - **PNG**: High-quality image (1x, 2x, 4x resolution)
   - **PDF**: Multi-page document
3. **Select area**:
   - **Visible**: Current viewport
   - **Full**: Entire canvas
4. **Background**: White or transparent (PNG only)

**📁 Files saved to Downloads folder**

---

## 🗂️ Project Structure

```
digital-workspace/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Main pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── index.ts           # Main server file
│   ├── routes.ts          # API routes
│   ├── websocket.ts       # Real-time sync
│   ├── storage.ts         # Database layer
│   └── mongodb-storage.ts # MongoDB implementation
├── shared/                # Shared types & schemas
├── attached_assets/       # Project documentation
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Build configuration
├── tailwind.config.ts     # Styling configuration
└── README.md              # This guide
```

---

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev          # Start dev server with hot reload

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Database
npm run db:generate  # Generate database schema
npm run db:migrate   # Run database migrations

# Linting & Formatting
npm run lint         # Check code quality
npm run format       # Format code with Prettier
```

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Socket.io
- **Canvas**: Fabric.js for drawing functionality
- **Database**: MongoDB with Mongoose
- **Real-time**: WebSocket connections
- **UI Components**: Radix UI, Lucide Icons

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 5000 in use** | `npx kill-port 5000` or change PORT in `.env` |
| **MongoDB connection failed** | Check `.env` URI, ensure MongoDB is running |
| **App not loading** | Wait 30s for build, run `npm install` |
| **Canvas not syncing** | Check WebSocket connection, same network |
| **Export blank/broken** | Zoom to 100% before export |
| **Performance issues** | Clear browser cache, restart server |
| **Canvas code not showing** | Refresh page, check red box in top-right |

### Debug Mode
```bash
# Enable detailed logging
DEBUG=* npm run dev

# Check server logs
npm run dev 2>&1 | tee debug.log
```

---

## 🎮 Demo Canvas

Try this code: **`TEST123`**  
→ Pre-loaded with sample drawings and text

---

## 🔒 Security & Privacy

- ✅ **100% Private**: No data leaves your network
- ✅ **No Registration**: No accounts or personal info required  
- ✅ **Local Storage**: All data stored on your machines
- ✅ **Encrypted**: WebSocket connections use secure protocols
- ✅ **No Tracking**: Zero analytics or external services

---

## 📝 License

This project is proprietary software developed for private use.  
All rights reserved.

---

## 🤝 Support

For technical support or questions:
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Ensure all dependencies are properly installed
4. Verify network connectivity for collaboration

---

## 🚀 Deployment Options

### Local Network (Recommended)
- Run on one machine, access from others via IP
- Perfect for team collaboration in office/home

### Cloud Deployment (Advanced)
- Deploy to Heroku, Vercel, or DigitalOcean
- Configure MongoDB Atlas for cloud database
- Set up proper environment variables

---

**🎨 Your data. Your control. Your app.**

*Built with ❤️ for seamless digital collaboration*