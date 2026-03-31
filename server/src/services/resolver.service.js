const Config = require("../models/config.model");

/**
 * Resolves the final config for a client by merging layers in priority order:
 * global → environment → location → client
 * Each layer overrides the previous one.
 */

const resolveConfig = async ({ clientId, environment, location }) => {
  // Step 1 — Fetch all active configs that match this request
  const configs = await Config.find({ isActive: true });

  // Step 2 — Filter configs relevant to this request, in priority order
  const globalConfig = configs.find((c) => c.scope === "global");

  const envConfig = configs.find(
    (c) => c.scope === "environment" && c.environment === environment
  );

  const locationConfig = configs.find(
    (c) =>
      c.scope === "location" &&
      c.environment === environment &&
      c.location === location
  );

  const clientConfig = configs.find(
    (c) =>
      c.scope === "client" &&
      c.environment === environment &&
      c.location === location &&
      c.clientId === clientId
  );

  // Step 3 — Merge layer by layer (each layer overrides the previous)
  const resolved = deepMerge(
    mapToObject(globalConfig?.values),
    mapToObject(envConfig?.values),
    mapToObject(locationConfig?.values),
    mapToObject(clientConfig?.values)
  );

  // Step 4 — Return resolved config with metadata
  return {
    resolved,
    meta: {
      clientId:    clientId    || "unknown",
      environment: environment || "unknown",
      location:    location    || "unknown",
      layersApplied: [
        globalConfig   ? "global"      : null,
        envConfig      ? "environment" : null,
        locationConfig ? "location"    : null,
        clientConfig   ? "client"      : null,
      ].filter(Boolean),
      resolvedAt: new Date().toISOString(),
    },
  };
};

// Converts MongoDB Map to plain JS object
const mapToObject = (map) => {
  if (!map) return {};
  if (map instanceof Map) return Object.fromEntries(map);
  return map;
};

// Deep merges multiple objects left to right
// Right side always wins on conflict
const deepMerge = (...objects) => {
  return objects.reduce((acc, obj) => {
    if (!obj) return acc;
    Object.keys(obj).forEach((key) => {
      if (
        typeof obj[key] === "object" &&
        !Array.isArray(obj[key]) &&
        obj[key] !== null
      ) {
        acc[key] = deepMerge(acc[key] || {}, obj[key]);
      } else {
        acc[key] = obj[key];
      }
    });
    return acc;
  }, {});
};

module.exports = { resolveConfig };