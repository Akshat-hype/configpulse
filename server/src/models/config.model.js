const mongoose = require("mongoose");

const configSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      enum: ["global", "environment", "location", "client"],
      required: true,
    },
    environment: {
      type: String,
      enum: ["dev", "staging", "production", null],
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    clientId: {
      type: String,
      default: null,
    },
    values: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },
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