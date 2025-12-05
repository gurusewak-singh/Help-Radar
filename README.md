# 🚀 HelpRadar - Hyperlocal Community Help Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
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
- **📝 Create Posts** - Post help requests, lost items, blood donation needs, or offers
- **🔍 Smart Search** - Filter by category, city, area, urgency level
- **📍 Location-Based** - GPS coordinates for hyperlocal precision
- **⚡ Priority Engine** - AI-like auto-categorization based on keywords
- **🗺️ Map View** - Visual exploration with Leaflet + OpenStreetMap

### 🔒 Privacy & Security
- **Masked Contacts** - Phone/email hidden until user clicks "Reveal"
- **Report System** - Community moderation with auto-hide threshold
- **Rate Limiting** - Spam prevention on API endpoints
- **Input Sanitization** - XSS protection on all user inputs

### 📊 Admin Dashboard
- **Post Management** - View, resolve, delete posts
- **Statistics** - Category counts, top cities, hotspots
- **Moderation Queue** - Handle reported content
- **Analytics** - Views, engagement metrics

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS 4, Custom animations |
| **Backend** | Next.js API Routes |
| **Database** | MongoDB with Mongoose ODM |
| **Maps** | Leaflet + OpenStreetMap |
| **Icons** | Lucide React |
| **Auth** | NextAuth.js (optional) |
| **Email** | Nodemailer/SendGrid |
| **Storage** | Cloudinary (images) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/helpradar.git
cd helpradar

# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local

# Configure your .env.local with:
# - MONGODB_URI
# - NEXTAUTH_SECRET
# - Other optional variables

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

---

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── posts/            # CRUD for posts
│   │   ├── stats/            # Aggregation queries
│   │   └── suggest/          # Smart priority engine
│   ├── page.tsx              # Home feed
│   ├── create/               # Create post
│   ├── post/[id]/            # Post detail
│   ├── admin/                # Admin dashboard
│   ├── map/                  # Map view
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── Header.tsx
│   ├── PostCard.tsx
│   ├── FiltersBar.tsx
│   ├── CreatePostForm.tsx
│   ├── ContactModal.tsx
│   ├── MapView.tsx
│   ├── CategoryBadge.tsx
│   ├── UrgencyIndicator.tsx
│   ├── Pagination.tsx
│   └── StatsCard.tsx
├── lib/                      # Utilities
│   ├── dbConnect.ts          # MongoDB connection
│   ├── validators.ts         # Input validation
│   └── priorityEngine.ts     # Smart categorization
└── models/                   # Mongoose schemas
    ├── Post.ts
    ├── User.ts
    └── Report.ts
```

---

## 📊 MongoDB Schemas

### Post Schema
```typescript
{
  title: String,           // max 150 chars
  description: String,     // max 2000 chars
  category: 'Help Needed' | 'Item Lost' | 'Blood Needed' | 'Offer',
  city: String,
  area: String,
  location: GeoJSON Point,  // for map features
  contact: { name, phone, email },
  urgency: 'Low' | 'Medium' | 'High',
  images: [{ url, public_id }],
  status: 'active' | 'resolved' | 'removed',
  views: Number,
  reported: Number,
  priority: Number,         // auto-calculated
  expiresAt: Date          // TTL auto-expiry
}
```

### Indexes
- `2dsphere` on location (geo queries)
- `text` on title + description (search)
- Compound index on city + category + urgency
- TTL index on expiresAt (auto-cleanup)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/posts` | List posts (filters, search, pagination) |
| `POST` | `/api/posts` | Create new post |
| `GET` | `/api/posts/[id]` | Get post detail |
| `PATCH` | `/api/posts/[id]` | Update post |
| `DELETE` | `/api/posts/[id]` | Delete post |
| `POST` | `/api/posts/[id]/report` | Report post |
| `GET` | `/api/stats` | Get aggregation statistics |
| `POST` | `/api/suggest` | Get smart category/urgency suggestion |

### Query Parameters for GET /api/posts
- `city` - Filter by city
- `category` - Filter by category
- `urgency` - Filter by urgency level
- `q` - Text search
- `sort` - 'recent', 'priority', 'nearest'
- `page` & `limit` - Pagination
- `lat` & `lng` - For nearest sort

---

## ⚡ Smart Priority Engine

The app uses keyword analysis to automatically suggest categories and urgency:

```javascript
// High urgency keywords
['urgent', 'emergency', 'critical', 'asap', 'immediately', 'dying']

// Blood category keywords  
['blood', 'donor', 'A+', 'B+', 'O+', 'transfusion', 'plasma']

// Lost category keywords
['lost', 'missing', 'stolen', 'wallet', 'phone', 'keys']

// Offer category keywords
['offer', 'free', 'donate', 'volunteer', 'help available']
```

---

## 🎨 Design System

### Color Palette
```css
--primary: #6366f1;        /* Indigo - brand */
--danger: #ef4444;         /* Red - Blood Needed */
--warning: #f59e0b;        /* Amber - Item Lost */
--success: #10b981;        /* Emerald - Offer */
--info: #3b82f6;           /* Blue - Help Needed */
```

### Category Colors
- 🔵 Help Needed - Blue
- 🟡 Item Lost - Amber
- 🔴 Blood Needed - Red
- 🟢 Offer - Green

### Urgency Indicators
- ✅ Low - Green badge
- ⚠️ Medium - Yellow badge
- 🔴 High - Red pulsing badge

---

## 🔐 Security Features

1. **Server-side Validation** - All inputs validated on backend
2. **Rate Limiting** - 5 posts/minute per IP
3. **XSS Prevention** - HTML sanitization on all text
4. **CSRF Protection** - Built into Next.js
5. **Environment Variables** - Sensitive data protected
6. **Admin Auth** - Role-based access control

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

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-domain.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 🎯 What Makes This Project Stand Out

| Feature | Description |
|---------|-------------|
| **Hyperlocal Precision** | GPS-based sorting, not just city-level |
| **Smart Auto-Priority** | AI-like keyword analysis without ML |
| **Privacy-First** | Masked contacts with reveal logging |
| **Real-time Alerts** | Email notifications for critical categories |
| **Map Visualization** | Leaflet integration for spatial view |
| **Community Moderation** | Self-governing with trust scores |
| **Post Lifecycle** | Auto-expiry via MongoDB TTL |

---

## 📝 Viva Talking Points

### Why MongoDB?
> "Posts are independent document objects with variable fields (images, coordinates). MongoDB's flexible schema and native geo-queries make it ideal for this use case."

### Why Next.js?
> "Combines React UI with API routes in one framework. Fast SSR, great DX, easy Vercel deployment for small teams."

### Scaling Approach
> "Paginated queries, compound indexes on hot paths, Redis caching for frequent queries, MongoDB Atlas sharding for high load."

### Privacy Design
> "Contacts are masked by default. Reveal requires explicit action. Audit logs track access. Optional anonymous posting."

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this for your college project!

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Leaflet](https://leafletjs.com/) - Maps
- [Lucide](https://lucide.dev/) - Icons

---

<div align="center">
  <p>Made with ❤️ for communities in need</p>
  <p><strong>HelpRadar</strong> - Because every call for help deserves an answer</p>
</div>
