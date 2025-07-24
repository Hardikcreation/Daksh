import express from 'express';
import { getUserProfile, getAllUsers, updateUserLocation, updateUserProfile, getAddresses, saveAddress, getUserProfileShort, acceptPolicies } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get current user profile (full)
router.get('/me', protect, getUserProfile);

// Get current user profile (short, for HelpCenter)
router.get('/profile', protect, getUserProfileShort);


// Update current user profile
router.put('/me', protect, updateUserProfile);
//get location
router.put("/location", protect, updateUserLocation);

router.get("/", getAllUsers);


// Get all saved addresses for the current user
router.get('/addresses', protect, getAddresses);

// Save a new address for the current user
router.post('/addresses', protect, saveAddress);

// Accept privacy and terms
router.post('/accept-policies', protect, acceptPolicies);

// //count in users in admin
// router.get("/new-count", getNewUserCount);

// // make it count o  in users in admin
// router.put("/mark-seen", markUsersAsSeen);


export default router;
 