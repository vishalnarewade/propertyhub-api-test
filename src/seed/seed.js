require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Property = require('../models/Property');

const seed = async () => {
  try {
    await connectDB();
    await Promise.all([User.deleteMany({}), Property.deleteMany({})]);

    const users = [];
    users.push(
      await User.create({
        name: 'Aman Agent',
        email: 'agent@example.com',
        password: 'password123',
        role: 'agent'
      })
    );
    users.push(
      await User.create({
        name: 'Ria Seeker',
        email: 'seeker@example.com',
        password: 'password123',
        role: 'home_seeker'
      })
    );

    const agent = users.find((u) => u.role === 'agent');

    await Property.insertMany([
      {
        title: 'Modern 2BHK in Downtown',
        description: 'Bright and spacious apartment with balcony and city view.',
        price: 85000,
        bhk: 2,
        location: 'Downtown, Bangalore',
        images: [
          'https://images.unsplash.com/photo-1460317442991-0ec209397118',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
        ],
        propertyType: 'Apartment',
        area: 1100,
        contactDetails: { phone: '+91-1111111111', email: 'agent@example.com' },
        createdBy: agent._id
      },
      {
        title: 'Luxury Villa with Garden',
        description: 'Premium villa with private lawn and covered parking.',
        price: 250000,
        bhk: 4,
        location: 'Whitefield, Bangalore',
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'
        ],
        propertyType: 'Villa',
        area: 3200,
        contactDetails: { phone: '+91-111111111', email: 'agent@example.com' },
        createdBy: agent._id
      }
    ]);

    console.log('Seed data inserted successfully.');
    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
