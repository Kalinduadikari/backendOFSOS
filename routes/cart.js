import express from "express";

const router = express.Router();

//controllers
import { 
    getCartByUserId, 
    addToCart, 
    removeFromCart, 
    clearCart,
} from "../Controllers/cart";


router.get("/", (req, res) => {
    return res.json({
      data: "CART DATA",
    });
  });
  

router.get("/getCartByUserId/:userId", getCartByUserId);
router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.post("/clear", clearCart);

export default router;
