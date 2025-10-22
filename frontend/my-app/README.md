# Art.Decor.AI Frontend - Complete Application

A comprehensive Next.js application for AI-powered home styling and artwork recommendations with full admin capabilities, user management, and system monitoring.

## 🚀 Features Overview

### **Core Application Pages**
- **🏠 Landing Page** - Modern hero section with input options and trending artwork
- **📊 Dashboard** - System overview with metrics, analytics, and quick actions
- **📸 Upload Manager** - Advanced file upload with drag-and-drop and analysis
- **💬 Chat History** - Conversation management with search and filtering
- **🎯 Recommendations** - Personalized artwork suggestions with AI reasoning
- **🖼️ Product Details** - Detailed artwork information with analysis
- **🏪 Local Stores** - Store finder with availability and directions
- **🤖 AI Chat** - Real-time conversational interface

### **Admin & Management**
- **👥 Admin Panel** - Complete user management with bulk actions
- **⚙️ AI Settings** - Comprehensive AI configuration and feature flags
- **📈 System Metrics** - Real-time performance monitoring and alerts
- **👤 User Management** - User creation, listing, and Gmail integration
- **🔐 Authentication** - Multi-method auth (Email, Google, GitHub)

## 📁 Project Structure

```
src/app/
├── page.tsx                    # Landing page
├── dashboard/page.tsx          # Main dashboard
├── upload-manager/page.tsx     # File upload management
├── chat-history/page.tsx       # Chat conversation history
├── recommendations/page.tsx    # Artwork recommendations
├── artwork/[id]/page.tsx       # Product detail page
├── stores/page.tsx            # Local stores finder
├── chat/page.tsx              # AI chat interface
├── admin/
│   ├── page.tsx               # Admin panel
│   └── users/page.tsx         # User management
├── settings/page.tsx          # AI configuration
├── metrics/page.tsx           # System metrics
└── auth/page.tsx              # Authentication
```

## 🛠️ Technologies Used

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React 19** with modern features
- **Google Gmail API** integration
- **OAuth 2.0** authentication

## 🎨 Design System

### **Color Palette**
- **Primary**: Purple/Pink gradients (`from-purple-500 to-pink-500`)
- **Secondary**: Blue (`blue-500`) for secondary actions
- **Success**: Green (`green-500`) for positive states
- **Warning**: Yellow (`yellow-500`) for alerts
- **Error**: Red (`red-500`) for errors

### **Components**
- **Cards**: Rounded corners (`rounded-xl`), subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with focus states
- **Tables**: Responsive with hover states
- **Modals**: Overlay with backdrop blur

## 🔧 Core Functionality

### **Dashboard Features**
- Real-time system metrics (CPU, Memory, Storage, Network)
- User activity monitoring
- Quick action buttons
- Tabbed interface (Overview, Analytics, Users)

### **Upload Management**
- Drag-and-drop file upload
- Multiple file support
- Upload progress tracking
- File analysis with confidence scores
- Batch operations

### **Chat History**
- Conversation search and filtering
- Message threading
- Export functionality
- Analysis summaries
- Tag-based organization

### **Admin Panel**
- User management with bulk actions
- Role-based access control
- System settings toggles
- Activity logs
- Analytics dashboard

### **AI Settings**
- Model configuration (GPT-4, Claude, etc.)
- Analysis parameters tuning
- Recommendation settings
- Feature flags management
- Chat behavior configuration

### **User Management**
- Google Gmail integration
- User creation with email invitations
- Role assignment (User, Premium, Admin)
- Activity tracking
- Bulk operations

### **Authentication**
- Email/password authentication
- Google OAuth integration
- GitHub OAuth integration
- Account creation and management
- Password reset functionality

## 🚀 Getting Started

### **Installation**
```bash
cd frontend/my-app
npm install
```

### **Development**
```bash
npm run dev
```

### **Build**
```bash
npm run build
npm start
```

## 📊 System Requirements

- **Node.js**: 18+ 
- **npm**: 8+
- **Browser**: Modern browsers with ES6+ support

## 🔗 API Integration Points

### **Backend Services**
- **YOLOv8**: Room analysis and feature detection
- **FAISS**: Vector search for artwork recommendations
- **LLM**: Design rationale generation
- **Google APIs**: Gmail integration and OAuth
- **Database**: User profiles and session storage

### **External Services**
- **Google Gmail API**: Email notifications and invitations
- **OAuth Providers**: Google, GitHub authentication
- **File Storage**: Image upload and processing
- **Analytics**: User behavior tracking

## 🎯 Key Features by Page

### **Dashboard** (`/dashboard`)
- System health monitoring
- User activity overview
- Quick action buttons
- Real-time metrics

### **Upload Manager** (`/upload-manager`)
- Drag-and-drop interface
- File analysis results
- Confidence scoring
- Batch processing

### **Chat History** (`/chat-history`)
- Conversation search
- Message threading
- Export capabilities
- Analysis summaries

### **Admin Panel** (`/admin`)
- User management
- System configuration
- Activity monitoring
- Bulk operations

### **AI Settings** (`/settings`)
- Model configuration
- Parameter tuning
- Feature flags
- Performance settings

### **User Management** (`/admin/users`)
- Gmail integration
- User creation
- Role management
- Activity tracking

### **System Metrics** (`/metrics`)
- Real-time monitoring
- Performance charts
- Alert management
- Service status

### **Authentication** (`/auth`)
- Multi-provider auth
- Account creation
- Password management
- OAuth integration

## 🔒 Security Features

- **Authentication**: Multi-factor authentication support
- **Authorization**: Role-based access control
- **Data Protection**: Secure file upload and storage
- **API Security**: Rate limiting and validation
- **Privacy**: GDPR-compliant data handling

## 📱 Responsive Design

- **Mobile-first**: Optimized for all screen sizes
- **Touch-friendly**: Intuitive mobile interactions
- **Progressive**: Enhanced features on larger screens
- **Accessible**: WCAG compliance considerations

## 🚀 Deployment

The application is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

## 📈 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Static generation where possible
- **Bundle Analysis**: Optimized bundle sizes
- **Lazy Loading**: Component-level lazy loading

## 🔄 State Management

- **React State**: Local component state
- **Context API**: Global state management
- **URL State**: Route-based state persistence
- **Local Storage**: User preferences and settings

This comprehensive frontend application provides a complete solution for AI-powered home styling with full administrative capabilities, user management, and system monitoring.