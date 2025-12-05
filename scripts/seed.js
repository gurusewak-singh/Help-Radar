// Seed script to populate database with realistic sample data
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// Define Post schema (matching the TypeScript model)
const PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: { type: String, enum: ['Help Needed', 'Item Lost', 'Blood Needed', 'Offer'] },
  city: String,
  area: String,
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: [Number]
  },
  contact: {
    name: String,
    phone: String,
    email: String
  },
  images: [{
    url: String,
    public_id: String
  }],
  urgency: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  status: { type: String, enum: ['active', 'resolved', 'removed'], default: 'active' },
  views: { type: Number, default: 0 },
  reported: { type: Number, default: 0 },
  priority: { type: Number, default: 0 }
});

PostSchema.index({ location: '2dsphere' });

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

// Realistic sample data for Indian cities
const samplePosts = [
  // Blood Needed - High Priority
  {
    title: "Urgent: O+ Blood Required for Surgery",
    description: "My father is undergoing emergency heart surgery at AIIMS Hospital. We urgently need 3 units of O+ blood. Any donors please contact immediately. Surgery scheduled for tomorrow morning.",
    category: "Blood Needed",
    city: "Delhi",
    area: "AIIMS Campus, Ansari Nagar",
    urgency: "High",
    contact: { name: "Priya Sharma", phone: "9876543210", email: "priya.sharma@email.com" },
    images: [{ url: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400", public_id: "blood_donation_1" }],
    views: 245,
    priority: 180
  },
  {
    title: "B- Blood Needed for Accident Victim",
    description: "A young student was in a serious road accident near Koramangala. Currently admitted in Manipal Hospital ICU. B negative blood is rare and urgently needed. Please help save a life!",
    category: "Blood Needed",
    city: "Bangalore",
    area: "Koramangala",
    urgency: "High",
    contact: { name: "Dr. Arun Kumar", phone: "9988776655" },
    images: [],
    views: 189,
    priority: 175
  },

  // Help Needed
  {
    title: "Looking for Volunteer Teachers for Slum Children",
    description: "Our NGO runs a small learning center for underprivileged children in Dharavi. We need volunteer teachers for English, Math, and Science. Even 2-3 hours per week can make a huge difference in these children's lives.",
    category: "Help Needed",
    city: "Mumbai",
    area: "Dharavi",
    urgency: "Medium",
    contact: { name: "Sunita Devi", phone: "8899001122", email: "hope.foundation@email.com" },
    images: [{ url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400", public_id: "education_1" }],
    views: 156,
    priority: 95
  },
  {
    title: "Elderly Person Needs Groceries Delivery",
    description: "My 78-year-old grandmother lives alone and cannot go out due to mobility issues. Looking for someone who can help deliver groceries once a week. We will cover all grocery costs plus a small token of appreciation.",
    category: "Help Needed",
    city: "Chennai",
    area: "T. Nagar",
    urgency: "Medium",
    contact: { name: "Karthik R", phone: "7766554433" },
    images: [],
    views: 78,
    priority: 85
  },
  {
    title: "Need Wheelchair for Disabled Family Member",
    description: "Looking for a donated or affordable wheelchair for my disabled brother. He had an accident 6 months ago and we cannot afford a new one. Any help would be greatly appreciated.",
    category: "Help Needed",
    city: "Hyderabad",
    area: "Secunderabad",
    urgency: "High",
    contact: { name: "Mohammed Rafi", phone: "9090909090" },
    images: [],
    views: 203,
    priority: 130
  },
  {
    title: "Looking for Lost Dog - German Shepherd",
    description: "Our 3-year-old German Shepherd 'Bruno' went missing from Jubilee Hills area on December 1st. He has a brown collar with our contact number. Please help us find him! Reward offered.",
    category: "Item Lost",
    city: "Hyderabad",
    area: "Jubilee Hills",
    urgency: "High",
    contact: { name: "Sneha Reddy", phone: "9123456789", email: "sneha.r@email.com" },
    images: [{ url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400", public_id: "dog_1" }],
    views: 512,
    priority: 140
  },

  // Item Lost
  {
    title: "Lost Wallet at Connaught Place Metro",
    description: "Lost my brown leather wallet near Gate 3 of CP Metro Station yesterday evening around 6 PM. Contains important ID cards, Aadhaar, PAN, and some cash. If found, please return - ID cards are crucial for me.",
    category: "Item Lost",
    city: "Delhi",
    area: "Connaught Place",
    urgency: "Medium",
    contact: { name: "Vikram Singh", phone: "9999888877" },
    images: [],
    views: 89,
    priority: 70
  },
  {
    title: "Lost iPhone 14 Pro at Phoenix Mall",
    description: "Lost my iPhone 14 Pro (Space Black) at Phoenix MarketCity food court on Dec 3rd. The phone has a sunset wallpaper and blue case. Can track last location if battery not dead. Generous reward for finder!",
    category: "Item Lost",
    city: "Pune",
    area: "Viman Nagar",
    urgency: "High",
    contact: { name: "Anjali Deshmukh", phone: "8877665544" },
    images: [{ url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400", public_id: "iphone_1" }],
    views: 178,
    priority: 120
  },
  {
    title: "Missing Gold Chain - Sentimental Value",
    description: "Lost a gold chain with Lord Ganesha pendant at Mahalaxmi Temple vicinity. It belonged to my late mother and has immense sentimental value. Please help if you find it. Reward offered.",
    category: "Item Lost",
    city: "Mumbai",
    area: "Mahalaxmi",
    urgency: "Medium",
    contact: { name: "Geeta Patel", phone: "9898989898" },
    images: [],
    views: 134,
    priority: 75
  },

  // Offers
  {
    title: "Free Coding Classes for Beginners",
    description: "I'm a software engineer at Google and want to give back to the community. Offering free weekend coding classes (Python & Web Development) for students and job seekers. Online and offline batches available.",
    category: "Offer",
    city: "Bangalore",
    area: "HSR Layout",
    urgency: "Low",
    contact: { name: "Arjun Mehta", phone: "9876512340", email: "arjun.codes@email.com" },
    images: [{ url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400", public_id: "coding_1" }],
    views: 423,
    priority: 55
  },
  {
    title: "Donating Used Books and Study Materials",
    description: "Giving away 50+ engineering textbooks, UPSC preparation materials, and novels. All in good condition. Perfect for students who cannot afford new books. Pick up from my location or I can arrange delivery for bulk.",
    category: "Offer",
    city: "Delhi",
    area: "Laxmi Nagar",
    urgency: "Low",
    contact: { name: "Rahul Gupta", phone: "9871234560" },
    images: [{ url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400", public_id: "books_1" }],
    views: 287,
    priority: 50
  },
  {
    title: "Free Home-cooked Meals for Needy",
    description: "Our family temple kitchen prepares fresh vegetarian meals daily. We can provide free lunch boxes (Mon-Sat) to anyone in need - elderly, homeless, daily wage workers. No questions asked. Just come and eat!",
    category: "Offer",
    city: "Chennai",
    area: "Mylapore",
    urgency: "Low",
    contact: { name: "Temple Committee", phone: "044-24986523" },
    images: [{ url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", public_id: "food_1" }],
    views: 534,
    priority: 60
  },
  {
    title: "Offering Free Legal Consultation",
    description: "I'm a practicing advocate with 15 years experience. Offering free legal advice for domestic violence victims, property disputes, and consumer complaints. First consultation absolutely free. Help the helpless find justice.",
    category: "Offer",
    city: "Mumbai",
    area: "Andheri East",
    urgency: "Low",
    contact: { name: "Adv. Prerna Singh", phone: "9967891234", email: "adv.prerna@legalaid.com" },
    images: [],
    views: 198,
    priority: 45
  },

  // More Blood Needed
  {
    title: "A+ Blood Required for Thalassemia Patient",
    description: "My 8-year-old daughter requires regular blood transfusions due to Thalassemia Major. Looking for A+ blood donors who can donate once every 3 months. Currently admitted at Fortis Hospital.",
    category: "Blood Needed",
    city: "Kolkata",
    area: "Salt Lake",
    urgency: "High",
    contact: { name: "Amit Banerjee", phone: "9830456789" },
    images: [],
    views: 312,
    priority: 165
  },

  // More Help Needed
  {
    title: "Need Volunteers for Weekend Tree Plantation",
    description: "Join us this Sunday for a community tree plantation drive near Electronic City. We have 500 saplings to plant! Tools and refreshments will be provided. Let's make Bangalore green again! 🌳",
    category: "Help Needed",
    city: "Bangalore",
    area: "Electronic City",
    urgency: "Low",
    contact: { name: "Green Earth Foundation", phone: "080-23456789", email: "volunteer@greenearth.org" },
    images: [{ url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400", public_id: "tree_1" }],
    views: 445,
    priority: 65
  },
  {
    title: "Medical Help Needed for Street Animals",
    description: "We rescue injured stray dogs and cats but struggling with veterinary bills. Looking for volunteer vets or donations for treatment of 15 animals currently in our shelter. Every small help counts!",
    category: "Help Needed",
    city: "Jaipur",
    area: "C-Scheme",
    urgency: "Medium",
    contact: { name: "Paws & Claws Rescue", phone: "9413567890" },
    images: [{ url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400", public_id: "dogs_2" }],
    views: 267,
    priority: 90
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!\n');

    // Clear existing posts (optional - comment out to keep existing data)
    console.log('Clearing existing posts...');
    await Post.deleteMany({});
    console.log('Cleared!\n');

    // Add creation dates and expiry
    const postsWithDates = samplePosts.map((post, index) => {
      // Stagger creation dates over the past week
      const daysAgo = Math.floor(index / 3);
      const hoursAgo = (index % 24);
      const createdAt = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000));
      const expiresAt = new Date(createdAt.getTime() + (7 * 24 * 60 * 60 * 1000));

      return {
        ...post,
        createdAt,
        expiresAt,
        status: 'active'
      };
    });

    console.log('Inserting sample posts...');
    await Post.insertMany(postsWithDates);
    console.log(`✅ Successfully inserted ${postsWithDates.length} posts!\n`);

    // Show summary
    const stats = await Post.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    console.log('📊 Posts Summary:');
    stats.forEach(s => console.log(`   ${s._id}: ${s.count}`));

    await mongoose.connection.close();
    console.log('\n✅ Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
