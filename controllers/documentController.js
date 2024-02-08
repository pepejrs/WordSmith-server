import Document from "../models/Document.js";
import Router from "express"

const router = Router()

router.post("/fetchDocuments", async (req, res) => {
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
  router.post("/deleteDocuments", async (req, res) => {

    const reqData = req.body;
  
    try {
      const docFound = await Document.findOne({_id:reqData.documentId});
      
      console.log(reqData.username,docFound?.author==reqData.username,docFound?.author);
      if (docFound?.author==reqData.username){
            const result =await Document.deleteOne({_id:reqData.documentId}) 
            res.status(200).send({ result:"success"});
      }
      else{
          res.status(200).send({ result:"access denied" });
      }
  
  
    } catch (error) {
      console.error("Error fetching docs from db:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

export default router;