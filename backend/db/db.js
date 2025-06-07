import mongoose from "mongoose";
const connectiondb = async () =>{
try{
const con = await mongoose.connect(process.env.MONGO_URL);
console.log("DB connect")
}catch(error){
console.log("error : ", error.message)
}
}
export default connectiondb;