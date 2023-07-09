import User from "../Models/users";
import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
const cloudinary = require('cloudinary').v2
require('dotenv').config();

const { nanoid } = require('nanoid');


 



// Sendinblue
import SibApiV3Sdk from 'sib-api-v3-sdk';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

//cloudinary
cloudinary.config({       
 cloud_name: process.env.CLOUDINARY_NAME,
 api_key: process.env.CLOUDINARY_KEY,
 api_secret: process.env.CLOUDINARY_SECRET,
});

//middleware 
export const requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});


// authenticateUser middleware
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized, no token found" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


export const signup = async (req, res) => {
  console.log("HIT SIGNUP");
  try {
    // validation
    const { name, email, password } = req.body;
    if (!name) {
      return res.json({
        error: "Name is required",
      });
    }
    if (!email) {
      return res.json({
        error: "Email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is taken",
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);

    try {
      const user = await new User({
        name,
        email,
        password: hashedPassword,
      }).save();

      // create signed token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      

      //   console.log(user);
      const { password, ...rest } = user._doc;
      return res.json({
        token,
        user: rest,
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

export const signin = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    // check if our db has user with that email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong password",
      });
    }
    // create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    

    user.password = undefined;
    user.secret = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // find user by email
  const user = await User.findOne({ email });
  console.log("USER ===> ", user);
  if (!user) {
    return res.json({ error: "User not found" });
  }
  // generate code
  const resetCode = nanoid(5).toUpperCase();
  // save to db
  user.resetCode = resetCode;
  await user.save();
  // prepare email
  const emailData = new SibApiV3Sdk.SendSmtpEmail();
  emailData.sender = { email: process.env.EMAIL_FROM };
  emailData.to = [{ email: user.email }];
  emailData.subject = "Password reset code";
  emailData.htmlContent = `<h1>Your password reset code is: ${resetCode}</h1>`;
  // send email
  try {
    const data = await apiInstance.sendTransacEmail(emailData);
    console.log(data);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.json({ ok: false });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, password, resetCode } = req.body;
    // find user based on email and resetCode
    const user = await User.findOne({ email, resetCode });
    // if user not found
    if (!user) {
      return res.json({ error: "Email or reset code is invalid" });
    }
    // if password is short
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be 6 characters long",
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetCode = "";
    user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};


export const uploadImage = async (req, res) => {
  console.log("upload image > user _id", req.user._id);
  
  try {
      const result = await cloudinary.uploader.upload(req.body.image, {
        public_id: nanoid(),
        resource_type: "image",
      });
      console.log("CLOUDINARY RESULT => ", result);
      
      const user = await User.findByIdAndUpdate(req.user._id, {
        image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    }, 
      {new: true}
      );
      //send response
      return res.json({
        name: user.name,
        email: user.email,
        image: user.image,
      });
  }catch (err) {
    console.log(err);
  }
  
  res.json({
    success: true,
    message: "Image uploaded successfully",
  });
};



export const updatePassword = async (req, res) => {
  try{
    const {password} = req.body;
    if(!password || password.length < 6){
      return res.json({
        error: "Please provide a password of 6 or more characters",
      });
    } else{
      //UPDATE DATABASE
      const hashedPassword = await hashPassword(password);
      const user = await User.findByIdAndUpdate(req.user._id, 
        {
         password: hashedPassword,
        });
        user.password = undefined;
        user.secret = undefined;
        return res.json(user);
    }

  }catch(err){
    console.log(err);
  }
};