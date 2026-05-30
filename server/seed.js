/**
 * seed.js — StarVnt Demo Data Seeder
 * =====================================
 * Run with: npm run seed  (from the /server directory)
 *
 * This script:
 *  1. Connects to MongoDB
 *  2. Clears existing Users, VendorProfiles, and Inquiries
 *  3. Creates 3 demo vendor accounts with profiles
 *  4. Creates 12 sample inquiries spread across all statuses
 *
 * Demo Credentials:
 *   📷 Photographer: aditya@starvnt.com  / password123
 *   🎨 Decorator:    priya@starvnt.com   / password123
 *   🎧 DJ:           rahul@starvnt.com   / password123
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/model.user.js";
import VendorProfile from "./models/model.vendorProfile.js";
import Inquiry from "./models/model.inquiry.js";

dotenv.config();

const VENDOR_CATEGORIES = [
  "Photographer",
  "Decorator",
  "DJ",
  "Makeup Artist",
  "Caterer",
  "Anchor",
  "Event Planner",
];

const vendorData = [
  {
    name: "Aditya Kapoor",
    email: "aditya@starvnt.com",
    password: "password123",
    profile: {
      vendorName: "Aditya Kapoor Photography",
      category: "Photographer",
      location: "Mumbai, Maharashtra",
      contact: "+91 98765 43210",
      bio: "Award-winning wedding and event photographer with 8+ years of experience. Specializing in candid moments and cinematic storytelling across India.",
    },
  },
  {
    name: "Priya Sharma",
    email: "priya@starvnt.com",
    password: "password123",
    profile: {
      vendorName: "Priya Decor Studio",
      category: "Decorator",
      location: "Delhi, NCR",
      contact: "+91 87654 32109",
      bio: "Transforming venues into breathtaking experiences. Specialized in floral decor, mandap design, and luxury event styling for weddings and corporate events.",
    },
  },
  {
    name: "Rahul Verma",
    email: "rahul@starvnt.com",
    password: "password123",
    profile: {
      vendorName: "DJ Rahul – The Beat Master",
      category: "DJ",
      location: "Bangalore, Karnataka",
      contact: "+91 76543 21098",
      bio: "Professional DJ and sound engineer with 6 years of experience. From Bollywood hits to EDM, I create unforgettable musical experiences for weddings, corporate events, and private parties.",
    },
  },
];

const inquiryTemplates = [
  {
    clientName: "Sneha Gupta",
    clientEmail: "sneha.gupta@gmail.com",
    clientPhone: "+91 99887 76655",
    eventType: "Wedding",
    eventDate: new Date("2026-11-15"),
    message: "Hi! We are planning our wedding ceremony and would love to have you capture our special day. We expect around 300 guests. Please let us know your availability and packages.",
    status: "New",
    vendorIndex: 0,
  },
  {
    clientName: "Arjun Mehta",
    clientEmail: "arjun.mehta@outlook.com",
    clientPhone: "+91 88776 65544",
    eventType: "Corporate",
    eventDate: new Date("2026-07-20"),
    message: "We need photography coverage for our annual product launch event in Mumbai. Duration: 6 hours. Please share your corporate event packages.",
    status: "Contacted",
    vendorIndex: 0,
  },
  {
    clientName: "Kavya Nair",
    clientEmail: "kavya.nair@gmail.com",
    clientPhone: "+91 77665 54433",
    eventType: "Birthday",
    eventDate: new Date("2026-08-10"),
    message: "Planning a surprise 30th birthday party for my husband. Need candid photography for 4 hours. Approximately 80 guests.",
    status: "Confirmed",
    vendorIndex: 0,
  },
  {
    clientName: "Rohan Desai",
    clientEmail: "rohan.desai@company.com",
    clientPhone: "+91 66554 43322",
    eventType: "Conference",
    eventDate: new Date("2026-06-05"),
    message: "We had a different photographer lined up who cancelled last minute. Looking for emergency coverage for a 2-day tech conference.",
    status: "Rejected",
    vendorIndex: 0,
  },
  {
    clientName: "Meera Patel",
    clientEmail: "meera.patel@gmail.com",
    clientPhone: "+91 55443 32211",
    eventType: "Wedding",
    eventDate: new Date("2026-12-20"),
    message: "Dream wedding coming up! We want floral mandap decor, full venue transformation, and beautiful floral centrepieces. Budget is flexible for the right decorator.",
    status: "New",
    vendorIndex: 1,
  },
  {
    clientName: "Ananya Singh",
    clientEmail: "ananya.singh@gmail.com",
    clientPhone: "+91 44332 21100",
    eventType: "Anniversary",
    eventDate: new Date("2026-09-14"),
    message: "Celebrating our 25th anniversary. Want intimate rose-themed decor for 50 guests at a 5-star hotel. Can you do a walkthrough this weekend?",
    status: "Contacted",
    vendorIndex: 1,
  },
  {
    clientName: "Vikram Joshi",
    clientEmail: "vikram.joshi@business.in",
    clientPhone: "+91 33221 10099",
    eventType: "Corporate",
    eventDate: new Date("2026-07-08"),
    message: "Annual gala dinner for 200 corporate executives. Need full venue setup — tables, stage backdrop, lighting, and floral arrangements. White and gold theme.",
    status: "Confirmed",
    vendorIndex: 1,
  },
  {
    clientName: "Diya Krishnan",
    clientEmail: "diya.k@gmail.com",
    clientPhone: "+91 22110 09988",
    eventType: "Fashion Show",
    eventDate: new Date("2026-06-25"),
    message: "Organizing a college fashion show. Need a DJ who can mix Bollywood, pop, and high-energy music for 3-hour show. We have around 500 students attending.",
    status: "New",
    vendorIndex: 2,
  },
  {
    clientName: "Karan Malhotra",
    clientEmail: "karan.malhotra@gmail.com",
    clientPhone: "+91 11009 98877",
    eventType: "Wedding",
    eventDate: new Date("2026-10-30"),
    message: "Big fat Punjabi wedding! We need a DJ who knows how to get the crowd going from sangeet to reception. Two nights of events. Looking for the best!",
    status: "Contacted",
    vendorIndex: 2,
  },
  {
    clientName: "Pooja Bhatia",
    clientEmail: "pooja.bhatia@startup.io",
    clientPhone: "+91 98877 66554",
    eventType: "Concert",
    eventDate: new Date("2026-08-22"),
    message: "Indie music concert for 1000 attendees. Need professional DJ for warmup set (2 hours) before the main act. EDM and house music preferred.",
    status: "Confirmed",
    vendorIndex: 2,
  },
  {
    clientName: "Nisha Agarwal",
    clientEmail: "nisha.agarwal@gmail.com",
    clientPhone: "+91 87765 44332",
    eventType: "Birthday",
    eventDate: new Date("2026-07-15"),
    message: "Kids birthday party DJ for 3 hours. Mostly kid-friendly music, some games, and a special birthday segment. About 40 kids aged 8-12.",
    status: "New",
    vendorIndex: 2,
  },
  {
    clientName: "Sanjay Reddy",
    clientEmail: "sanjay.reddy@enterprise.com",
    clientPhone: "+91 76654 33221",
    eventType: "Corporate",
    eventDate: new Date("2026-06-12"),
    message: "We contacted you previously but never got a response. Following up on DJ services for our team building event.",
    status: "Rejected",
    vendorIndex: 2,
  },
];

const seed = async () => {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // ── Clear existing data ──────────────────────────────────────────────────
    console.log("🗑️  Clearing existing seed data...");
    await Inquiry.deleteMany({});
    await VendorProfile.deleteMany({});
    await User.deleteMany({});
    console.log("✅ Cleared Users, VendorProfiles, and Inquiries\n");

    // ── Create vendor users + profiles ───────────────────────────────────────
    console.log("👤 Creating vendor accounts...");
    const createdVendors = [];

    for (const vendor of vendorData) {
      const user = await User.create({
        name: vendor.name,
        email: vendor.email,
        password: vendor.password,
        role: "vendor",
      });

      const profile = await VendorProfile.create({
        user: user._id,
        ...vendor.profile,
      });

      createdVendors.push({ user, profile });
      console.log(`  ✅ Created: ${vendor.profile.vendorName} (${vendor.email})`);
    }

    // ── Create inquiries ─────────────────────────────────────────────────────
    console.log("\n📬 Creating sample inquiries...");
    for (const template of inquiryTemplates) {
      const vendorProfile = createdVendors[template.vendorIndex].profile;
      await Inquiry.create({
        vendor: vendorProfile._id,
        clientName: template.clientName,
        clientEmail: template.clientEmail,
        clientPhone: template.clientPhone,
        eventType: template.eventType,
        eventDate: template.eventDate,
        message: template.message,
        status: template.status,
      });
      console.log(`  ✅ Inquiry from ${template.clientName} → ${vendorProfile.vendorName} [${template.status}]`);
    }

    // ── Summary ──────────────────────────────────────────────────────────────
    console.log("\n🎉 Seed complete!");
    console.log("─".repeat(50));
    console.log("Demo Login Credentials:");
    console.log("  📷 Photographer: aditya@starvnt.com  / password123");
    console.log("  🎨 Decorator:    priya@starvnt.com   / password123");
    console.log("  🎧 DJ:           rahul@starvnt.com   / password123");
    console.log("─".repeat(50));
    console.log(`\n📊 Database Summary:`);
    console.log(`  Users:          ${await User.countDocuments()}`);
    console.log(`  VendorProfiles: ${await VendorProfile.countDocuments()}`);
    console.log(`  Inquiries:      ${await Inquiry.countDocuments()}`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
