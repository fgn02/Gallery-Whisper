import express from 'express';
import {protect} from '../middleware/authMiddleware.js';
import {
  authUser, register, logout, getUserProfile, updateUserProfile
,addToFavorite, getFavoriteProducts,
getAllUsers, makeAdmin, removeFromAdmin,removeUser, googleAuthUser,
googleRegisterUser
 } from '../controllers/userController.js';

const router = express.Router();
 
router.post('/', register);
router.post('/auth', authUser);
router.post('/logout', logout);
router.get('/profile', protect,getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/admin/users', protect, getAllUsers);
router.put('/admin/makeadmin', protect, makeAdmin);
router.put('/admin/removeadmin', protect, removeFromAdmin);
router.delete('/admin/removeuser', protect, removeUser);
router.post('/googlelogin', googleAuthUser);
router.post('/googleregister', googleRegisterUser);
router.put('/my/favorite', protect, addToFavorite);
router.get('/favorite', protect, getFavoriteProducts);

export default router;