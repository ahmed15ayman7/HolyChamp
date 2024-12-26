import mysql from "mysql2/promise";

const databaseUrl = "mysql://root:@localhost:3306/holy-champ";

export async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(databaseUrl);
    console.log("✅ Successfully connected to the database!");
    return connection;
  } catch (error: any) {
    console.error("❌ Database connection failed:", error.message);
    throw error;
  }
}
