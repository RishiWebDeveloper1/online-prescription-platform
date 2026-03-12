export const validateEnv = () => {
  const required = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};
