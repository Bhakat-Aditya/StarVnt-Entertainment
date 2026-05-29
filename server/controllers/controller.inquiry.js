// controllers/controller.inquiry.js
// Full CRUD for Inquiries — vendors can view, edit, update status, and delete.

import Inquiry from "../models/model.inquiry.js";
import VendorProfile from "../models/model.vendorProfile.js";

// ── Shared helper ─────────────────────────────────────────────────────────────
// Fetch the vendor profile for the logged-in user and return it.
// Returns null and sends a 404 if not found.
const getVendorProfile = async (req, res) => {
  const profile = await VendorProfile.findOne({ user: req.user._id });
  if (!profile) {
    res.status(404).json({ success: false, message: "Vendor profile not found." });
    return null;
  }
  return profile;
};

// ============================================================
// @route   GET /api/inquiries
// @access  Private
// @desc    Get all inquiries for the logged-in vendor + stats
// ============================================================
export const getAllInquiries = async (req, res) => {
  try {
    const vendorProfile = await getVendorProfile(req, res);
    if (!vendorProfile) return;

    const inquiries = await Inquiry.find({ vendor: vendorProfile._id }).sort({
      createdAt: -1,
    });

    const totalInquiries = inquiries.length;
    const upcomingEvents = inquiries.filter(
      (inq) => new Date(inq.eventDate) > new Date() && inq.status !== "Rejected"
    ).length;
    const confirmedBookings = inquiries.filter(
      (inq) => inq.status === "Confirmed"
    ).length;

    res.status(200).json({
      success: true,
      count: totalInquiries,
      stats: { totalInquiries, upcomingEvents, confirmedBookings },
      inquiries,
    });
  } catch (error) {
    console.error("Get Inquiries Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ============================================================
// @route   GET /api/inquiries/:id
// @access  Private
// @desc    Get a single inquiry by ID (with ownership check)
// ============================================================
export const getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate(
      "vendor",
      "vendorName category"
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }

    const vendorProfile = await getVendorProfile(req, res);
    if (!vendorProfile) return;

    if (inquiry.vendor._id.toString() !== vendorProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this inquiry.",
      });
    }

    res.status(200).json({ success: true, inquiry });
  } catch (error) {
    console.error("Get Inquiry Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ============================================================
// @route   PUT /api/inquiries/:id/status
// @access  Private
// @desc    Update the status of an inquiry
// ============================================================
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["New", "Contacted", "Confirmed", "Rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }

    res.status(200).json({ success: true, inquiry });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ============================================================
// @route   PUT /api/inquiries/:id
// @access  Private
// @desc    Edit full inquiry details (client info, event, message)
// ============================================================
export const updateInquiry = async (req, res) => {
  try {
    const vendorProfile = await getVendorProfile(req, res);
    if (!vendorProfile) return;

    // Find the inquiry and verify it belongs to this vendor
    const existing = await Inquiry.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }
    if (existing.vendor.toString() !== vendorProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this inquiry.",
      });
    }

    // Whitelist the fields that can be edited
    const { clientName, clientEmail, clientPhone, eventDate, eventType, message, status } =
      req.body;

    const allowedStatuses = ["New", "Contacted", "Confirmed", "Rejected"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const updateData = {};
    if (clientName !== undefined) updateData.clientName = clientName;
    if (clientEmail !== undefined) updateData.clientEmail = clientEmail;
    if (clientPhone !== undefined) updateData.clientPhone = clientPhone;
    if (eventDate !== undefined) updateData.eventDate = eventDate;
    if (eventType !== undefined) updateData.eventType = eventType;
    if (message !== undefined) updateData.message = message;
    if (status !== undefined) updateData.status = status;

    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, inquiry });
  } catch (error) {
    console.error("Update Inquiry Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ============================================================
// @route   DELETE /api/inquiries/:id
// @access  Private
// @desc    Permanently delete an inquiry
// ============================================================
export const deleteInquiry = async (req, res) => {
  try {
    const vendorProfile = await getVendorProfile(req, res);
    if (!vendorProfile) return;

    // Find the inquiry and verify ownership before deleting
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found." });
    }

    // Authorization: only the vendor who owns this inquiry can delete it
    if (inquiry.vendor.toString() !== vendorProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this inquiry.",
      });
    }

    // findByIdAndDelete removes the document from MongoDB
    await Inquiry.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully.",
      deletedId: req.params.id, // Send back the ID so the frontend can remove it from state
    });
  } catch (error) {
    console.error("Delete Inquiry Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ============================================================
// @route   POST /api/inquiries
// @access  Public
// @desc    Create a new inquiry (submitted by clients)
// ============================================================
export const createInquiry = async (req, res) => {
  try {
    const { vendorId, clientName, clientEmail, clientPhone, eventDate, eventType, message } =
      req.body;

    const inquiry = await Inquiry.create({
      vendor: vendorId,
      clientName,
      clientEmail,
      clientPhone,
      eventDate,
      eventType,
      message,
    });

    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    console.error("Create Inquiry Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ============================================================
// @route   POST /api/inquiries/manual
// @access  Private (Vendor only)
// @desc    Manually add an inquiry from the dashboard
// ============================================================
export const createInquiryManual = async (req, res) => {
  try {
    const vendorProfile = await getVendorProfile(req, res);
    if (!vendorProfile) return;

    const { clientName, clientEmail, clientPhone, eventDate, eventType, message, status } =
      req.body;

    const inquiry = await Inquiry.create({
      vendor: vendorProfile._id,
      clientName,
      clientEmail,
      clientPhone,
      eventDate,
      eventType,
      message,
      status: status || "New",
    });

    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    console.error("Manual Create Inquiry Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

