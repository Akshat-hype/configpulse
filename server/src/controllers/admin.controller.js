const Config = require("../models/config.model");
const { emitConfigUpdate } = require("../websocket/ws.server");

const updateConfig = async (req, res) => {
  try {
    const { environment, location, clientId, config } = req.body;
    
    // Determine the scope of this configuration
    let scope = "global";
    if (clientId) {
      scope = "client";
    } else if (location) {
      scope = "location";
    } else if (environment) {
      scope = "environment";
    }

    const filter = {
      scope,
      environment: environment || null,
      location: location || null,
      clientId: clientId || null
    };

    // Upsert the specific layer configuration
    const updated = await Config.findOneAndUpdate(
      filter,
      { $set: { values: config, isActive: true }, $inc: { version: 1 } },
      { new: true, upsert: true }
    );

    // Emit websocket global broadcast
    emitConfigUpdate({ environment, location, clientId });

    return res.status(200).json({ 
      success: true, 
      message: "Config deployed successfully", 
      data: updated 
    });
  } catch (error) {
    console.error("Config update error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to update config" 
    });
  }
};

module.exports = { updateConfig };
