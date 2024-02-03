import mongoose, { Schema } from "mongoose"

const Document = new Schema({
  _id: String,
  data: Object,
  title:String,
  author: String,
  contributors : [String]
})

export default mongoose.model("DocumentDB", Document)