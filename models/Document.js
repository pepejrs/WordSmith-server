import mongoose, { Schema } from "mongoose"

const Document = new Schema({
  _id: String,
  data: Object,
})

export default mongoose.model("DocumentDB", Document)