import "dotenv/config";

export const port: string = process.env.PORT || "5000";
export const databaseUrl: string = process.env.DATABASE_URL || "";
export const jwtSecret: string = process.env.JWT_TOKEN_SECRET || "";
export const jwtRefreshSecret: string =
  process.env.JWT_REFRESH_TOKEN_SECRET || "";
