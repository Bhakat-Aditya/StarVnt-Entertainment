// seed.js
// Demo data seeder for StarVnt.
// Run this script ONCE to populate the database with sample data.
// Usage: node seed.js
// WARNING: This will clear existing users/profiles/inquiries before seeding.

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/model.user.js";
import VendorProfile from "./models/model.vendorProfile.js";
import Inquiry from "./models/model.inquiry.js";

dotenv.config();

// --- Sample Data ---
const sampleUsers = [
  {
    name: "Aria Photography",
    email: "aria@starvnt.com",
    password: "password123",
    role: "vendor",
  },
  {
    name: "Elite Caterers",
    email: "elite@starvnt.com",
    password: "password123",
    role: "vendor",
  },
];

const sampleInquiries = [
  {
    clientName: "James & Priya Wilson",
    clientEmail: "james.wilson@email.com",
    clientPhone: "+91 98765 43210",
    eventDate: new Date("2026-09-15"),
    eventType: "Wedding",
    message:
      "We are looking for a professional photographer for our wedding ceremony and reception. We expect around 150 guests.",
    status: "New",
  },
  {
    clientName: "TechCorp Events",
    clientEmail: "events@techcorp.io",
    clientPhone: "+91 87654 32109",
    eventDate: new Date("2026-07-22"),
    eventType: "Corporate",
    message:
      "Annual company event for 200 employees. Need full event coverage including keynotes and dinner.",
    status: "Contacted",
  },
  {
    clientName: "Riya Sharma",
    clientEmail: "riya.sharma@gmail.com",
    clientPhone: "+91 76543 21098",
    eventDate: new Date("2026-06-28"),
    eventType: "Birthday",
    message: "Milestone 30th birthday party. Looking for candid photography and a short video reel.",
    status: "Confirmed",
  },
  {
    clientName: "Mumbai Fashion Week",
    clientEmail: "mfw@fashionweek.in",
    clientPhone: "+91 65432 10987",
    eventDate: new Date("2026-08-05"),
    eventType: "Fashion Show",
    message:
      "Fashion week event photography. Multiple runway shows over 2 days. Looking for a team of photographers.",
    status: "Rejected",
  },
  {
    clientName: "Anil & Sunita Mehta",
    clientEmail: "mehta.family@email.com",
    clientPhone: "+91 54321 09876",
    eventDate: new Date("2026-10-20"),
    eventType: "Anniversary",
    message: "25th wedding anniversary celebration for 80 guests. Silver themed event.",
    status: "New",
  },
  {
    clientName: "Startup Founders Summit",
    clientEmail: "summit@startups.in",
    clientPhone: "+91 43210 98765",
    eventDate: new Date("2026-07-10"),
    eventType: "Conference",
    message: "2-day founders conference with 300 attendees. Need stage photography and networking session coverage.",
    status: "Contacted",
  },
];

// --- Seed Function ---
const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("🗑️  Clearing existing data...");

    // Delete all existing documents in these collections
    await Inquiry.deleteMany({});
    await VendorProfile.deleteMany({});
    await User.deleteMany({});

    console.log("👤 Creating sample users...");

    // Hash passwords manually (since we're using User.insertMany which bypasses pre-save hooks)
    // Instead, we'll create users one by one to trigger the pre-save hook
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData); // triggers pre-save password hash
      createdUsers.push(user);
      console.log(`   ✅ Created user: ${user.email}`);
    }

    console.log("🏪 Creating vendor profiles...");

    const profiles = [
      {
        user: createdUsers[0]._id,
        vendorName: "Aria Photography Studio",
        category: "Photography",
        location: "Mumbai, Maharashtra",
        contact: "+91 98765 43210",
        bio: "Award-winning photography studio specializing in weddings, corporate events, and fashion. Over 500 events captured with passion and creativity.",
      },
      {
        user: createdUsers[1]._id,
        vendorName: "Elite Caterers & Events",
        category: "Catering",
        location: "Pune, Maharashtra",
        contact: "+91 87654 32109",
        bio: "Premium catering services for weddings, corporate events, and private parties. Specializing in multi-cuisine experiences for 50–5000 guests.",
      },
    ];

    const createdProfiles = await VendorProfile.insertMany(profiles);
    console.log(`   ✅ Created ${createdProfiles.length} vendor profiles`);

    console.log("📋 Creating sample inquiries...");

    // Assign all inquiries to the first vendor (Aria Photography)
    const inquiriesWithVendor = sampleInquiries.map((inquiry) => ({
      ...inquiry,
      vendor: createdProfiles[0]._id,
    }));

    const createdInquiries = await Inquiry.insertMany(inquiriesWithVendor);
    console.log(`   ✅ Created ${createdInquiries.length} inquiries`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("─────────────────────────────────");
    console.log("Demo Login Credentials:");
    console.log("  Email:    aria@starvnt.com");
    console.log("  Password: password123");
    console.log("─────────────────────────────────\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
