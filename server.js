import express from "express"
import mongoose from "mongoose"
import { Server} from "socket.io"
import http from "http"
import cors from "cors";
import AuthController from "./controllers/authController.js"
import socketController from "./sockets/socketRoutes.js"
import RequestController from "./controllers/requestController.js"
import Document from "./models/Document.js"
import dotenv from 'dotenv';
dotenv.config();



const uri = `mongodb+srv://mshubham:${process.env.MONGO_PASS}@cluster0.vtpm8td.mongodb.net/Documents?retryWrites=true&w=majority`;

try{
  await mongoose.connect(uri); 
  
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
 }catch(e){
  console.log("could not connect mongodb because ",e);
 }
const app =express()
const httpserver = http.createServer(app);
const PORT = process.env.PORT || 7000;
const io = new Server(httpserver, { cors: ["*"] });

io.on("connection",socketController)
app.use(express.json());
app.use(cors());
app.use("/users",AuthController)
app.use("/requests",RequestController)
app.post("/fetchdocs", async (req, res) => {
  const doclist = [];
  const reqData = req.body;

  try {
    const alldocs = await Document.find({});

    alldocs.forEach((doc) => {
      const thisContributors = doc.contributors;

      if (thisContributors.includes(reqData.username)) {
        doclist.push(doc);
      }
    });

    res.status(200).send({ doclist });
  } catch (error) {
    console.error("Error fetching docs from db:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

httpserver.listen(PORT, function () {
    console.log("The server is up and running at", PORT, ":)");
  });