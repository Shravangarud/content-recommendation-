const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('./backend/models/Content');
const User = require('./backend/models/User');

dotenv.config();

// Sample content data
const sampleContent = [
    {
        title: "Introduction to Machine Learning",
        description: "A comprehensive guide to understanding machine learning fundamentals, algorithms, and real-world applications in modern technology.",
        type: "article",
        category: "Technology",
        tags: ["AI", "Machine Learning", "Data Science"],
        author: "Dr. Sarah Johnson",
        imageUrl: "https://picsum.photos/400/300?random=1",
        url: "https://example.com/ml-intro",
        metadata: { duration: "10 min read", publishedDate: new Date() }
    },
    {
        title: "Building Scalable Web Applications",
        description: "Learn best practices for creating scalable, maintainable web applications using modern frameworks and cloud infrastructure.",
        type: "video",
        category: "Technology",
        tags: ["Web Development", "Cloud", "Architecture"],
        author: "Mike Chen",
        imageUrl: "https://picsum.photos/400/300?random=2",
        url: "https://example.com/scalable-web",
        metadata: { duration: "45 min", publishedDate: new Date() }
    },
    {
        title: "Wireless Noise-Canceling Headphones",
        description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and exceptional sound quality.",
        type: "product",
        category: "Technology",
        tags: ["Audio", "Electronics", "Music"],
        author: "TechGear",
        imageUrl: "https://picsum.photos/400/300?random=3",
        price: 299.99,
        metadata: { source: "TechStore" }
    },
    {
        title: "The Future of Quantum Computing",
        description: "Exploring the revolutionary potential of quantum computers and their impact on cryptography, drug discovery, and optimization problems.",
        type: "article",
        category: "Science",
        tags: ["Quantum Computing", "Physics", "Innovation"],
        author: "Prof. David Lee",
        imageUrl: "https://picsum.photos/400/300?random=4",
        url: "https://example.com/quantum-future",
        metadata: { duration: "15 min read", publishedDate: new Date() }
    },
    {
        title: "Financial Planning for Millennials",
        description: "Essential strategies for building wealth, managing debt, and securing your financial future in the modern economy.",
        type: "article",
        category: "Business",
        tags: ["Finance", "Investment", "Personal Finance"],
        author: "Emma Williams",
        imageUrl: "https://picsum.photos/400/300?random=5",
        url: "https://example.com/financial-planning",
        metadata: { duration: "8 min read", publishedDate: new Date() }
    },
    {
        title: "Top 10 Movies of 2024",
        description: "A curated list of the year's most compelling films across all genres, from blockbusters to indie gems.",
        type: "video",
        category: "Entertainment",
        tags: ["Movies", "Cinema", "Reviews"],
        author: "Film Critics United",
        imageUrl: "https://picsum.photos/400/300?random=6",
        url: "https://example.com/top-movies",
        metadata: { duration: "20 min", publishedDate: new Date() }
    },
    {
        title: "Yoga Mat Pro Plus",
        description: "Extra-thick, eco-friendly yoga mat with non-slip surface and carrying strap. Perfect for all types of yoga and pilates.",
        type: "product",
        category: "Health",
        tags: ["Fitness", "Yoga", "Wellness"],
        author: "FitLife",
        imageUrl: "https://picsum.photos/400/300?random=7",
        price: 49.99,
        metadata: { source: "FitStore" }
    },
    {
        title: "Understanding Climate Change",
        description: "Scientific evidence, current trends, and actionable steps individuals can take to combat global warming.",
        type: "article",
        category: "Science",
        tags: ["Climate", "Environment", "Sustainability"],
        author: "Dr. Rachel Green",
        imageUrl: "https://picsum.photos/400/300?random=8",
        url: "https://example.com/climate-change",
        metadata: { duration: "12 min read", publishedDate: new Date() }
    },
    {
        title: "Premier League Highlights 2024",
        description: "Best goals, saves, and moments from this season's most exciting football matches in the Premier League.",
        type: "video",
        category: "Sports",
        tags: ["Football", "Soccer", "Premier League"],
        author: "Sports Network",
        imageUrl: "https://picsum.photos/400/300?random=9",
        url: "https://example.com/premier-league",
        metadata: { duration: "30 min", publishedDate: new Date() }
    },
    {
        title: "Smart Home Security System",
        description: "Complete home security solution with HD cameras, motion sensors, and 24/7 monitoring via smartphone app.",
        type: "product",
        category: "Technology",
        tags: ["Smart Home", "Security", "IoT"],
        author: "SecureHome",
        imageUrl: "https://picsum.photos/400/300?random=10",
        price: 499.99,
        metadata: { source: "SmartStore" }
    },
    {
        title: "Healthy Meal Prep for Beginners",
        description: "Simple, nutritious recipes and practical tips for meal planning and preparation to support a healthier lifestyle.",
        type: "article",
        category: "Health",
        tags: ["Nutrition", "Cooking", "Meal Prep"],
        author: "Chef Maria Rodriguez",
        imageUrl: "https://picsum.photos/400/300?random=11",
        url: "https://example.com/meal-prep",
        metadata: { duration: "7 min read", publishedDate: new Date() }
    },
    {
        title: "Startup Success Stories 2024",
        description: "Inspiring journeys of successful startups, their challenges, pivots, and strategies that led to breakthrough growth.",
        type: "video",
        category: "Business",
        tags: ["Startups", "Entrepreneurship", "Innovation"],
        author: "Business Insider",
        imageUrl: "https://picsum.photos/400/300?random=12",
        url: "https://example.com/startup-stories",
        metadata: { duration: "35 min", publishedDate: new Date() }
    }
];

// Connect to MongoDB and seed data
async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing content
        await Content.deleteMany({});
        console.log('Cleared existing content');

        // Insert sample content
        await Content.insertMany(sampleContent);
        console.log('✅ Sample content inserted successfully');

        // Check if admin user exists
        let admin = await User.findOne({ email: 'admin@smartcontent.com' });
        if (!admin) {
            admin = new User({
                username: 'admin',
                email: 'admin@smartcontent.com',
                password: 'admin123',
                role: 'admin'
            });
            await admin.save();
            console.log('✅ Admin user created (email: admin@smartcontent.com, password: admin123)');
        }

        // Create sample user
        let user = await User.findOne({ email: 'user@example.com' });
        if (!user) {
            user = new User({
                username: 'testuser',
                email: 'user@example.com',
                password: 'user123',
                preferences: {
                    categories: ['Technology', 'Science'],
                    tags: ['AI', 'Machine Learning', 'Web Development']
                }
            });
            await user.save();
            console.log('✅ Sample user created (email: user@example.com, password: user123)');
        }

        console.log('\n🎉 Database seeded successfully!');
        console.log('\nTest Accounts:');
        console.log('Admin: admin@smartcontent.com / admin123');
        console.log('User: user@example.com / user123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
