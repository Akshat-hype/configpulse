const { getResolvedConfig } = require("../services/config.service");

const fetchConfig = async (req, res) => {
  try {
    const { clientId, environment, location, version } = req.query;

    // Validate required fields
    if (!environment) {
      return res.status(400).json({
        success: false,
        message: "environment is required",
      });
    }

    const result = await getResolvedConfig({
      clientId,
      environment,
      location,
      version,
    });

    return res.status(200).json({
      success: true,
      data: result.resolved,
      meta: result.meta,
    });

  } catch (error) {
    console.error("Config fetch error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to resolve configuration",
      error: error.message,
    });
  }
};

module.exports = { fetchConfig };