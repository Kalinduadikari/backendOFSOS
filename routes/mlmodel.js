const express = require('express');
const router = express.Router();
const axios = require('axios'); // install this package if not already installed

router.get('/bestselling', async (req, res) => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/best_selling');
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting best selling products' });
  } 
});


router.get('/bestsellingproducts', async (req, res) => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/best_selling_products');
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting best selling products' });
  }
});

router.get('/forecast/:product_name', async (req, res) => {
  try {
    const response = await axios.get(`http://127.0.0.1:5000/forecast/${req.params.product_name}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Error getting forecast for product: ${req.params.product_name}` });
  }
});


module.exports = router;
