 import dotenv from "dotenv";
 dotenv.config()

export const dbClient ={
host: process.env.DB_CLIENT_HOST,
user: process.env.DB_CLIENT_USER,
password: process.env.DB_CLIENT_PASSWORD,
database: process.env.DB_CLIENT_NAME,
port: process.env.DB_CLIENT_PORT
};