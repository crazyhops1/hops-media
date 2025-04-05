import mongoose from "mongoose";
const dbConnection=async()=>{
    try {
        const db = await mongoose.connect(process.env.DB,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 20000, // 20 seconds
          })
        if(db){
            console.log('db connected')
        }
    } catch (error) {
        console.log(error)
        
    }

}
export default dbConnection
