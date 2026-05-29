
import { useState, useEffect } from "react";
import api from "../api/axios.js";
import Badge from "../components/ui/Badge.jsx";
import Modal from "../components/ui/Modal.jsx";

const STATUS_OPTIONS = ["New", "Contacted", "Confirmed", "Rejected"];
const EVENT_TYPES = [
  "Wedding", "Corporate", "Birthday", "Anniversary",
  "Fashion Show", "Conference", "Concert", "Other",
];

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

const toInputDate = (dateString) =>
  new Date(dateString).toISOString().split("T")[0];

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "8px",
  border: "1.5px solid var(--color-border)",
  backgroundColor: "var(--color-surface-2)",
  color: "var(--color-text)",
  fontSize: "13px",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.15s ease",
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "600",
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "5px",
};

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // "view" | "edit" | "delete"

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const { data } = await api.get("/inquiries");

        if (!data || !data.inquiries) {
          throw new Error("Invalid API response. Proxy may have failed.");
        }

        setInquiries(data.inquiries);
      } catch (err) {
        console.error("Failed to fetch inquiries:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const openModal = (inquiry, mode = "view") => {
    setSelectedInquiry(inquiry);
    setModalMode(mode);
    setFormError("");

    setEditForm({
      clientName: inquiry.clientName || "",
      clientEmail: inquiry.clientEmail || "",
      clientPhone: inquiry.clientPhone || "",
      eventType: inquiry.eventType || "",
      eventDate: toInputDate(inquiry.eventDate),
      message: inquiry.message || "",
      status: inquiry.status,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError("");
    setTimeout(() => {
      setSelectedInquiry(null);
      setModalMode("view");
    }, 200);
  };

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    setIsUpdating(true);
    try {
      const { data } = await api.put(`/inquiries/${inquiryId}/status`, {
        status: newStatus,
      });
      const updated = data.inquiry;

      setInquiries((prev) =>
        prev.map((inq) => (inq._id === inquiryId ? updated : inq))
      );

      if (selectedInquiry?._id === inquiryId) {
        setSelectedInquiry(updated);
        setEditForm((f) => ({ ...f, status: updated.status }));
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setFormError("");
    try {
      const { data } = await api.put(`/inquiries/${selectedInquiry._id}`, editForm);
      const updated = data.inquiry;

      setInquiries((prev) =>
        prev.map((inq) => (inq._id === updated._id ? updated : inq))
      );
      setSelectedInquiry(updated);
      setModalMode("view"); // Switch back to view after save
    } catch (error) {
      setFormError(
        error.response?.data?.message || "Failed to save changes. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateSave = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setFormError("");
    try {
      const { data } = await api.post("/inquiries/manual", editForm);
      const newInquiry = data.inquiry;

      setInquiries((prev) => [newInquiry, ...prev]);
      closeModal();
    } catch (error) {
      setFormError(
        error.response?.data?.message || "Failed to create inquiry. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/inquiries/${selectedInquiry._id}`);

      setInquiries((prev) =>
        prev.filter((inq) => inq._id !== selectedInquiry._id)
      );
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete inquiry.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredInquiries =
    filterStatus === "All"
      ? inquiries
      : inquiries.filter((inq) => inq.status === filterStatus);

  const getCount = (status) =>
    status === "All"
      ? inquiries.length
      : inquiries.filter((i) => i.status === status).length;

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "300px",
          color: "var(--color-text-muted)",
        }}
      >
        Loading inquiries...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px" }}>
      {}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "var(--color-text)",
              letterSpacing: "-0.3px",
            }}
          >
            Event Inquiries
          </h2>
          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>
            {inquiries.length} total booking request{inquiries.length !== 1 ? "s" : ""} ·
            Click any row to view details, edit, or delete
          </p>
        </div>
        <button
          onClick={() => {
            setEditForm({
              clientName: "", clientEmail: "", clientPhone: "",
              eventType: "", eventDate: "", message: "", status: "New"
            });
            setModalMode("create");
            setIsModalOpen(true);
          }}
          style={{
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            color: "white",
            border: "none",
            padding: "9px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "16px" }}>+</span> Add Inquiry
        </button>
      </div>

      {}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "20px",
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "10px",
          padding: "4px",
          width: "fit-content",
          flexWrap: "wrap",
        }}
      >
        {["All", ...STATUS_OPTIONS].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              padding: "6px 14px",
              borderRadius: "7px",
              border: "none",
              fontSize: "13px",
              fontWeight: filterStatus === status ? "600" : "400",
              cursor: "pointer",
              transition: "all 0.15s ease",
              backgroundColor:
                filterStatus === status ? "var(--color-primary)" : "transparent",
              color: filterStatus === status ? "white" : "var(--color-text-muted)",
              fontFamily: "inherit",
            }}
          >
            {status}
            <span style={{ marginLeft: "5px", fontSize: "11px", opacity: 0.75 }}>
              ({getCount(status)})
            </span>
          </button>
        ))}
      </div>

      {}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {filteredInquiries.length === 0 ? (
          <div
            style={{
              padding: "60px 24px",
              textAlign: "center",
              color: "var(--color-text-muted)",
            }}
          >
            <p style={{ fontSize: "24px", marginBottom: "10px" }}>📭</p>
            <p style={{ fontSize: "15px", fontWeight: "600", color: "var(--color-text)" }}>
              No {filterStatus !== "All" ? filterStatus.toLowerCase() + " " : ""}inquiries found
            </p>
          </div>
        ) : (
          <>
            {}
            <div
              className="inquiry-grid inquiry-header"
              style={{
                padding: "11px 20px",
                borderBottom: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface-2)",
              }}
            >
              <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Client</p>
              <p className="hide-on-mobile" style={{ fontSize: "11px", fontWeight: "600", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Event Date</p>
              <p className="hide-on-tablet hide-on-mobile" style={{ fontSize: "11px", fontWeight: "600", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Type</p>
              <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Status</p>
              <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Actions</p>
            </div>

            {}
            {filteredInquiries.map((inquiry, index) => (
              <InquiryRow
                key={inquiry._id}
                inquiry={inquiry}
                isLast={index === filteredInquiries.length - 1}
                onOpen={() => openModal(inquiry, "view")}
                onConfirm={() => handleStatusUpdate(inquiry._id, "Confirmed")}
                onReject={() => handleStatusUpdate(inquiry._id, "Rejected")}
                isUpdating={isUpdating}
              />
            ))}
          </>
        )}
      </div>

      {}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalMode === "create"
            ? "New Inquiry"
            : modalMode === "edit"
            ? "Edit Inquiry"
            : modalMode === "delete"
            ? "Delete Inquiry"
            : "Inquiry Details"
        }
      >
        {}
        {(selectedInquiry || modalMode === "create") && (
          <>
            {}
            {modalMode === "view" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {}
                <Section title="Client Information">
                  <DetailGrid>
                    <DetailItem label="Name" value={selectedInquiry.clientName} />
                    <DetailItem label="Email" value={selectedInquiry.clientEmail || "—"} />
                    <DetailItem label="Phone" value={selectedInquiry.clientPhone || "—"} />
                  </DetailGrid>
                </Section>

                {}
                <Section title="Event Details">
                  <DetailGrid>
                    <DetailItem label="Event Type" value={selectedInquiry.eventType || "—"} />
                    <DetailItem label="Event Date" value={formatDate(selectedInquiry.eventDate)} />
                    <DetailItem label="Submitted" value={formatDate(selectedInquiry.createdAt)} />
                  </DetailGrid>
                </Section>

                {}
                {selectedInquiry.message && (
                  <Section title="Message from Client">
                    <div
                      style={{
                        padding: "14px",
                        backgroundColor: "var(--color-surface-2)",
                        borderRadius: "8px",
                        fontSize: "14px",
                        color: "var(--color-text)",
                        lineHeight: "1.7",
                        fontStyle: "italic",
                      }}
                    >
                      &ldquo;{selectedInquiry.message}&rdquo;
                    </div>
                  </Section>
                )}

                {}
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "var(--color-surface-2)",
                    borderRadius: "10px",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "var(--color-text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "6px",
                      }}
                    >
                      Current Status
                    </p>
                    <Badge status={selectedInquiry.status} />
                  </div>

                  <select
                    value={selectedInquiry.status}
                    disabled={isUpdating}
                    onChange={(e) =>
                      handleStatusUpdate(selectedInquiry._id, e.target.value)
                    }
                    style={{
                      ...inputStyle,
                      width: "auto",
                      minWidth: "140px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {isUpdating && (
                  <p style={{ fontSize: "12px", color: "var(--color-primary)", marginTop: "-12px" }}>
                    Updating status…
                  </p>
                )}

                {}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    paddingTop: "4px",
                    flexWrap: "wrap",
                  }}
                >
                  <ActionButton
                    label="✏️  Edit Details"
                    variant="secondary"
                    onClick={() => setModalMode("edit")}
                  />
                  <ActionButton
                    label="🗑️  Delete Inquiry"
                    variant="danger"
                    onClick={() => setModalMode("delete")}
                  />
                </div>
              </div>
            )}

            {}
            {(modalMode === "edit" || modalMode === "create") && (
              <form onSubmit={modalMode === "create" ? handleCreateSave : handleEditSave}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {formError && (
                    <div
                      style={{
                        padding: "10px 14px",
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        fontSize: "13px",
                        color: "#dc2626",
                      }}
                    >
                      {formError}
                    </div>
                  )}

                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--color-text-muted)",
                      paddingBottom: "4px",
                      borderBottom: "1px solid var(--color-border)",
                    }}
                  >
                    {modalMode === "create" ? "Enter Client & Event Information" : "Edit Client & Event Information"}
                  </p>

                  {}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "14px",
                    }}
                  >
                    <Field label="Client Name" required>
                      <input
                        style={inputStyle}
                        value={editForm.clientName}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, clientName: e.target.value }))
                        }
                        required
                        onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                      />
                    </Field>

                    <Field label="Client Email">
                      <input
                        type="email"
                        style={inputStyle}
                        value={editForm.clientEmail}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, clientEmail: e.target.value }))
                        }
                        onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                      />
                    </Field>

                    <Field label="Client Phone">
                      <input
                        style={inputStyle}
                        value={editForm.clientPhone}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, clientPhone: e.target.value }))
                        }
                        onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                      />
                    </Field>

                    <Field label="Event Type">
                      <select
                        style={{ ...inputStyle, cursor: "pointer" }}
                        value={editForm.eventType}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, eventType: e.target.value }))
                        }
                      >
                        <option value="">Select type</option>
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Event Date" required>
                      <input
                        type="date"
                        style={inputStyle}
                        value={editForm.eventDate}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, eventDate: e.target.value }))
                        }
                        required
                        onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                      />
                    </Field>

                    <Field label="Status">
                      <select
                        style={{ ...inputStyle, cursor: "pointer" }}
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, status: e.target.value }))
                        }
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {}
                  <Field label="Message">
                    <textarea
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
                      value={editForm.message}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, message: e.target.value }))
                      }
                      onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                    />
                  </Field>

                  {}
                  <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      style={{
                        padding: "10px 22px",
                        borderRadius: "8px",
                        border: "none",
                        background: isUpdating
                          ? "var(--color-text-muted)"
                          : "linear-gradient(135deg, #6366f1, #4f46e5)",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: isUpdating ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {isUpdating ? "Saving…" : modalMode === "create" ? "Add Inquiry" : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (modalMode === "create") {
                          closeModal();
                        } else {
                          setModalMode("view"); 
                          setFormError("");
                        }
                      }}
                      style={{
                        padding: "10px 22px",
                        borderRadius: "8px",
                        border: "1.5px solid var(--color-border)",
                        background: "none",
                        color: "var(--color-text-muted)",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {}
            {modalMode === "delete" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {}
                <div style={{ textAlign: "center", paddingTop: "8px" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>🗑️</div>
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: "700",
                      color: "var(--color-text)",
                      marginBottom: "8px",
                    }}
                  >
                    Delete this inquiry?
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                    You are about to permanently delete the inquiry from{" "}
                    <strong style={{ color: "var(--color-text)" }}>
                      {selectedInquiry.clientName}
                    </strong>
                    . This action <strong>cannot be undone</strong>.
                  </p>
                </div>

                {}
                <div
                  style={{
                    padding: "14px 16px",
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "10px",
                    fontSize: "13px",
                    color: "#7f1d1d",
                  }}
                >
                  <p><strong>Client:</strong> {selectedInquiry.clientName}</p>
                  <p style={{ marginTop: "4px" }}>
                    <strong>Event:</strong> {selectedInquiry.eventType || "—"} on{" "}
                    {formatDate(selectedInquiry.eventDate)}
                  </p>
                  <p style={{ marginTop: "4px" }}>
                    <strong>Status:</strong> {selectedInquiry.status}
                  </p>
                </div>

                {}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    style={{
                      flex: 1,
                      padding: "11px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: isDeleting ? "#fca5a5" : "#ef4444",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "700",
                      cursor: isDeleting ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {isDeleting ? "Deleting…" : "Yes, Delete It"}
                  </button>
                  <button
                    onClick={() => setModalMode("view")}
                    disabled={isDeleting}
                    style={{
                      flex: 1,
                      padding: "11px",
                      borderRadius: "8px",
                      border: "1.5px solid var(--color-border)",
                      background: "none",
                      color: "var(--color-text)",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Keep Inquiry
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

const InquiryRow = ({ inquiry, isLast, onOpen, onConfirm, onReject, isUpdating }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="inquiry-grid inquiry-row-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "13px 20px",
        borderBottom: isLast ? "none" : "1px solid var(--color-border)",
        cursor: "pointer",
        transition: "background 0.15s ease",
        backgroundColor: hovered ? "var(--color-surface-2)" : "transparent",
      }}
    >
      {}
      <div
        onClick={onOpen}
        style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, width: "100%" }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "var(--color-primary-light)",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "12px",
            flexShrink: 0,
          }}
        >
          {inquiry.clientName?.charAt(0) || "?"}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--color-text)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {inquiry.clientName}
          </p>
          {inquiry.clientEmail && (
            <p
              style={{
                fontSize: "12px",
                color: "var(--color-text-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {inquiry.clientEmail}
            </p>
          )}
          {}
          <p
            className="sm:hidden"
            style={{
              fontSize: "12px",
              color: "var(--color-text-muted)",
              marginTop: "4px",
            }}
          >
            {formatDate(inquiry.eventDate)} • {inquiry.eventType || "Event"}
          </p>
        </div>
      </div>

      {}
      <p
        className="hide-on-mobile"
        onClick={onOpen}
        style={{ fontSize: "13px", color: "var(--color-text)" }}
      >
        {formatDate(inquiry.eventDate)}
      </p>

      {}
      <p
        className="hide-on-tablet hide-on-mobile"
        onClick={onOpen}
        style={{
          fontSize: "13px",
          color: "var(--color-text-muted)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {inquiry.eventType || "—"}
      </p>

      {}
      <div onClick={onOpen} className="mobile-status-float">
        <Badge status={inquiry.status} size="sm" />
      </div>

      {}
      <div className="inquiry-actions">
        {}
        {inquiry.status !== "Confirmed" && (
          <button
            title="Quick Confirm"
            disabled={isUpdating}
            onClick={(e) => { e.stopPropagation(); onConfirm(); }}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              border: "1px solid #bbf7d0",
              backgroundColor: "#f0fdf4",
              color: "#16a34a",
              cursor: "pointer",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#dcfce7")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f0fdf4")}
          >
            ✓
          </button>
        )}

        {}
        {inquiry.status !== "Rejected" && (
          <button
            title="Quick Reject"
            disabled={isUpdating}
            onClick={(e) => { e.stopPropagation(); onReject(); }}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              border: "1px solid #fecaca",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              cursor: "pointer",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fee2e2")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
          >
            ✗
          </button>
        )}

        {}
        <button
          title="View Details"
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "6px",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-text-muted)",
            cursor: "pointer",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          ↗
        </button>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <section>
    <p
      style={{
        fontSize: "11px",
        fontWeight: "700",
        color: "var(--color-text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: "12px",
      }}
    >
      {title}
    </p>
    {children}
  </section>
);

const DetailGrid = ({ children }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "14px",
    }}
  >
    {children}
  </div>
);

const DetailItem = ({ label, value }) => (
  <div>
    <p style={{ ...labelStyle, marginBottom: "3px" }}>{label}</p>
    <p style={{ fontSize: "14px", color: "var(--color-text)", fontWeight: "500" }}>{value}</p>
  </div>
);

const Field = ({ label, children, required }) => (
  <div>
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>}
    </label>
    {children}
  </div>
);

const ActionButton = ({ label, variant, onClick }) => {
  const styles = {
    primary: {
      background: "linear-gradient(135deg, #6366f1, #4f46e5)",
      color: "white",
      border: "none",
    },
    secondary: {
      background: "var(--color-surface-2)",
      color: "var(--color-text)",
      border: "1.5px solid var(--color-border)",
    },
    danger: {
      background: "#fef2f2",
      color: "#dc2626",
      border: "1.5px solid #fecaca",
    },
  };
  const s = styles[variant] || styles.secondary;

  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 18px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.15s ease",
        ...s,
      }}
    >
      {label}
    </button>
  );
};

export default Inquiries;
