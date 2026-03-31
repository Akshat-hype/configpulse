const mongoose = require("mongoose");

const configSchema = new mongoose.Schema(
  {
    // Scope defines the priority level of this config
    scope: {
      type: String,
      enum: ["global", "environment", "location", "client"],
      required: true,
    },

    // These fields narrow down who this config applies to
    environment: {
      type: String,
      enum: ["dev", "staging", "production", null],
      default: null,
    },
    location: {
      type: String,
      default: null, // e.g. "india", "us", "eu"
    },
    clientId: {
      type: String,
      default: null, // e.g. "enterprise-client-1"
    },

    // The actual config values — flexible key/value pairs
    values: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // Version tracking for rollback support
    version: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Config", configSchema);