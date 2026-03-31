const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Config = require("../src/models/config.model");

dotenv.config();

const seedData = [
  // Layer 1 — Global (lowest priority, applies to everyone)
  {
    scope: "global",
    values: {
      apiTimeout: 30000,        // 30s
      maxRetries: 3,
      logLevel: "info",
      featureFlags: {
        darkMode: false,
        betaFeatures: false,
      },
    },
    version: 1,
  },

  // Layer 2 — Environment level
  {
    scope: "environment",
    environment: "dev",
    values: {
      apiTimeout: 60000,        // dev gets more time for debugging
      logLevel: "debug",
    },
    version: 1,
  },
  {
    scope: "environment",
    environment: "production",
    values: {
      apiTimeout: 30000,
      logLevel: "error",
    },
    version: 1,
  },

  // Layer 3 — Location level (overrides environment)
  {
    scope: "location",
    environment: "production",
    location: "india",
    values: {
      apiTimeout: 25000,        // 25s for India region
      currency: "INR",
      timezone: "Asia/Kolkata",
    },
    version: 1,
  },
  {
    scope: "location",
    environment: "production",
    location: "us",
    values: {
      apiTimeout: 30000,
      currency: "USD",
      timezone: "America/New_York",
    },
    version: 1,
  },

  // Layer 4 — Client specific (highest priority)
  {
    scope: "client",
    environment: "production",
    location: "india",
    clientId: "enterprise-client-1",
    values: {
      apiTimeout: 20000,        // 20s for this specific enterprise client
      maxRetries: 5,
      featureFlags: {
        darkMode: true,
        betaFeatures: true,     // enterprise gets beta access
      },
    },
    version: 1,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Config.deleteMany({});
    console.log("🗑️  Cleared existing configs");

    await Config.insertMany(seedData);
    console.log("🌱 Seed data inserted successfully");

    console.log("\n📋 Seeded Configs:");
    seedData.forEach((c) => {
      console.log(`  → [${c.scope}] env:${c.environment} location:${c.location} client:${c.clientId}`);
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();