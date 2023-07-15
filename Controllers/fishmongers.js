import Fishmonger from "../Models/fishmongers";
import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import SibApiV3Sdk from 'sib-api-v3-sdk';
require('dotenv').config();



const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

 
const generateToken = (fishmonger) => {
    return jwt.sign({ id: fishmonger._id },process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  };
  


  export const signin = async (req, res) => {
    const { email, password } = req.body;
  
    // validation
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
  
    try {
      const fishmonger = await Fishmonger.findOne({ email });
  
      if (!fishmonger) {
        return res.status(400).json({ error: "Fishmonger not found" });
      }
  
      const validPassword = await comparePassword(password, fishmonger.password);
  
      if (!validPassword) {
        return res.status(400).json({ error: "Invalid password" });
      }
  
      const token = generateToken(fishmonger);
      res.cookie("token", token, { httpOnly: true });
      res.json({ fishmonger });
      console.log("The token from fish controller", token);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  export const signout = async (req, res) => {
    try {
      const token = req.cookies.token;
    
      if (!token) {
        return res.status(401).json({ message: "Not logged in" });
      }
    
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const fishmonger = await Fishmonger.findById(decoded.id).select("-password");
    
      if (!fishmonger) {
        return res.status(401).json({ message: "Invalid token" });
      }
    
      console.log(`Fishmonger signed out: Name: ${fishmonger.name}, Email: ${fishmonger.email}`);
      res.clearCookie("token");
      res.json({ message: "Fishmonger signed out successfully", fishmonger });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  };
  


  export const signup = async (req, res) => {
    const { name, email, password } = req.body;
  
    // validation
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
  
    try {
      const exist = await Fishmonger.findOne({ email });
      if (exist) {
       return res.status(409).json({ // Modified this line
          error: "Email is taken",
        });
      }
  
      const hashedPassword = await hashPassword(password);
      const fishmonger = new Fishmonger({
        name,
        email,
        password: hashedPassword,
      });
  
      await fishmonger.save();
  
      const token = generateToken(fishmonger);
      res.cookie("token", token, { httpOnly: true });
      res.json({ fishmonger });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

 

  export const getFishmongerData = async (req, res) => {
    try {
      const fishmonger = await Fishmonger.findById(req.fishmonger._id).select("-password");
      if (!fishmonger) {
        return res.status(404).json({ error: "Fishmonger not found" });
      }
      res.json(fishmonger);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  
 //LOGIN STATUS FUNCTION
  export const loginStatus = async (req, res) => {
    try {
      const token = req.cookies.token;
  
      if (!token) {
        return res.status(401).json({ loggedIn: false, message: "Not logged in" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const fishmonger = await Fishmonger.findById(decoded.id);
  
      if (!fishmonger) {
        return res.status(401).json({ loggedIn: false, message: "Invalid token" });
      }
  
      res.status(200).json({ loggedIn: true, message: "Logged in", fishmonger });
    } catch (error) {
      res.status(401).json({ loggedIn: false, message: error.message });
    }
  };


  export const updateFishmonger = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const fishmongerId = req.fishmonger._id;
  
      // Validation
      if (!name && !email && !password) {
        return res.status(400).json({
          error: "At least one field (name, email, or password) is required to update",
        });
      }
  
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({
            error: "Password should be at least 6 characters long",
          });
        }
        updateData.password = await hashPassword(password);
      }
  
      const updatedFishmonger = await Fishmonger.findByIdAndUpdate(fishmongerId, updateData, {
        new: true,
        runValidators: true,
      }).select("-password");
  
      if (!updatedFishmonger) {
        return res.status(404).json({ error: "Fishmonger not found" });
      }
  
      res.json(updatedFishmonger);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ error: "Email is taken" });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };



  const deployedURL = 'https://webofsos.onrender.com';

  //FORGOT PASSWORD FUNCTION
  export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    try {
      const fishmonger = await Fishmonger.findOne({ email });
      if (!fishmonger) {
        return res.status(404).json({ error: 'Fishmonger not found' });
      }
  
      // Generate password reset token
      const token = fishmonger.generatePasswordResetToken();
      await fishmonger.save();
      console.log(token);
  
      // Send password reset email
      const emailParams = {
        to: [{ email: email, name: fishmonger.name }],
        sender: { email: process.env.EMAIL_FROM, name: 'Your Team' },
        subject: 'Password Reset Request',
        htmlContent: `<p>Hi ${fishmonger.name},</p><p>To reset your password, please click the following link: <a href="${deployedURL}/reset/${token}">Reset Password</a></p><p>If you did not request a password reset, please ignore this email.</p><p>Best regards,</p><p>Your Team</p>`,
      };
  
      apiInstance.sendTransacEmail(emailParams).then(
        () => {
          res.status(200).json({ message: 'Password reset email sent successfully' });
        },
        (error) => {
          console.error('Error sending email:', error);
          res.status(500).json({ error: 'Error sending email' });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //RESET PASSWORD FUNCTION
  export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    console.log("Request body:", req.body); 

    if (!token) {
      console.log("Error: Reset token is required"); 
      return res.status(400).json({ error: 'Reset token is required' });
    }
  
    if (!newPassword || newPassword.length < 6) {
      console.log("Error: Password is required and should be 6 characters long"); 
      return res.status(400).json({ error: 'Password is required and should be 6 characters long' });
    }
  
    try {
      const fishmonger = await Fishmonger.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
      });
  
      if (!fishmonger) {
        console.log("Error: Invalid or expired reset token"); 
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }
  
      fishmonger.password = await hashPassword(newPassword);
      fishmonger.passwordResetToken = undefined;
      fishmonger.passwordResetExpires = undefined;
      await fishmonger.save();
  
      res.status(200).json({ message: 'Password successfully reset' });
    } catch (error) {
      console.log("Error:", error.message); 
      res.status(500).json({ error: error.message });
    }
  };