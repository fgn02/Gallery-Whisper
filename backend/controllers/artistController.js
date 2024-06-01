import asyncHandler from 'express-async-handler';
import Artist from '../models/artistModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const artistInfo = asyncHandler(async (req, res) => {
  const name = req.params.name;
  const artist = await Artist.findOne({ name });

  if (!artist) {
    res.json({artist: null});
  } else {
    // const updateResult = await updateArtist(req, res);
    const artistProducts = await Product.find({ artists: artist.name });

    if (!Array.isArray(artistProducts)) {
      artistProducts = []; // Set to an empty array if it's not already an array
    }
    const filteredProducts = artistProducts.map(product => ({
      product: product
    }));

    res.json({
      artist,
      artistProducts: filteredProducts
    });
  }
});

const createArtist = asyncHandler(async (req, res) => {
  const { name, email, nationality, info, exhibitions, userId,isVerified } = req.body;
  const artistExists = await Artist.findOne({ name });
  if (artistExists) {
    res.status(400);
    throw new Error('Artist already exists');
  }
  
  const artist = await Artist.create({
    name,
    email,
    nationality: nationality || '',
    info,
    exhibitions: exhibitions || '',
    isVerified: isVerified || false,
  });
  const updateUser = await User.findOne({
    _id: userId,
  });
  if (updateUser) {
    updateUser.isArtist = true;
    updateUser.artistId = artist._id;
    updateUser.save();
  }
  if (artist) {
    res.status(201).json({
      _id: artist._id,
      name: artist.name,
      email: artist.email,
      nationality: artist.nationality,
      info: artist.info,
      exhibitions: artist.exhibitions,
    });
  } else {
    res.status(400);
    throw new Error('Invalid artist data');
  }
});


const allArtistInfo = asyncHandler(async (req, res) => {
  const artists = await Artist.find({});
  res.json(artists);
});

const removeArtist = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  const artist = await Artist.findById(userId);
  
  if (artist) {
    const user = await User.findOne({ artistId: userId });
    if (user) {
      user.isArtist = false;
      user.artistId = null;
      await user.save();
    }
    
    await artist.deleteOne();
    res.json({ message: 'Artist removed' });
  } else {
    res.status(404);
    throw new Error('Artist not found');
  }
});



const updateArtist = asyncHandler(async (req, res) => {
  const userId = req.body._id;
  const artist = await Artist.findById(userId);
  if (!artist) {
    res.status(404);
    throw new Error('Artist not found');
  }

  const verifiedArtCount = await Artist.countDocuments({isVerified: true});
  if(verifiedArtCount < 3){
    artist.commission = 0.1;
  }else if(verifiedArtCount < 6){
    artist.commission = 0.15;
  }else if(verifiedArtCount < 9){
    artist.commission = 0.2;
  }else if(verifiedArtCount > 9){
    artist.commission = 0.25;
  }
  artist.name = req.body.name || artist.name;
  artist.email = req.body.email || artist.email;
  artist.nationality = req.body.nationality || artist.nationality;
  artist.info = req.body.info || artist.info;
  artist.exhibitions = req.body.exhibitions || artist.exhibitions;

  const updatedArtist = await artist.save();

  res.json({
    _id: updatedArtist._id,
    name: updatedArtist.name,
    email: updatedArtist.email,
    nationality: updatedArtist.nationality,
    info: updatedArtist.info,
    exhibitions: updatedArtist.exhibitions,
  });
});

const updateVerificationStatus = asyncHandler(async (req, res) => {
  const userId = req.body._id;
  const artist = await Artist.findById(userId);
  if (!artist) {
    res.status(404);
    throw new Error('Artist not found');
  }
  artist.isVerified = !artist.isVerified; // Toggle verification status

  const updatedArtist = await artist.save(); // Corrected method name to "save()"

  res.json(updatedArtist);
});



export {
    artistInfo,
    createArtist,
    allArtistInfo,
    removeArtist,
    updateArtist,
    updateVerificationStatus
};