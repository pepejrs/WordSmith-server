import UserDb from "../models/User.js"
import bcrypt from "bcrypt"
import express from "express"

const router =express.Router()
    router.post("/login", async (req, res) => {
        console.log("request sign in");
        const userchk= await UserDb.find({ username: req.body.username }).count();
        const user= await UserDb.find({ username: req.body.username });
        // console.log(user[0]);
      
        if (userchk == 0) {
          res.status(400).send("Cannot find user");
        } 
        else {
          try {
            if (await bcrypt.compare(req.body.password,user[0].password )) {
              const sentDtaConfirm = {
              
                username: user[0].username,
                status: "Success",
              };
              res.send(sentDtaConfirm);
            } else {
              res.send("User exists password incorrect");
            }
          } catch {
            res.status(500).send("error");
          }
        }
      });
      //Signup---------------------------------------------------------------->>>>>>>>>=>>>>>>>>>
      
      router.post("/register", async (req, res) => {
        const chkUser = await UserDb.find({ username: req.body.username }).count();
      
        if (chkUser != 0) {
          res.status(201).send("user already added");
        } else {
          try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
      
            const user = {
              username: req.body.username,
              password: hashedPassword,
            
              
            };
      
            const userDbObj = new UserDb(user);
            await userDbObj.save();
            res.status(201).send(user);
            console.log("user added", user);
          } catch {
            res.status(500).send("error occurred");
            console.log("user error");
          }
        }
      });
export default router
