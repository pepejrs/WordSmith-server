import mongoose from "mongoose";
const { Schema } = mongoose;

const usersSchema = new Schema({
    username: String,
    password : String,
    
});

export default mongoose.model("UserDb", usersSchema);