import express from "express"
import mongoose from "mongoose"
import { Server} from "socket.io"
import Document from "./models/Document.js" 
import http from "http"
import cors from "cors";




const uri = "mongodb+srv://mshubham:Atlass2023@cluster0.vtpm8td.mongodb.net/Documents?retryWrites=true&w=majority";

try{
  await mongoose.connect(uri); 
  
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
 }catch(e){
  console.log("could not connect mongodb because ",e);
 }
const app =express()
const httpserver = http.createServer(app);
const io = new Server(httpserver, { cors: ["*"] });
const PORT = process.env.PORT || 7000;

const defaultValue = ""

app.use(express.json());
app.use(cors());

io.on("connection", socket => {
  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId)
    socket.join(documentId)
    socket.emit("load-document", document.data)

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta)
    })

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { data })
    })
  })
})

async function findOrCreateDocument(id) {
  if (id == null) return

  const document = await Document.findById(id)
  if (document) return document
  return await Document.create({ _id: id, data: defaultValue })
}

httpserver.listen(PORT, function () {
    console.log("The server is up and running at", PORT, ":)");
  });