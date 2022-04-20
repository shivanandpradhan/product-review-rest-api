
import dotenv from 'dotenv'
dotenv.config()

export const {
    PORT,
    HOST,
    DEBUG,
    ACCESS_SECRET,
    REFRESH_SECRET,
    DATABASE_URL,
    APP_URL
} = process.env
