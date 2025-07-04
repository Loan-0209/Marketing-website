const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const News = require('../models/News');

const seedUsers = async () => {
  try {
    await User.deleteMany({});

    const adminPassword = await bcrypt.hash('heart2024', 12);
    
    const users = [
      {
        username: 'admin',
        email: 'admin@heart.com',
        password: adminPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true
      },
      {
        username: 'editor',
        email: 'editor@heart.com',
        password: await bcrypt.hash('editor123', 12),
        role: 'editor',
        firstName: 'Editor',
        lastName: 'User',
        isActive: true
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('✅ Users seeded successfully');
    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

const seedNews = async (users) => {
  try {
    await News.deleteMany({});

    const adminUser = users.find(user => user.role === 'admin');

    const newsArticles = [
      {
        title: 'HEART Officially Launches Phase 1 Development',
        slug: 'heart-officially-launches-phase-1-development',
        excerpt: 'We are excited to announce the official groundbreaking ceremony for Phase 1 of HEART technology park. This milestone marks the beginning of Vietnam\'s most ambitious AI and technology hub.',
        content: 'The groundbreaking ceremony for Phase 1 of HEART technology park marks a historic moment for Vietnam\'s technology sector. With an initial investment of $600M, this phase will establish the foundation infrastructure including data centers, smart office buildings, and AI research laboratories. The project is expected to create 5,000 high-quality jobs and attract 50 leading technology companies to the region. Government officials, international investors, and technology leaders gathered to witness this momentous occasion that will transform Vietnam into a regional AI powerhouse.',
        icon: '🚀',
        category: 'announcement',
        status: 'published',
        featured: true,
        tags: ['launch', 'phase1', 'groundbreaking', 'investment'],
        author: adminUser._id,
        publishedAt: new Date('2024-12-15'),
        views: 1250,
        likes: 89
      },
      {
        title: 'Strategic Partnership with MIT Announced',
        slug: 'strategic-partnership-with-mit-announced',
        excerpt: 'HEART has formed a groundbreaking partnership with MIT\'s Computer Science and Artificial Intelligence Laboratory (CSAIL) to advance AI research and education in Southeast Asia.',
        content: 'This strategic partnership with MIT CSAIL will establish a joint research program focusing on machine learning, robotics, and quantum computing applications. The collaboration includes faculty exchange programs, joint research projects, and the establishment of a satellite research lab at HEART. MIT will contribute its world-class expertise while HEART provides the infrastructure and regional market insights. This partnership is expected to accelerate breakthrough innovations and position Vietnam as a leader in AI research and development.',
        icon: '🤝',
        category: 'partnership',
        status: 'published',
        featured: true,
        tags: ['mit', 'partnership', 'research', 'ai', 'education'],
        author: adminUser._id,
        publishedAt: new Date('2024-12-10'),
        views: 980,
        likes: 67
      },
      {
        title: '$500M Series A Funding Successfully Raised',
        excerpt: 'Leading international investors including Sequoia Capital, Andreessen Horowitz, and GIC have invested $500M to accelerate HEART\'s development timeline.',
        content: 'The successful completion of our Series A funding round represents a major vote of confidence from the global investment community. Led by Sequoia Capital with participation from Andreessen Horowitz, GIC, and other tier-1 investors, this funding will accelerate our development timeline by 18 months. The capital will be used to expand our infrastructure, recruit top talent, and establish strategic partnerships with leading technology companies. This investment validates our vision of creating Southeast Asia\'s premier AI and technology hub.',
        icon: '💰',
        category: 'funding',
        status: 'published',
        featured: false,
        tags: ['funding', 'investment', 'sequoia', 'series-a'],
        author: adminUser._id,
        publishedAt: new Date('2024-12-05'),
        views: 2100,
        likes: 156
      },
      {
        title: 'HEART Wins "Smart City Innovation Award 2024"',
        excerpt: 'The World Economic Forum has recognized HEART as the most innovative smart city project in Asia-Pacific, highlighting our sustainable technology approach.',
        content: 'At the World Economic Forum\'s Annual Meeting, HEART was honored with the Smart City Innovation Award 2024 for our comprehensive approach to sustainable urban development. The award recognizes our integration of AI, IoT, and green technologies to create a truly intelligent urban ecosystem. Our carbon-negative operations, smart energy grid, and AI-powered city management systems set new standards for sustainable development. This recognition further establishes HEART as a model for future smart cities worldwide.',
        icon: '🏆',
        category: 'award',
        status: 'published',
        featured: false,
        tags: ['award', 'wef', 'smart-city', 'innovation', 'sustainability'],
        author: adminUser._id,
        publishedAt: new Date('2024-11-28'),
        views: 1450,
        likes: 98
      },
      {
        title: 'AI Research Lab Opens for International Collaboration',
        excerpt: 'Our state-of-the-art AI research facility is now operational, welcoming researchers from around the world to collaborate on next-generation AI technologies.',
        content: 'The HEART AI Research Lab, featuring 500+ GPUs, quantum computing capabilities, and advanced simulation environments, is now open for international collaboration. The facility will host researchers from partner universities and companies to work on breakthrough AI applications in healthcare, autonomous systems, and sustainable technology. With partnerships already established with MIT, Stanford, NUS, and leading technology companies, the lab represents a new model for global AI research collaboration.',
        icon: '🔬',
        category: 'technology',
        status: 'published',
        featured: false,
        tags: ['ai', 'research', 'lab', 'collaboration', 'technology'],
        author: adminUser._id,
        publishedAt: new Date('2024-11-20'),
        views: 890,
        likes: 73
      },
      {
        title: 'Zero Carbon Footprint Achieved Ahead of Schedule',
        excerpt: 'HEART has successfully achieved carbon neutrality 5 years ahead of our 2030 target, setting a new standard for sustainable technology parks globally.',
        content: 'Through innovative green technologies, renewable energy systems, and carbon capture initiatives, HEART has achieved carbon neutrality five years ahead of schedule. Our 200MW solar farm, advanced battery storage systems, and smart energy management have eliminated our carbon footprint while actually creating negative emissions through our reforestation and carbon capture programs. This achievement demonstrates that large-scale technology development can be environmentally positive and economically sustainable.',
        icon: '🌱',
        category: 'general',
        status: 'published',
        featured: true,
        tags: ['sustainability', 'carbon-neutral', 'green-tech', 'environment'],
        author: adminUser._id,
        publishedAt: new Date('2024-11-15'),
        views: 1680,
        likes: 124
      }
    ];

    const createdNews = await News.insertMany(newsArticles);
    console.log('✅ News articles seeded successfully');
    return createdNews;
  } catch (error) {
    console.error('❌ Error seeding news:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/heart_db');
    console.log('📦 Connected to MongoDB');

    const users = await seedUsers();
    const news = await seedNews(users);

    console.log('✅ Database seeding completed successfully!');
    console.log(`👥 Created ${users.length} users`);
    console.log(`📰 Created ${news.length} news articles`);
    console.log('\n🔐 Default login credentials:');
    console.log('Username: admin');
    console.log('Password: heart2024');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };