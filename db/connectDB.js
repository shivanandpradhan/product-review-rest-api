
import mongoose from 'mongoose'

const connectDB = async ( DATABASE_URL ) => {
    
    const DB_OPTIONS = {
        dbName : 'Users',
        useNewUrlParser : true,
        useUnifiedTopology : true
    }

    await mongoose.connect(DATABASE_URL, DB_OPTIONS)
    console.log(`connected to DB successfully...`);
}

export default connectDB
