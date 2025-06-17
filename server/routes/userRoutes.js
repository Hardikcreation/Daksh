import express from 'express';
import { getUserProfile,getAllUsers,updateUserLocation,updateUserProfile,getAddresses,
saveAddress} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get current user profile
router.get('/me', protect, getUserProfile);


// Update current user profile
router.put('/me', protect, updateUserProfile);
//get location
router.put("/location", protect, updateUserLocation);

router.get("/", getAllUsers);


// Get all saved addresses for the current user
router.get('/addresses', protect, getAddresses);

// Save a new address for the current user
router.post('/addresses', protect, saveAddress);

// //count in users in admin
// router.get("/new-count", getNewUserCount);

// // make it count o  in users in admin
// router.put("/mark-seen", markUsersAsSeen);


export default router;
 