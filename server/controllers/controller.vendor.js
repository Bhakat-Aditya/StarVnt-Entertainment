// controllers/controller.vendor.js
// Handles fetching and updating a vendor's profile.
// All routes using these controllers are protected (require a valid JWT).

import VendorProfile from "../models/model.vendorProfile.js";

// ============================================================
// @route   GET /api/vendor/profile
// @access  Private
// @desc    Get the logged-in vendor's profile
// ============================================================
export const getProfile = async (req, res) => {
  try {
    // req.user._id is set by the protect middleware after decoding the JWT.
    // We find the VendorProfile where the 'user' field matches the logged-in user's ID.
    // .populate('user', 'name email') fetches and embeds the linked User document
    // (only name and email fields) instead of just the raw ObjectId.
    const profile = await VendorProfile.findOne({ user: req.user._id }).populate(
      "user",
      "name email"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found.",
      });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ============================================================
// @route   PUT /api/vendor/profile
// @access  Private
// @desc    Update the logged-in vendor's profile
// ============================================================
export const updateProfile = async (req, res) => {
  try {
    // --- Whitelist Allowed Fields ---
    // We explicitly pick only the fields a vendor is allowed to update.
    // This prevents them from accidentally (or maliciously) changing the 'user' reference.
    const { vendorName, category, location, contact, bio } = req.body;
    const updateData = { vendorName, category, location, contact, bio };

    // findOneAndUpdate:
    // - 1st arg: filter (find the profile belonging to this user)
    // - 2nd arg: the update object
    // - 3rd arg: options
    //   - new: true → return the UPDATED document (not the old one)
    //   - runValidators: true → run schema validators on the update
    const updatedProfile = await VendorProfile.findOneAndUpdate(
      { user: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found.",
      });
    }

    res.status(200).json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
