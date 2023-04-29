import express from "express";

const router = express.Router();

// controllers
import {
  signup,
  signin,
  forgotPassword,
  resetPassword,
  uploadImage,
  requireSignin,
  authenticateUser, 
  updatePassword,
} from '../Controllers/auth';


router.get("/", (req, res) => {
  return res.json({
    data: "USER DATA",
  });
});

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/upload-image", requireSignin, authenticateUser, uploadImage); 
router.post("/update-password", requireSignin, authenticateUser, updatePassword);



export default router;
