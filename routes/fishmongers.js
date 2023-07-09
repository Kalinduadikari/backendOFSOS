import express from "express";
import { signin, signup, signout, getFishmongerData, loginStatus, updateFishmonger, forgotPassword, resetPassword } from "../Controllers/fishmongers";
import { requireSignin } from "../middleware/auth";


const router = express.Router();


router.get("/", (req, res) => {
    return res.json({
      data: "FISHMONGER DATA",
    });
  });
  


router.post("/signin", signin);
router.post("/signup", signup);
router.post("/signout", signout);
router.get("/data", requireSignin, getFishmongerData);
router.get("/loggedin", requireSignin, loginStatus);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword); 
router.put("/updatefishmonger", requireSignin, updateFishmonger);


export default router;
