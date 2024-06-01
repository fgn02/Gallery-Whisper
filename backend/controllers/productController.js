import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Review from '../models/reviewModel.js';




// get all product public
const getProduct = asyncHandler(async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
});


// get a product public
const getProductById = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    const product = await Product.findById( productId );
    if(product){
        res.status(200).json(product);

    }else{
        res.status(404);
        throw new Error('Product not found');
    }
});

// get all Unique Categories public
const getUniqueCategories = asyncHandler(async (req, res) => {
    const categories = await Product.distinct('category');
    res.status(200).json(categories);
  });

// get a product from a category public
const getCategoryProducts = asyncHandler(async (req, res) => {
    const category = req.params.myCategory;
    const products = await Product.find({ category: category});
    if (products.length === 0) {
      res.status(404);
      throw new Error('No products found');
    } else {
      res.status(200).json(products);
    }
  });


//post a product private admin
const createProduct = asyncHandler(async (req, res) => {
    const {name,size,description,category,artists, style, 
        subject, medium ,price,countInStock,image, isVerified} = req.body;
    const product = await Product.findOne({ name });
    if(product){
        res.status(400);
        throw new Error('Product already exists');
    }
    else{
        const imageName = (req.file) ? req.file.filename : null;
        // const category = category.toUpperCase();
        const newProduct = await Product.create({
            name,
            size,
            description,
            category: category.toUpperCase(),
            artists,
            style,
            subject,
            medium,
            price,
            countInStock,
            image: imageName,
            isVerified
        });
        if(newProduct){
            res.status(201).json({
                name : product.name,
                description : product.description,
                category : product.category,
                price : product.price,
                countInStock : product.countInStock,
                image : product.image,
                isVerified : product.isVerified
            });
        }else{
            res.status(400);
            throw new Error('Invalid product data');
        }
    
    }
        
});

//update a product private admin
const updateProduct = asyncHandler(async (req, res) => {
    const productId = req.body.productId;
    const product = await Product.findById(productId);
    if(product){
        const imageName = (req.file) ? req.file.filename : null;
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.category = req.body.category || product.category;
        product.price = req.body.price || product.price;
        product.countInStock = req.body.countInStock || product.countInStock;
        product.image = imageName || product.image;
        product.isVerified = req.body.isVerified || product.isVerified;
        
        const updatedProduct = await product.save();
        res.status(200).json({
            _id : updatedProduct._id,
            name : updatedProduct.name,
            description : updatedProduct.description,
            category : updatedProduct.category,
            price : updatedProduct.price,
            countInStock : updatedProduct.countInStock,
            image : updatedProduct.image
        });
    }else{
        res.status(404);
        throw new Error('Product not found');
    }
});

//delete a product private admin
const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.body.productId;
    console.log(productId);
    const deletedProduct = await Product.deleteOne({ _id: productId });
    if(deletedProduct){
        res.status(200).json({message: 'Product removed'});
    }else{
        res.status(404);
        throw new Error('Product not found');
    }
});

const getProductsByFilter = asyncHandler(async (req, res) => {
    const filter = req.params.filter;
    if (filter === 'pLow'){
        const products = await Product.find({}).sort({ price: 1 });
        res.status(200).json(products);
    }else if (filter === 'pHigh'){
        const products = await Product.find({}).sort({ price: -1 });
        res.status(200).json(products);}
    else if (filter === 'alphaA'){
        const products = await Product.find({}).sort({ name: 1 });
        res.status(200).json(products);}
    else if (filter === 'alphaZ'){
        const products = await Product.find({}).sort({ name: -1 });
        res.status(200).json(products);}
    else if (filter === 'ratingHigh'){
        const products = await Product.find({}).sort({ rating: -1 });
        res.status(200).json(products);}
    else if (filter === 'ratingLow'){
        const products = await Product.find({}).sort({ rating: 1 });
        res.status(200).json(products);}
    else if (filter === 'stock') {
        const products = await Product.find({ countInStock: { $gt: 0 } }).sort({ countInStock: -1 });
        res.status(200).json(products);
        }
    else{
        res.status(404);
        throw new Error('Invalid filter');
    }
  });

const getProductsBySearch = asyncHandler(async (req, res) => {
    const search = req.params.search;
    const products = await Product.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { medium: { $regex: search, $options: 'i' } },
          { style: { $regex: search, $options: 'i' } },
          { artists: { $regex: search, $options: 'i' } },
          { size: { $regex: search, $options: 'i' } },
        ]
      });
    if (products.length === 0) {
        res.status(404);
        throw new Error('No products found');
    } else {
        res.status(200).json(products);
    }
    });

export {
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getUniqueCategories,
    getCategoryProducts,
    getProductsByFilter,
    getProductsBySearch
};