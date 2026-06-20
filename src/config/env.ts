import "dotenv/config";
export const env = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URL || "mongodb://localhost:27017/booking?replicaSet=rs0",
  accessSecret: process.env.ACCESS_SECRET || "accessSecret",
  refreshSecret: process.env.REFRESH_SECRET || "refreshSecret",
  coreUrl: process.env.CORE_URL || "http://localhost:5173",
} as const;
