import express from "express";

const router = express.Router();

//controllers
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../Controllers/products";



// Product routes
router.get("/", (req, res) => {
  return res.json({
    data: "PRODUCT DATA",
  });
});

router.get("/getAllProducts", getAllProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
