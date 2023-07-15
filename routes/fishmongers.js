import express from "express";
import { signin, signup, signout, getFishmongerData, loginStatus, updateFishmonger, forgotPassword, resetPassword } from "../Controllers/fishmongers";
import { protect } from "../middleware/auth";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    data: "FISHMONGER DATA",
  });
});

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/signout", signout);
router.get("/data", protect, getFishmongerData); 
router.get("/loggedin", protect, loginStatus);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword); 
router.put("/updatefishmonger", protect, updateFishmonger);

export default router;
