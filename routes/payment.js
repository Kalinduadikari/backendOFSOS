import express from "express";

const router = express.Router();
const stripe = require('stripe')('sk_test_51N2CTNC5fdwwHhl4oo91cUyVVEabnoRAYPImyMwBzBkmwG4OUUcWmGBbbvmro94sbm8FwseFPSqD4N4GLXBp6zq700Nu3XIp5f');

//router endpoints
router.post("/intents", async (req, res) => {
    try{
         //create a paymentIntent
        const paymentIntent = await stripe.paymentIntents.create({ // Updated line
            amount: req.body.amount,
            currency: 'LKR',
            payment_method_types: ['card'],
        })
        res.json({paymentIntent: paymentIntent.client_secret});
    } catch(e){
        res.status(400).json({
            error: e.message,
            
        });
    }
   
});

export default router;
