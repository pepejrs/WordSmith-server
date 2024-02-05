import express, { response } from "express";
import DocumentDb from "../models/Document.js";
import RequestDb from "../models/Requests.js";
const router = express.Router();
async function acceptAndUpdate(reqId) {
  try {
    console.log("accept called");
    const reqArray = await RequestDb.find({ _id: reqId });
    const reqObj = reqArray[0]
    console.log("request to be accepted",reqObj);
    const updatedDocument = await DocumentDb.updateOne(
      { _id: reqObj.documentId },
      { $push: { contributors: reqObj.to } },
      { returnDocument: true }
      );
      console.log("updated contributors", updatedDocument);
    return true;
  } catch (error) {
    if (error.response) {
      // The request was made, but the server responded with a non-2xx status code
      console.error(
        "Response error:",
        error.response.status,
        error.response.data
        );
      } else if (error.request) {
        // The request was made, but no response was received
        console.error("Request error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
      return false;
    }
  }
  router.post("/isSafe", async (req, res) => {
    const data = req.body;
    console.log("request To authorize" + data.contributorName + "for" + data.documentId);
    try {
    const doc = await DocumentDb.findById(data.documentId);
    if (doc){
      console.log(doc)
      if (doc.contributors.includes(data.contributorName)) {
        res.status(200).send({ safe: "1" });
      } else {
        res.status(200).send({ safe: "0" });
      }
    }
    else{
      res.status(200).send({safe:"2"})
    }

  } catch (error) {
    if (error.response) {
      // The request was made, but the server responded with a non-2xx status code
      console.error(
        "Response error:",
        error.response.status,
        error.response.data
        );
      } else if (error.request) {
        // The request was made, but no response was received
        console.error("Request error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
      res.status(500).send({ safe: "-1" });
    }
  });
  router.post("/addContributor", async (req, res) => {
    console.log("contributor request");
    try {
      const reqData = req.body;
      const requestObj = new RequestDb(reqData);
      requestObj.save();
      res.status(200).send({ message: "request sent" });
    } catch (error) {
      if (error.response) {
        // The request was made, but the server responded with a non-2xx status code
        console.error(
          "Response error:",
          error.response.status,
          error.response.data
          );
        } else if (error.request) {
          // The request was made, but no response was received
          console.error("Request error:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error:", error.message);
        }
        res.status(500).send("could not save request");
      }
    });
    router.post("/fetchReq", async (req, res) => {
      const data = req.body;
      console.log("requestload");
      try {
        const responseoflist = await RequestDb.find({ to: data.username });
    console.log(responseoflist);
    res.status(200).send({ reqList: responseoflist });
  } catch (error) {
    if (error.response) {
      // The request was made, but the server responded with a non-2xx status code
      console.error(
        "Response error:",
        error.response.status,
        error.response.data
        );
      } else if (error.request) {
        // The request was made, but no response was received
        console.error("Request error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
      res.status(500).send("could not fetch requests");
    }
  });
  router.post("/deleteRequest", async (req, res) => {
    const data = req.body;
    console.log("deleteRequest");
    try {
      const didDelete = await RequestDb.deleteOne({ _id: data.reqId });
      console.log(didDelete);
      res.status(200).send({ deleteConfirmation: didDelete });
    } catch (error) {
      if (error.response) {
        // The request was made, but the server responded with a non-2xx status code
        console.error(
          "Response error:",
          error.response.status,
          error.response.data
          );
        } else if (error.request) {
          // The request was made, but no response was received
          console.error("Request error:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
      res.status(500).send("could not delete requests");
    }
  });
  router.post("/acceptRequest", async (req, res) => {
    const data = req.body;
    console.log("acceptRequest");
    try {
      let ans =await  acceptAndUpdate(data.reqId);
      if (!ans) throw new Error("doc update resulted in error");
      const didDelete = await RequestDb.deleteOne({ _id: data.reqId });
      console.log(didDelete);
      res.status(200).send({ deleteConfirmation: didDelete });
    } catch (error) {
      if (error.response) {
        // The request was made, but the server responded with a non-2xx status code
      console.error(
        "Response error:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // The request was made, but no response was received
      console.error("Request error:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
    res.status(500).send("could not accept requests");
  }
});

export default router;
