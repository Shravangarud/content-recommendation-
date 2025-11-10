// Simple in-memory database for development/testing without MongoDB
class MemoryDB {
  constructor() {
    this.users = [];
    this.content = [];
    this.interactions = [];
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Sample content data
    this.content = [
      {
        _id: '1',
        title: 'Getting Started with AI',
        description: 'Learn the basics of artificial intelligence and machine learning in this comprehensive guide.',
        type: 'article',
        category: 'Technology',
        tags: ['AI', 'Machine Learning', 'Technology'],
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
        url: 'https://example.com/ai-guide',
        author: 'Tech Writer',
        stats: { views: 1250, likes: 89, averageRating: 4.5, ratingCount: 45 },
        createdAt: new Date('2024-01-15')
      },
      {
        _id: '2',
        title: 'Web Development Tutorial',
        description: 'Master modern web development with React, Node.js, and MongoDB in this step-by-step tutorial.',
        type: 'video',
        category: 'Programming',
        tags: ['Web Dev', 'React', 'Node.js'],
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        url: 'https://example.com/web-dev',
        author: 'Code Master',
        stats: { views: 2100, likes: 156, averageRating: 4.8, ratingCount: 78 },
        createdAt: new Date('2024-02-01')
      },
      {
        _id: '3',
        title: 'Professional Laptop',
        description: 'High-performance laptop perfect for developers and content creators with 16GB RAM and SSD.',
        type: 'product',
        category: 'Electronics',
        tags: ['Laptop', 'Tech', 'Productivity'],
        imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        url: 'https://example.com/laptop',
        author: 'Tech Store',
        price: 1299.99,
        stats: { views: 890, likes: 67, averageRating: 4.6, ratingCount: 34 },
        createdAt: new Date('2024-01-20')
      },
      {
        _id: '4',
        title: 'Python Programming Basics',
        description: 'Complete Python programming course for beginners. Learn syntax, data structures, and more.',
        type: 'article',
        category: 'Programming',
        tags: ['Python', 'Programming', 'Tutorial'],
        imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
        url: 'https://example.com/python',
        author: 'Python Expert',
        stats: { views: 1800, likes: 134, averageRating: 4.7, ratingCount: 67 },
        createdAt: new Date('2024-02-10')
      },
      {
        _id: '5',
        title: 'Data Science Masterclass',
        description: 'Learn data science from scratch with real-world projects and hands-on exercises.',
        type: 'video',
        category: 'Data Science',
        tags: ['Data Science', 'Analytics', 'ML'],
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        url: 'https://example.com/data-science',
        author: 'Data Guru',
        stats: { views: 3200, likes: 245, averageRating: 4.9, ratingCount: 123 },
        createdAt: new Date('2024-01-25')
      },
      {
        _id: '6',
        title: 'Wireless Headphones',
        description: 'Premium noise-canceling wireless headphones with 30-hour battery life.',
        type: 'product',
        category: 'Electronics',
        tags: ['Audio', 'Headphones', 'Music'],
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        url: 'https://example.com/headphones',
        author: 'Audio Store',
        price: 299.99,
        stats: { views: 1500, likes: 112, averageRating: 4.5, ratingCount: 56 },
        createdAt: new Date('2024-02-05')
      },
      {
        _id: '7',
        title: 'Machine Learning with TensorFlow',
        description: 'Deep dive into neural networks and deep learning using TensorFlow and Keras frameworks.',
        type: 'video',
        category: 'Technology',
        tags: ['ML', 'TensorFlow', 'Deep Learning'],
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400',
        url: 'https://example.com/tensorflow',
        author: 'ML Expert',
        stats: { views: 2800, likes: 198, averageRating: 4.8, ratingCount: 89 },
        createdAt: new Date('2024-02-12')
      },
      {
        _id: '8',
        title: 'JavaScript ES6+ Features',
        description: 'Master modern JavaScript features including async/await, destructuring, and arrow functions.',
        type: 'article',
        category: 'Programming',
        tags: ['JavaScript', 'ES6', 'Web Dev'],
        imageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
        url: 'https://example.com/js-es6',
        author: 'JS Developer',
        stats: { views: 1650, likes: 145, averageRating: 4.6, ratingCount: 72 },
        createdAt: new Date('2024-02-08')
      },
      {
        _id: '9',
        title: 'Mechanical Keyboard',
        description: 'RGB mechanical gaming keyboard with customizable switches and macro keys.',
        type: 'product',
        category: 'Electronics',
        tags: ['Keyboard', 'Gaming', 'Accessories'],
        imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400',
        url: 'https://example.com/keyboard',
        author: 'Tech Gear',
        price: 159.99,
        stats: { views: 980, likes: 78, averageRating: 4.7, ratingCount: 41 },
        createdAt: new Date('2024-02-14')
      },
      {
        _id: '10',
        title: 'Cloud Computing Essentials',
        description: 'Learn AWS, Azure, and Google Cloud Platform fundamentals for modern cloud infrastructure.',
        type: 'article',
        category: 'Technology',
        tags: ['Cloud', 'AWS', 'DevOps'],
        imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400',
        url: 'https://example.com/cloud',
        author: 'Cloud Architect',
        stats: { views: 2200, likes: 167, averageRating: 4.7, ratingCount: 83 },
        createdAt: new Date('2024-02-16')
      },
      {
        _id: '11',
        title: 'Docker and Kubernetes Tutorial',
        description: 'Complete guide to containerization and orchestration with Docker and Kubernetes.',
        type: 'video',
        category: 'DevOps',
        tags: ['Docker', 'Kubernetes', 'Containers'],
        imageUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400',
        url: 'https://example.com/docker-k8s',
        author: 'DevOps Pro',
        stats: { views: 3100, likes: 234, averageRating: 4.9, ratingCount: 112 },
        createdAt: new Date('2024-02-18')
      },
      {
        _id: '12',
        title: 'Smart Watch Pro',
        description: 'Advanced fitness tracker with heart rate monitor, GPS, and 7-day battery life.',
        type: 'product',
        category: 'Electronics',
        tags: ['Wearable', 'Fitness', 'Smart Watch'],
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        url: 'https://example.com/smartwatch',
        author: 'Wearables Shop',
        price: 349.99,
        stats: { views: 1720, likes: 128, averageRating: 4.6, ratingCount: 64 },
        createdAt: new Date('2024-02-20')
      },
      {
        _id: '13',
        title: 'React Hooks Deep Dive',
        description: 'Master React Hooks including useState, useEffect, useContext, and custom hooks.',
        type: 'article',
        category: 'Programming',
        tags: ['React', 'Hooks', 'Frontend'],
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        url: 'https://example.com/react-hooks',
        author: 'React Expert',
        stats: { views: 1950, likes: 156, averageRating: 4.8, ratingCount: 78 },
        createdAt: new Date('2024-02-22')
      },
      {
        _id: '14',
        title: 'Cybersecurity Fundamentals',
        description: 'Essential cybersecurity concepts, threats, and best practices for protecting systems.',
        type: 'video',
        category: 'Security',
        tags: ['Security', 'Cybersecurity', 'Protection'],
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
        url: 'https://example.com/cybersecurity',
        author: 'Security Expert',
        stats: { views: 2650, likes: 189, averageRating: 4.7, ratingCount: 94 },
        createdAt: new Date('2024-02-24')
      },
      {
        _id: '15',
        title: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
        type: 'product',
        category: 'Electronics',
        tags: ['Mouse', 'Accessories', 'Office'],
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        url: 'https://example.com/mouse',
        author: 'Tech Accessories',
        price: 49.99,
        stats: { views: 850, likes: 62, averageRating: 4.5, ratingCount: 38 },
        createdAt: new Date('2024-02-26')
      },
      {
        _id: '16',
        title: 'SQL Database Design',
        description: 'Learn database normalization, indexing, and query optimization for SQL databases.',
        type: 'article',
        category: 'Database',
        tags: ['SQL', 'Database', 'Backend'],
        imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400',
        url: 'https://example.com/sql',
        author: 'Database Admin',
        stats: { views: 1580, likes: 118, averageRating: 4.6, ratingCount: 59 },
        createdAt: new Date('2024-02-28')
      },
      {
        _id: '17',
        title: 'Mobile App Development',
        description: 'Build cross-platform mobile apps with React Native and Flutter.',
        type: 'video',
        category: 'Programming',
        tags: ['Mobile', 'React Native', 'Flutter'],
        imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
        url: 'https://example.com/mobile-dev',
        author: 'Mobile Dev Expert',
        stats: { views: 2450, likes: 178, averageRating: 4.8, ratingCount: 87 },
        createdAt: new Date('2024-03-01')
      },
      {
        _id: '18',
        title: '4K Webcam',
        description: 'Professional 4K webcam with auto-focus and noise-canceling microphone.',
        type: 'product',
        category: 'Electronics',
        tags: ['Webcam', 'Streaming', 'Video'],
        imageUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400',
        url: 'https://example.com/webcam',
        author: 'Camera Store',
        price: 199.99,
        stats: { views: 1120, likes: 89, averageRating: 4.6, ratingCount: 47 },
        createdAt: new Date('2024-03-03')
      },
      {
        _id: '19',
        title: 'GraphQL API Development',
        description: 'Build efficient and flexible APIs with GraphQL, Apollo, and Node.js.',
        type: 'article',
        category: 'Backend',
        tags: ['GraphQL', 'API', 'Backend'],
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
        url: 'https://example.com/graphql',
        author: 'Backend Developer',
        stats: { views: 1780, likes: 142, averageRating: 4.7, ratingCount: 71 },
        createdAt: new Date('2024-03-05')
      },
      {
        _id: '20',
        title: 'Blockchain Basics',
        description: 'Understanding blockchain technology, cryptocurrencies, and smart contracts.',
        type: 'video',
        category: 'Technology',
        tags: ['Blockchain', 'Crypto', 'Web3'],
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
        url: 'https://example.com/blockchain',
        author: 'Blockchain Expert',
        stats: { views: 3300, likes: 256, averageRating: 4.8, ratingCount: 124 },
        createdAt: new Date('2024-03-07')
      },
      {
        _id: '21',
        title: 'Startup Growth Strategies',
        description: 'Learn proven strategies for scaling your startup from zero to profitable business.',
        type: 'article',
        category: 'Business',
        tags: ['Startup', 'Entrepreneurship', 'Growth'],
        imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
        url: 'https://example.com/startup-growth',
        author: 'Business Mentor',
        stats: { views: 2100, likes: 167, averageRating: 4.7, ratingCount: 82 },
        createdAt: new Date('2024-03-08')
      },
      {
        _id: '22',
        title: 'NBA Championship Highlights',
        description: 'Watch the most exciting moments and game-winning plays from this season.',
        type: 'video',
        category: 'Sports',
        tags: ['Basketball', 'NBA', 'Highlights'],
        imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
        url: 'https://example.com/nba-highlights',
        author: 'Sports Network',
        stats: { views: 4200, likes: 312, averageRating: 4.9, ratingCount: 156 },
        createdAt: new Date('2024-03-09')
      },
      {
        _id: '23',
        title: 'Top 10 Movies of 2024',
        description: 'Discover the must-watch films that defined cinema this year with reviews and ratings.',
        type: 'article',
        category: 'Entertainment',
        tags: ['Movies', 'Cinema', 'Reviews'],
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
        url: 'https://example.com/top-movies-2024',
        author: 'Film Critic',
        stats: { views: 3500, likes: 278, averageRating: 4.8, ratingCount: 134 },
        createdAt: new Date('2024-03-10')
      },
      {
        _id: '24',
        title: 'Financial Planning Guide',
        description: 'Master personal finance, investing, and wealth building strategies for long-term success.',
        type: 'article',
        category: 'Business',
        tags: ['Finance', 'Investing', 'Money'],
        imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
        url: 'https://example.com/financial-planning',
        author: 'Financial Advisor',
        stats: { views: 2650, likes: 198, averageRating: 4.8, ratingCount: 95 },
        createdAt: new Date('2024-03-11')
      },
      {
        _id: '25',
        title: 'Soccer World Cup Analysis',
        description: 'Expert analysis of tactics, player performances, and memorable moments from the tournament.',
        type: 'video',
        category: 'Sports',
        tags: ['Soccer', 'Football', 'World Cup'],
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
        url: 'https://example.com/world-cup',
        author: 'Soccer Analyst',
        stats: { views: 5100, likes: 423, averageRating: 4.9, ratingCount: 201 },
        createdAt: new Date('2024-03-12')
      },
      {
        _id: '26',
        title: 'Music Festival 2024',
        description: 'Experience the biggest music festival featuring top artists and electrifying performances.',
        type: 'video',
        category: 'Entertainment',
        tags: ['Music', 'Concert', 'Festival'],
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
        url: 'https://example.com/music-festival',
        author: 'Music Channel',
        stats: { views: 3800, likes: 289, averageRating: 4.7, ratingCount: 142 },
        createdAt: new Date('2024-03-13')
      },
      {
        _id: '27',
        title: 'Digital Marketing Masterclass',
        description: 'Complete guide to SEO, social media marketing, and online advertising strategies.',
        type: 'video',
        category: 'Business',
        tags: ['Marketing', 'SEO', 'Social Media'],
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        url: 'https://example.com/digital-marketing',
        author: 'Marketing Expert',
        stats: { views: 2900, likes: 215, averageRating: 4.8, ratingCount: 103 },
        createdAt: new Date('2024-03-14')
      },
      {
        _id: '28',
        title: 'Tennis Grand Slam Guide',
        description: 'Follow the journey of top players through the four major tennis championships.',
        type: 'article',
        category: 'Sports',
        tags: ['Tennis', 'Grand Slam', 'Sports'],
        imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
        url: 'https://example.com/tennis-grand-slam',
        author: 'Tennis Reporter',
        stats: { views: 1850, likes: 142, averageRating: 4.6, ratingCount: 68 },
        createdAt: new Date('2024-03-15')
      },
      {
        _id: '29',
        title: 'Gaming Console Reviews',
        description: 'In-depth reviews of the latest gaming consoles, exclusive titles, and performance comparisons.',
        type: 'article',
        category: 'Entertainment',
        tags: ['Gaming', 'Console', 'Reviews'],
        imageUrl: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400',
        url: 'https://example.com/gaming-consoles',
        author: 'Gaming Expert',
        stats: { views: 3200, likes: 246, averageRating: 4.7, ratingCount: 118 },
        createdAt: new Date('2024-03-16')
      },
      {
        _id: '30',
        title: 'E-commerce Success Blueprint',
        description: 'Build and scale a profitable online store with proven strategies and tools.',
        type: 'article',
        category: 'Business',
        tags: ['E-commerce', 'Online Business', 'Sales'],
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
        url: 'https://example.com/ecommerce-blueprint',
        author: 'E-commerce Coach',
        stats: { views: 2400, likes: 186, averageRating: 4.7, ratingCount: 89 },
        createdAt: new Date('2024-03-17')
      },
      {
        _id: '31',
        title: 'Formula 1 Race Highlights',
        description: 'Adrenaline-pumping moments from the fastest motorsport on the planet.',
        type: 'video',
        category: 'Sports',
        tags: ['F1', 'Racing', 'Motorsport'],
        imageUrl: 'https://images.unsplash.com/photo-1532906619279-a4b7267faa66?w=400',
        url: 'https://example.com/f1-highlights',
        author: 'Racing Network',
        stats: { views: 3900, likes: 301, averageRating: 4.8, ratingCount: 145 },
        createdAt: new Date('2024-03-18')
      },
      {
        _id: '32',
        title: 'Streaming TV Shows 2024',
        description: 'Binge-worthy series you need to watch on Netflix, Prime, and other platforms.',
        type: 'article',
        category: 'Entertainment',
        tags: ['TV Shows', 'Streaming', 'Series'],
        imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400',
        url: 'https://example.com/tv-shows-2024',
        author: 'Entertainment Writer',
        stats: { views: 4100, likes: 324, averageRating: 4.8, ratingCount: 158 },
        createdAt: new Date('2024-03-19')
      },
      {
        _id: '33',
        title: 'Leadership and Management',
        description: 'Essential leadership skills and management techniques for modern business leaders.',
        type: 'video',
        category: 'Business',
        tags: ['Leadership', 'Management', 'Career'],
        imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
        url: 'https://example.com/leadership',
        author: 'Leadership Coach',
        stats: { views: 2700, likes: 203, averageRating: 4.7, ratingCount: 96 },
        createdAt: new Date('2024-03-20')
      },
      {
        _id: '34',
        title: 'Olympic Games Coverage',
        description: 'Comprehensive coverage of athletic excellence and inspiring stories from the Olympics.',
        type: 'video',
        category: 'Sports',
        tags: ['Olympics', 'Athletics', 'Sports'],
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
        url: 'https://example.com/olympics',
        author: 'Olympic Network',
        stats: { views: 5500, likes: 445, averageRating: 4.9, ratingCount: 218 },
        createdAt: new Date('2024-03-21')
      },
      {
        _id: '35',
        title: 'Celebrity Interviews 2024',
        description: 'Exclusive interviews with Hollywood stars, musicians, and influential personalities.',
        type: 'video',
        category: 'Entertainment',
        tags: ['Celebrity', 'Interviews', 'Hollywood'],
        imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400',
        url: 'https://example.com/celebrity-interviews',
        author: 'Entertainment Tonight',
        stats: { views: 3600, likes: 279, averageRating: 4.6, ratingCount: 132 },
        createdAt: new Date('2024-03-22')
      },
      {
        _id: '36',
        title: 'Business Networking Tips',
        description: 'Build valuable professional connections and grow your business network effectively.',
        type: 'article',
        category: 'Business',
        tags: ['Networking', 'Professional', 'Career'],
        imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400',
        url: 'https://example.com/networking',
        author: 'Business Consultant',
        stats: { views: 1950, likes: 148, averageRating: 4.6, ratingCount: 71 },
        createdAt: new Date('2024-03-23')
      },
      {
        _id: '37',
        title: 'Cricket World Series',
        description: 'Epic battles, incredible innings, and unforgettable moments from international cricket.',
        type: 'video',
        category: 'Sports',
        tags: ['Cricket', 'World Series', 'Sports'],
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400',
        url: 'https://example.com/cricket',
        author: 'Cricket Channel',
        stats: { views: 4500, likes: 356, averageRating: 4.8, ratingCount: 167 },
        createdAt: new Date('2024-03-24')
      },
      {
        _id: '38',
        title: 'Stand-Up Comedy Special',
        description: 'Laugh out loud with the funniest comedians performing their best material.',
        type: 'video',
        category: 'Entertainment',
        tags: ['Comedy', 'Stand-up', 'Humor'],
        imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400',
        url: 'https://example.com/comedy-special',
        author: 'Comedy Central',
        stats: { views: 3100, likes: 268, averageRating: 4.7, ratingCount: 125 },
        createdAt: new Date('2024-03-25')
      },
      {
        _id: '39',
        title: 'Productivity Hacks for Professionals',
        description: 'Time management strategies and productivity tools to maximize your work efficiency.',
        type: 'article',
        category: 'Business',
        tags: ['Productivity', 'Time Management', 'Efficiency'],
        imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
        url: 'https://example.com/productivity',
        author: 'Productivity Expert',
        stats: { views: 2300, likes: 176, averageRating: 4.7, ratingCount: 84 },
        createdAt: new Date('2024-03-26')
      },
      {
        _id: '40',
        title: 'Boxing Championship Fight',
        description: 'Witness the most anticipated boxing match with world-class fighters going head-to-head.',
        type: 'video',
        category: 'Sports',
        tags: ['Boxing', 'Fight', 'Championship'],
        imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400',
        url: 'https://example.com/boxing',
        author: 'Boxing Network',
        stats: { views: 3700, likes: 289, averageRating: 4.8, ratingCount: 136 },
        createdAt: new Date('2024-03-27')
      },
      {
        _id: '41',
        title: 'Quantum Physics Explained',
        description: 'Understand the fascinating world of quantum mechanics and its real-world applications.',
        type: 'article',
        category: 'Science',
        tags: ['Physics', 'Quantum', 'Science'],
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
        url: 'https://example.com/quantum-physics',
        author: 'Physics Professor',
        stats: { views: 2800, likes: 215, averageRating: 4.8, ratingCount: 102 },
        createdAt: new Date('2024-03-28')
      },
      {
        _id: '42',
        title: 'Fitness Tracker Watch',
        description: 'Advanced health monitoring smartwatch with heart rate, sleep tracking, and calorie counter.',
        type: 'product',
        category: 'Health',
        tags: ['Fitness', 'Health', 'Wearable'],
        imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
        url: 'https://example.com/fitness-tracker',
        author: 'Health Tech Store',
        price: 249.99,
        stats: { views: 2100, likes: 167, averageRating: 4.6, ratingCount: 89 },
        createdAt: new Date('2024-03-29')
      },
      {
        _id: '43',
        title: 'Climate Change Documentary',
        description: 'Eye-opening documentary about global warming, environmental impact, and sustainable solutions.',
        type: 'video',
        category: 'Science',
        tags: ['Environment', 'Climate', 'Documentary'],
        imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=400',
        url: 'https://example.com/climate-change',
        author: 'Science Channel',
        stats: { views: 4200, likes: 356, averageRating: 4.9, ratingCount: 178 },
        createdAt: new Date('2024-03-30')
      },
      {
        _id: '44',
        title: 'Yoga Mat Pro',
        description: 'Premium eco-friendly yoga mat with superior grip and cushioning for all fitness levels.',
        type: 'product',
        category: 'Health',
        tags: ['Yoga', 'Fitness', 'Wellness'],
        imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
        url: 'https://example.com/yoga-mat',
        author: 'Wellness Store',
        price: 79.99,
        stats: { views: 1650, likes: 128, averageRating: 4.7, ratingCount: 73 },
        createdAt: new Date('2024-03-31')
      },
      {
        _id: '45',
        title: 'Space Exploration 2024',
        description: 'Latest discoveries from Mars missions, telescopes, and the search for extraterrestrial life.',
        type: 'article',
        category: 'Science',
        tags: ['Space', 'Astronomy', 'NASA'],
        imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400',
        url: 'https://example.com/space-exploration',
        author: 'Space Scientist',
        stats: { views: 3500, likes: 289, averageRating: 4.8, ratingCount: 134 },
        createdAt: new Date('2024-04-01')
      },
      {
        _id: '46',
        title: 'Nutrition Guide for Athletes',
        description: 'Complete nutritional strategies, meal plans, and supplements for peak athletic performance.',
        type: 'article',
        category: 'Health',
        tags: ['Nutrition', 'Fitness', 'Diet'],
        imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
        url: 'https://example.com/nutrition-guide',
        author: 'Sports Nutritionist',
        stats: { views: 2600, likes: 198, averageRating: 4.7, ratingCount: 95 },
        createdAt: new Date('2024-04-02')
      },
      {
        _id: '47',
        title: 'DNA and Genetics Explained',
        description: 'Understanding genetics, heredity, and breakthrough discoveries in DNA sequencing.',
        type: 'video',
        category: 'Science',
        tags: ['Genetics', 'DNA', 'Biology'],
        imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400',
        url: 'https://example.com/dna-genetics',
        author: 'Biology Expert',
        stats: { views: 3100, likes: 245, averageRating: 4.8, ratingCount: 118 },
        createdAt: new Date('2024-04-03')
      },
      {
        _id: '48',
        title: 'Air Purifier HEPA',
        description: 'Medical-grade HEPA air purifier removes 99.97% of allergens, dust, and pollutants.',
        type: 'product',
        category: 'Health',
        tags: ['Air Quality', 'Health', 'Home'],
        imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
        url: 'https://example.com/air-purifier',
        author: 'Health Home',
        price: 299.99,
        stats: { views: 1900, likes: 142, averageRating: 4.6, ratingCount: 78 },
        createdAt: new Date('2024-04-04')
      },
      {
        _id: '49',
        title: 'Ocean Life Documentary',
        description: 'Stunning underwater exploration of marine ecosystems and endangered ocean species.',
        type: 'video',
        category: 'Science',
        tags: ['Ocean', 'Marine Biology', 'Nature'],
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
        url: 'https://example.com/ocean-life',
        author: 'Nature Films',
        stats: { views: 3800, likes: 312, averageRating: 4.9, ratingCount: 156 },
        createdAt: new Date('2024-04-05')
      },
      {
        _id: '50',
        title: 'Mental Health Wellness',
        description: 'Evidence-based strategies for managing stress, anxiety, and improving mental well-being.',
        type: 'article',
        category: 'Health',
        tags: ['Mental Health', 'Wellness', 'Psychology'],
        imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400',
        url: 'https://example.com/mental-health',
        author: 'Psychologist',
        stats: { views: 4500, likes: 378, averageRating: 4.9, ratingCount: 189 },
        createdAt: new Date('2024-04-06')
      },
      {
        _id: '51',
        title: 'Protein Powder Whey',
        description: 'High-quality whey protein isolate for muscle building and post-workout recovery.',
        type: 'product',
        category: 'Health',
        tags: ['Protein', 'Supplements', 'Fitness'],
        imageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400',
        url: 'https://example.com/protein-powder',
        author: 'Nutrition Shop',
        price: 59.99,
        stats: { views: 2200, likes: 176, averageRating: 4.7, ratingCount: 94 },
        createdAt: new Date('2024-04-07')
      },
      {
        _id: '52',
        title: 'Renewable Energy Future',
        description: 'Solar, wind, and hydroelectric innovations shaping sustainable energy solutions.',
        type: 'article',
        category: 'Science',
        tags: ['Energy', 'Sustainability', 'Technology'],
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
        url: 'https://example.com/renewable-energy',
        author: 'Energy Expert',
        stats: { views: 2900, likes: 223, averageRating: 4.7, ratingCount: 106 },
        createdAt: new Date('2024-04-08')
      },
      {
        _id: '53',
        title: 'Meditation App Premium',
        description: 'Guided meditation, sleep stories, and mindfulness exercises for daily practice.',
        type: 'product',
        category: 'Health',
        tags: ['Meditation', 'Mindfulness', 'App'],
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
        url: 'https://example.com/meditation-app',
        author: 'Wellness Apps',
        price: 9.99,
        stats: { views: 1800, likes: 145, averageRating: 4.8, ratingCount: 82 },
        createdAt: new Date('2024-04-09')
      },
      {
        _id: '54',
        title: 'Neuroscience Breakthroughs',
        description: 'Latest research in brain science, cognitive function, and neurological treatments.',
        type: 'video',
        category: 'Science',
        tags: ['Neuroscience', 'Brain', 'Research'],
        imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
        url: 'https://example.com/neuroscience',
        author: 'Brain Research Lab',
        stats: { views: 3300, likes: 267, averageRating: 4.8, ratingCount: 128 },
        createdAt: new Date('2024-04-10')
      },
      {
        _id: '55',
        title: 'Organic Vitamin Supplements',
        description: 'All-natural multivitamin complex with essential nutrients for optimal health.',
        type: 'product',
        category: 'Health',
        tags: ['Vitamins', 'Supplements', 'Organic'],
        imageUrl: 'https://images.unsplash.com/photo-1550572017-4245e5b8b1d3?w=400',
        url: 'https://example.com/vitamins',
        author: 'Organic Health',
        price: 34.99,
        stats: { views: 1700, likes: 132, averageRating: 4.6, ratingCount: 67 },
        createdAt: new Date('2024-04-11')
      }
    ];
  }

  // Content methods
  async findAllContent(filters = {}) {
    let result = [...this.content];
    
    if (filters.type) {
      result = result.filter(c => c.type === filters.type);
    }
    if (filters.category) {
      result = result.filter(c => c.category === filters.category);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(search) || 
        c.description.toLowerCase().includes(search)
      );
    }
    
    return result;
  }

  async findContentById(id) {
    return this.content.find(c => c._id === id);
  }

  // User methods
  async findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  async createUser(userData) {
    const user = {
      _id: String(this.users.length + 1),
      ...userData,
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  // Analytics methods
  async getAnalytics() {
    return {
      totalContent: this.content.length,
      totalUsers: this.users.length,
      totalInteractions: this.interactions.length,
      totalViews: this.content.reduce((sum, c) => sum + c.stats.views, 0),
      totalLikes: this.content.reduce((sum, c) => sum + c.stats.likes, 0)
    };
  }

  async getMostViewed(limit = 10) {
    return [...this.content]
      .sort((a, b) => b.stats.views - a.stats.views)
      .slice(0, limit);
  }

  async getTrending(limit = 10) {
    return [...this.content]
      .sort((a, b) => {
        const scoreA = b.stats.views + b.stats.likes * 2;
        const scoreB = a.stats.views + a.stats.likes * 2;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }
}

module.exports = new MemoryDB();
