import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("name email createdAt"); // select only needed fields
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//updatelocation
export const updateUserLocation = async (req, res) => {
  try {
    const { location } = req.body;
    const userId = req.userId; // Provided by protect middleware

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.location = location;
    await user.save();

    res.status(200).json({ message: "Location updated", location: user.location });
  } catch (error) {
    console.error("Update location error:", error);
    res.status(500).json({ message: "Server error while updating location" });
  }
};

// //manage usercount in admin 
// Get all saved addresses for the current user
export const getAddresses = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.addresses || []);
};

//  Save a new address for the current user, but don't add duplicates; always respond success


export const saveAddress = async (req, res) => {
  const { houseNumber, street, landmark, addressType } = req.body;
  if (!houseNumber || !street || !addressType) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }
  const user = await User.findById(req.user._id);

  // Check for duplicate addresses
  const addressExists = user.addresses.some(addr =>
    addr.houseNumber.trim().toLowerCase() === houseNumber.trim().toLowerCase() &&
    addr.street.trim().toLowerCase() === street.trim().toLowerCase() &&
    (addr.landmark || '').trim().toLowerCase() === (landmark || '').trim().toLowerCase() &&
    addr.addressType === addressType
  );

  // Only push if not present
  if (!addressExists) {
    user.addresses.push({ houseNumber, street, landmark, addressType });
    await user.save();
  }

  // Always respond with success
  res.status(201).json({ msg: 'Address saved (duplicate ignored if present)' });
};