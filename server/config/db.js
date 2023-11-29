import mongoose from 'mongoose'

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to the database succesfully`);
    }catch(err){
        console.log(`Error in mongodb connection: ${err}`);
    }
}

export default connectDB