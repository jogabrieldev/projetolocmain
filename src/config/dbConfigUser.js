 import dotenv from "dotenv";
 dotenv.config()

export const dbConfigUser = {
host:process.env.DB_AUTH_HOST,
user:process.env.DB_AUTH_USER,
password:process.env.DB_AUTH_PASSWORD,
database:process.env.DB_AUTH_NAME,
port:process.env.DB_AUTH_PORT
};

  //passwordLogin 123123

