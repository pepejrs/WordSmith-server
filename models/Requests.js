import mongoose,{Schema} from "mongoose"

const RequestSchema = new Schema({
    from : String,
    to: String,
    documentId:String
});
export default mongoose.model("RequestDb",RequestSchema);