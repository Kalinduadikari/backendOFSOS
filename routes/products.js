import express from "express";
import upload from '../config/multer';

const router = express.Router();

//controllers
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  sellProduct,
} from "../Controllers/products";



// Product routes
router.get("/", (req, res) => {
  return res.json({
    data: "PRODUCT DATA",
  });
});

router.get("/getAllProducts", getAllProducts);
router.get("/:id", getProduct);
router.post('/', upload.single('image'), createProduct);
router.put("/:id", upload.single('image'), updateProduct);
router.delete("/:id", deleteProduct);
router.put("/sell/:id", sellProduct);

export default router;
