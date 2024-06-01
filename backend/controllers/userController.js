import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import generateToken from '../utils/generateToken.js';


// Post public
const authUser = asyncHandler(async (req, res) => {
    const {email,password} = req.body;
    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id);
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            admin : user.isAdmin,
            fav : user.favoriteProducts,
            artists : user.isArtist,
        });
    }else{
        res.status(401);
        throw new Error('Invalid email or password');
    }

});

// Post public
const register = asyncHandler(async (req, res) => {
    const {name,email,password} = req.body;
    const userExists = await User.findOne({ email });

    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({
        name,
        email,
        password
    });
    if(user){
        generateToken(res, user._id);
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            admin : user.isAdmin,
            fav : user.favoriteProducts,
            artists : user.isArtist,
        });
    }else{
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// Post public
const logout = asyncHandler(async (req, res) => {
    res.cookie('jwt', '',{
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({message : 'Logged out'});
});

// get private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id : req.user._id,
        name : req.user.name,
        email : req.user.email
    }
    res.status(200).json({user});
});

// put private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id : updatedUser._id,
            name : updatedUser.name,
            email : updatedUser.email
        });
    }else{
        res.status(404);
        throw new Error('User not found');
    }
});

const addToFavorite = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const productId = req.body.productId;
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    const favoriteProducts = user.favoriteProducts;
    const index = favoriteProducts.indexOf(productId);
    
    if (index === -1) {
      favoriteProducts.push(productId);
    } else {
      favoriteProducts.splice(index, 1);
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, { favoriteProducts }, { new: true });
    
    res.status(200).json({ success: true, data: { updatedUser, index } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});



  const getFavoriteProducts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate('favoriteProducts');
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }
  const favoriteProducts = user.favoriteProducts;
  res.status(200).json(favoriteProducts);
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

const makeAdmin = asyncHandler(async (req, res) => {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    user.isAdmin = true;
    const updatedUser = await user.save();
  
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  });
  
  const removeFromAdmin = asyncHandler(async (req, res) => {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
      }
      user.isAdmin = false;
      const updatedUser = await user.save();
    
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    });

    const removeUser = asyncHandler(async (req, res) => {
        const userId = req.body.userId;
        const user = await User.deleteOne({ _id: userId });
        if (user.deletedCount === 0) {
          res.status(404);
          throw new Error('User not found');
        }
        res.json({ message: 'User removed' });
      });
    
    const googleAuthUser = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({ email });
    if(user){
        generateToken(res, user._id);
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            admin : user.isAdmin,
            fav : user.favoriteProducts,
        });
    }else{
        res.status(401);
        throw new Error('Invalid email');
    }
  }
);

const googleRegisterUser = asyncHandler(async (req, res) => {
    const {name,email} = req.body;
    const userExists = await User.findOne({ email });

    if(userExists){
        await googleAuthUser(req, res);
    }
    const password = '1234';
    const user = await User.create({
        name,
        email,
        password
    });
    if(user){
        generateToken(res, user._id);
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            admin : user.isAdmin,
            fav : user.favoriteProducts
        });
    }else{
        res.status(400);
        throw new Error('Invalid user data');
    }
});


export {
    authUser,
    register,
    logout,
    getUserProfile,
    updateUserProfile,
    addToFavorite,
    getFavoriteProducts,
    getAllUsers,
    makeAdmin,
    removeFromAdmin,
    removeUser,
    googleAuthUser,
    googleRegisterUser
};