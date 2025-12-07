# 🚀 HelpRadar - Hyperlocal Community Help Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/MongoDB-8.0-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/NextAuth-5.0-purple?style=for-the-badge" alt="NextAuth" />
</div>

<br/>

<p align="center">
  <strong>A hyperlocal emergency response network for communities</strong>
</p>

<p align="center">
  Connect with your community • Post help requests • Find lost items • Donate blood • Offer assistance
</p>

---

## ✨ Key Features

### 🎯 Core Functionality
- **📝 Create Posts** - Post help requests, lost items, blood donation needs, or offers to help
- **🔍 Smart Search & Filters** - Filter by category, city, area, urgency level with custom styled dropdowns
- **📍 Location-Based** - GPS coordinates for hyperlocal precision with interactive map view
- **⚡ Priority Engine** - AI-like auto-categorization based on keyword analysis
- **🗺️ Map View** - Visual exploration with Leaflet + OpenStreetMap integration

### 🔐 Authentication System
- **📧 Email/Password Login** - Traditional registration and login with secure hashing (bcrypt)
- **🔑 Google OAuth** - One-click sign-in with Google using NextAuth.js v5
- **🔒 Forgot Password** - OTP-based password reset via email
- **👤 User Profiles** - View and manage your requests

### 📬 Notification System
- **🔔 In-App Notifications** - Real-time notification bell with unread count
- **📧 Email Notifications** - Automated emails for urgent posts and help offers
- **💬 Contact Helper** - Send messages to post creators with your contact details
- **✅ Mark as Resolved** - Post creators can mark their requests as completed

### 🔒 Privacy & Security
- **Masked Contacts** - Phone/email hidden until user clicks "View Contact"
- **Report System** - Community moderation with auto-hide threshold (5 reports)
- **Rate Limiting** - Spam prevention on API endpoints
- **Input Sanitization** - XSS protection using DOMPurify on all user inputs

### 📊 Admin Dashboard
- **Post Management** - View, resolve, delete any posts
- **Statistics Overview** - Category counts, top cities, hotspots
- **Moderation Queue** - Handle reported content
- **Analytics** - Views and engagement metrics

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4, Custom animations, Lottie |
| **Backend** | Next.js API Routes (Server Components) |
| **Database** | MongoDB 8.0 with Mongoose ODM |
| **Authentication** | NextAuth.js v5 (Google OAuth + Credentials) |
| **Maps** | Leaflet + React-Leaflet + OpenStreetMap |
| **Charts** | Recharts for statistics visualization |
| **Icons** | Lucide React |
| **Email** | Nodemailer (SMTP) |
| **Image Storage** | Cloudinary |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- npm or yarn
- Google Cloud Console credentials (for OAuth)
- Cloudinary account (for image uploads)
- SMTP credentials (for emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/gurusewak-singh/Help-Radar.git
cd Help-Radar

# Install dependencies
npm install

# Configure environment variables (create .env.local)
# See Environment Variables section below

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

### Environment Variables

Create a `.env.local` file with:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/helpradar

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@helpradar.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── [...nextauth]/    # NextAuth handler
│   │   │   ├── login/            # Email/password login
│   │   │   ├── register/         # User registration
│   │   │   ├── forgot-password/  # Send OTP
│   │   │   ├── verify-otp/       # Verify OTP
│   │   │   └── reset-password/   # Reset password
│   │   ├── posts/                # CRUD for posts
│   │   │   ├── [id]/             # Single post operations
│   │   │   │   ├── route.ts      # GET, PATCH, DELETE
│   │   │   │   ├── contact/      # Contact post creator
│   │   │   │   └── report/       # Report post
│   │   │   └── route.ts          # List & Create posts
│   │   ├── notifications/        # Notification endpoints
│   │   ├── stats/                # Aggregation queries
│   │   └── suggest/              # Smart priority engine
│   ├── page.tsx                  # Home page (landing)
│   ├── requests/                 # Browse all requests
│   ├── create/                   # Create new post
│   ├── post/[id]/                # Post detail page
│   ├── admin/                    # Admin dashboard
│   ├── map/                      # Map view
│   ├── profile/                  # User profile
│   │   └── notifications/        # Notifications page
│   ├── login/                    # Login page
│   ├── register/                 # Register page
│   ├── forgot-password/          # Password reset flow
│   ├── logout/                   # Logout animation
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── contact/                  # Contact page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── Header.tsx                # Navigation with notification bell
│   ├── PostCard.tsx              # Post card component
│   ├── FiltersBar.tsx            # Search & filter bar
│   ├── StyledSelect.tsx          # Custom dropdown component
│   ├── CreatePostForm.tsx        # Multi-step post form
│   ├── ContactModal.tsx          # View contact details
│   ├── ContactHelperModal.tsx    # Send message to creator
│   ├── MapView.tsx               # Leaflet map component
│   ├── NotificationBell.tsx      # Notification dropdown
│   ├── ToastContainer.tsx        # Toast notifications
│   ├── AuthRequiredModal.tsx     # Auth prompt modal
│   ├── Providers.tsx             # Context providers
│   └── ...                       # Other UI components
├── contexts/                     # React contexts
│   ├── AuthContext.tsx           # Authentication state
│   └── NotificationContext.tsx   # Notifications state
├── lib/                          # Utilities
│   ├── dbConnect.ts              # MongoDB connection
│   ├── validators.ts             # Input validation
│   ├── priorityEngine.ts         # Smart categorization
│   ├── email.ts                  # Email templates
│   └── cloudinary.ts             # Image upload
├── models/                       # Mongoose schemas
│   ├── Post.ts                   # Post model
│   ├── User.ts                   # User model
│   ├── Notification.ts           # Notification model
│   └── Report.ts                 # Report model
├── types/                        # TypeScript definitions
│   └── next-auth.d.ts            # NextAuth types
└── auth.ts                       # NextAuth configuration
```

---

## 📊 MongoDB Schemas

### Post Schema
```typescript
{
  title: String,                  // max 150 chars
  description: String,            // max 2000 chars
  category: 'Help Needed' | 'Item Lost' | 'Blood Needed' | 'Offer',
  city: String,
  area: String,
  location: { type: 'Point', coordinates: [lng, lat] },
  contact: { name, phone, email },
  urgency: 'Low' | 'Medium' | 'High',
  images: [{ url, public_id }],
  status: 'active' | 'resolved' | 'removed',
  views: Number,
  reported: Number,
  priority: Number,               // auto-calculated
  createdBy: ObjectId,            // User reference
  expiresAt: Date                 // TTL auto-expiry (7 days)
}
```

### User Schema
```typescript
{
  name: String,
  email: String (unique),
  password: String (select: false),
  googleId: String,               // For Google OAuth
  role: 'user' | 'admin',
  trustScore: Number,
  resetOtp: String,               // For password reset
  resetOtpExpiry: Date,
  notificationPreferences: {
    email: Boolean,
    bloodAlerts: Boolean,
    helpAlerts: Boolean
  }
}
```

### Notification Schema
```typescript
{
  recipientEmail: String,
  type: 'help_offered' | 'new_post' | 'post_resolved' | 'system',
  title: String,
  message: String,
  postId: ObjectId,
  postTitle: String,
  senderName: String,
  senderEmail: String,
  isRead: Boolean,
  urgency: String,
  createdAt: Date                 // TTL auto-expiry (30 days)
}
```

---

## 🔌 API Endpoints

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/posts` | List posts with filters, search, pagination |
| `POST` | `/api/posts` | Create new post |
| `GET` | `/api/posts/[id]` | Get post detail |
| `PATCH` | `/api/posts/[id]` | Update post (status, etc.) |
| `DELETE` | `/api/posts/[id]` | Delete post |
| `POST` | `/api/posts/[id]/contact` | Send message to creator |
| `POST` | `/api/posts/[id]/report` | Report post |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Email/password login |
| `POST` | `/api/auth/forgot-password` | Send OTP email |
| `POST` | `/api/auth/verify-otp` | Verify OTP |
| `POST` | `/api/auth/reset-password` | Reset password |
| `*` | `/api/auth/[...nextauth]` | NextAuth handlers |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | Get user notifications |
| `PATCH` | `/api/notifications/[id]` | Mark as read |
| `POST` | `/api/notifications/mark-all-read` | Mark all read |
| `GET` | `/api/stats` | Get aggregation statistics |
| `POST` | `/api/suggest` | Get smart category/urgency suggestion |

---

## ⚡ Smart Priority Engine

The app uses keyword analysis to automatically suggest categories and urgency:

```javascript
// High urgency keywords
['urgent', 'emergency', 'critical', 'asap', 'immediately', 'dying', 'accident']

// Blood category keywords  
['blood', 'donor', 'A+', 'B+', 'O+', 'AB+', 'transfusion', 'plasma']

// Lost category keywords
['lost', 'missing', 'stolen', 'wallet', 'phone', 'keys', 'pet']

// Offer category keywords
['offer', 'free', 'donate', 'volunteer', 'help available', 'giving away']
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Teal (#0d9488) - Brand color
- **Danger**: Red (#ef4444) - Blood Needed, Urgent
- **Warning**: Amber (#f59e0b) - Item Lost, Medium priority
- **Success**: Emerald (#10b981) - Offer, Resolved
- **Info**: Blue (#3b82f6) - Help Needed

### Category Colors
- 🔵 **Help Needed** - Blue
- 🟡 **Item Lost** - Amber
- 🔴 **Blood Needed** - Red
- 🟢 **Offer** - Emerald

### Urgency Indicators
- ✅ **Low** - Blue badge
- ⚠️ **Medium** - Amber badge
- 🔴 **High** - Red pulsing badge with "Urgent" label

---

## 🔐 Security Features

1. **Password Hashing** - bcryptjs with salt rounds
2. **Server-side Validation** - All inputs validated on backend
3. **Rate Limiting** - 5 posts/minute per IP
4. **XSS Prevention** - DOMPurify sanitization on all text
5. **CSRF Protection** - Built into Next.js
6. **Environment Variables** - Sensitive data protected
7. **Role-based Access** - Admin vs User permissions
8. **OTP Expiry** - 10-minute expiry for password reset

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Required Environment Variables for Production
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CLOUDINARY_*` credentials
- `SMTP_*` credentials

---

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed sample posts
npm run seed:admin   # Seed admin user
```

---

## 🎯 What Makes This Project Stand Out

| Feature | Description |
|---------|-------------|
| **Hyperlocal Precision** | GPS-based sorting, not just city-level |
| **Smart Auto-Priority** | AI-like keyword analysis without ML |
| **Dual Authentication** | Email/Password + Google OAuth |
| **Privacy-First** | Masked contacts with reveal logging |
| **Real-time Notifications** | In-app bell + Email alerts |
| **Post Ownership** | Creators can mark their posts resolved |
| **Map Visualization** | Leaflet integration for spatial view |
| **Community Moderation** | Self-governing with report system |
| **Post Lifecycle** | Auto-expiry via MongoDB TTL |
| **Modern UI** | Custom dropdowns, animations, Lottie |

---

## 👥 Team

- **Gurusewak Singh** - Google OAuth, Core Features
- **Suar** - Profile, Footer, Notifications

---

## 📄 License

MIT License - feel free to use this for your projects!

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Leaflet](https://leafletjs.com/) - Maps
- [Lucide](https://lucide.dev/) - Icons
- [Lottie](https://lottiefiles.com/) - Animations

---

<div align="center">
  <p>Made with ❤️ for communities in need</p>
  <p><strong>HelpRadar</strong> - Because every call for help deserves an answer</p>
</div>
