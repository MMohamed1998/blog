
import mongoose from 'mongoose'
mongoose.set('strictQuery', true);

export const connectionDB = async () => {
  mongoose.connect("mongodb://127.0.0.1:27017/blog").then(()=>{
        console.log("database Connected");
    }).catch((err)=>{
        console.log("database Error: ", err );
    })
}

export default connectionDB;