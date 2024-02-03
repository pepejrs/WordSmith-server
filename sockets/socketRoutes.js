
import Document from "../models/Document.js" 
import RequestDb from "../models/Requests.js" 


const defaultValue = ""
async function findOrCreateDocument(allinfo) {
    if (allinfo.id == null) return
  
    const document = await Document.findById(allinfo.id)
    if (document) return document
    const {id,...otherinfo} =allinfo
    const saveinfo ={ _id: id, data: defaultValue,...otherinfo }
    
    return await Document.create(saveinfo)
  }
 const socketRoutes =(socket)=>{
  let connectedUsers ={}
  console.log("new socket connection",socket.id);
  socket.on("logged-in",data=>{
    connectedUsers[data.username] =socket.id
  })
    socket.on("get-document", async allinfo => {
      const document = await findOrCreateDocument(allinfo)
      socket.join(allinfo.id)
      socket.emit("load-document", document)
  
      socket.on("send-changes", delta => {
        socket.broadcast.to(allinfo.id).emit("receive-changes", delta)
      })
      
      socket.on("save-document", async newDocData => {
        console.log("save-document",{...newDocData});
        await Document.findByIdAndUpdate(allinfo.id,{...newDocData})
      })
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
  