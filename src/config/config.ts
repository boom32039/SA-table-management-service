import { config } from "dotenv";

config();

const envConfig = {
    project_env: process.env.PROJECT_ENV,
    db_name: process.env.DB_NAME,
    db_user: process.env.DB_USER,
    db_pass: process.env.DB_PASS,
    db_host: process.env.DB_HOST,
    db_port: process.env.DB_PORT,
    port: process.env.PORT,
    host: process.env.HOST,
    jwt_secret: process.env.JWT_SECRET
}

export default envConfig;