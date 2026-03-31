const { resolveConfig } = require("./resolver.service");

const getResolvedConfig = async ({ clientId, environment, location, version }) => {
  const result = await resolveConfig({ clientId, environment, location });
  return result;
};

module.exports = { getResolvedConfig };