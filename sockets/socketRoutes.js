
import Document from "../models/Document.js" 
import RequestDb from "../models/Requests.js" 


const defaultValue = ""
async function findOrCreateDocument(initial) {
  if (initial.id == null) return

  const document = await Document.findById(initial.id)
  if (document) return document
  return await Document.create({ _id: initial.id, data: defaultValue,title:"new doc" ,author:initial.user,contributors:[initial.user]})
}
 const socketRoutes =(socket)=>{
  let connectedUsers ={}
  console.log("new socket connection",socket.id);
 
  socket.on("get-document", async initial => {
    const document = await findOrCreateDocument(initial)
    socket.join(initial.id)
    socket.emit("load-document", document)

    socket.on("send-changes", delta => {
      socket.broadcast.to(initial.id).emit("receive-changes", delta)
    })

    socket.on("save-document", async dataComing => {
      const updatedAfterChange =await Document.updateOne({_id:initial.id}, {$set:{data: dataComing }},{returnDocument:true})
      
      // console.log(savedDocs);
      // console.log("saved after interval",updatedAfterChange);
    })
  })

  
      socket.on("title-change",async(data)=>{
        console.log("title changed");
        const res = await Document.updateOne({_id:data.id},{$set:{title:data.title}},{returnDocument:true})
        // console.log(res);
        socket.broadcast.to(data.id).emit("title-change",data)
      })
    
  
    socket.on("send-request",async reqData=>{
      try{
      await RequestDb.create(reqData)
      socket.to(connectedUsers[reqData.to]).emit("incoming-request",reqData)
      }
      catch(error){
        console.log("error while saving request");
      }
    })
  }
  
export default socketRoutes;  
  