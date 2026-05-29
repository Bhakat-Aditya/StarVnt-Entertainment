
import VendorProfile from "../models/model.vendorProfile.js";

export const getProfile = async (req, res) => {
  try {

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

export const updateProfile = async (req, res) => {
  try {

    const { vendorName, category, location, contact, bio } = req.body;
    const updateData = { vendorName, category, location, contact, bio };

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
