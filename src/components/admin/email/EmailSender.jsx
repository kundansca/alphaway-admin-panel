import React, { useState, useRef } from "react";
import Papa from "papaparse";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import Layout from "../../../layout/Index";
import axios from "axios";
import "./EmailSender.css";
import { useSelector } from "react-redux";
import DOMPurify from "dompurify";

const SizeStyle = Quill.import('attributors/style/size');
SizeStyle.whitelist = ['small', 'normal', 'large', 'huge'];
Quill.register(SizeStyle, true);

// Custom Color Picker Component
const CustomColorPicker = ({ label, onChange, defaultValue }) => {
  const [color, setColor] = useState(defaultValue || "#000000");
  
  return (
    <div className="color-picker-container">
      <span className="color-picker-label">{label}</span>
      <div className="color-picker-wrapper">
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            onChange(e.target.value);
          }}
          className="color-picker-input"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            onChange(e.target.value);
          }}
          className="color-text-input"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};

const EmailSender = () => {
  const [csvData, setCsvData] = useState([]);
  const [csvFile, setCsvFile] = useState();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllRecipients, setShowAllRecipients] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testPassed, setTestPassed] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testError, setTestError] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const quillRef = useRef(null);
  const [testName, setTestName] = useState("");
   const authData = useSelector((state) => state.auth);
  const BASEURL = import.meta.env.VITE_APP_BASE_API_URL;

  // Email validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // CSV Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => setCsvData(result.data),
      });
      setCsvFile(file);
    }
  };

  // Apply text color
  const applyTextColor = (color) => {
    const quill = quillRef.current.getEditor();
    quill.format('color', color);
    setTextColor(color);
  };

  // Apply background color
  const applyBackgroundColor = (color) => {
    const quill = quillRef.current.getEditor();
    quill.format('background', color);
    setBackgroundColor(color);
  };

  // Insert Image from Modal
  const handleInsertImage = () => {
    if (!imageUrl.trim()) return;
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection(true);

    if (redirectUrl.trim()) {
      quill.clipboard.dangerouslyPasteHTML(
        range.index,
        `<a href="${redirectUrl}" target="_blank"><img src="${imageUrl}" alt="image" /></a>`,
       
      );
    } else {
      quill.insertEmbed(range.index, "image", imageUrl, "user");
    }
    setShowImageModal(false);
    setImageUrl("");
    setRedirectUrl("");
  };

 function sanitizeContent(content) {
  // Step 1: Decode escaped characters (remove backslashes)
  let unescaped = content.replace(/\\"/g, '"');

  // Step 2: Sanitize so no XSS or unwanted tags go to server
  let clean = DOMPurify.sanitize(unescaped, {
    ALLOWED_TAGS: ["a", "img", "p", "br", "b", "i", "u", "span", "div"],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "style", "target"],
  });

  return clean;
}


  

  // Send Bulk Email
  const handleSend = async () => {
    if (!csvFile) return alert("Upload CSV first!");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("template", message);
      formData.append("file", csvFile); // attach the file

      const res = await axios.post(`${BASEURL}/email/send-bulk`, formData, {
        headers: { "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authData.userData.accessToken}`
         },
      });

      if (res.status === 200) alert("Emails sent successfully!");
      else alert("Error sending emails!");
    } catch (err) {
     
      alert("Server error!");
    } finally {
      setLoading(false);
    }
  };

  // Send Test Email
  const handleTestEmail = async () => {
    if (!validateEmail(testEmail)) {
      setTestError("Please enter a valid email address!");
      return;
    }
    setTestError("");
    setTestLoading(true);
    try {
       let finalContent =sanitizeContent(message);
      const payload = { emailSubject:subject,template:finalContent, recipientEmail: testEmail,recipientName: testName };
      
     
      const res = await axios.post(`${BASEURL}/email/send-test`, payload, {
        headers: { "Content-Type": "application/json",
              Authorization: `Bearer ${authData.userData.accessToken}`
         },
      });
      if (res.status === 200) {
        alert("Test email sent successfully!");
        setTestPassed(true);
        setShowTestModal(false);
        setTestEmail("");
      } else alert("Error sending test email!");
    } catch (err) {
      
      alert("Server error!");
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="card shadow-lg p-4">
          <h2 className="text-center mb-4">📧 Bulk Email Sender</h2>

          {/* CSV Upload */}
          <div className="mb-3">
            <label className="form-label">Upload CSV File (with emails)</label>
            <input
              type="file"
              accept=".csv"
              className="form-control"
              onChange={handleFileUpload}
            />
          </div>

          {/* Subject */}
          <div className="mb-3">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Message Editor */}
          <div className="mb-3">
            <label className="form-label">Message</label>
            
            {/* Color Pickers */}
            <div className="d-flex gap-3 mb-2">
              <CustomColorPicker 
                label="Text Color" 
                onChange={applyTextColor} 
                defaultValue={textColor}
              />
              <CustomColorPicker 
                label="Background Color" 
                onChange={applyBackgroundColor} 
                defaultValue={backgroundColor}
              />
            </div>
            
            <div className="position-relative" style={{ minHeight: "180px" }}>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={message}
                onChange={setMessage}
                style={{ minHeight: "150px", maxHeight: "350px", overflow: "auto" }}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    [{ size: SizeStyle.whitelist }],
                    [{ color: [] }, { background: [] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ align: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link"],
                    ["clean"],
                  ],
                }}
                formats={[
                  "header",
                  "size",
                  "color",
                  "background",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "align",
                  "list",
                  "bullet",
                  "link",
                  "image",
                ]}
              />

              {/* Add Image Button */}
              <div
                className="image-url-btn"
            
              >
                <button
                  type="button"
                  style={{ border: "none", background: "transparent", cursor: "pointer" }}
                  onClick={() => setShowImageModal(true)}
                  title="Click to add image via URL"
                >
                  🖼
                </button>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between flex-wrap gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => setPreview(!preview)}
              disabled={!csvData.length}
            >
              {preview ? "Hide Preview" : "Preview"}
            </button>

            <button
              className="btn btn-warning"
              onClick={() => setShowTestModal(true)}
              disabled={!csvData.length || !subject.trim() || !message.trim() || !preview}
            >
              Send Test Email
            </button>

            <button
              className="btn btn-primary"
              onClick={handleSend}
              disabled={loading || !csvData.length || !subject.trim() || !message.trim() || !preview || !testPassed}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Sending...
                </>
              ) : (
                "Send Emails"
              )}
            </button>
          </div>

          {/* Image Modal */}
          {showImageModal && (
            <>
              <div className="modal d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Insert Image</h5>
                      <button type="button" className="btn-close" onClick={() => setShowImageModal(false)}></button>
                    </div>
                    <div className="modal-body">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Enter image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter redirect URL (optional)"
                        value={redirectUrl}
                        onChange={(e) => setRedirectUrl(e.target.value)}
                      />
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setShowImageModal(false)}>Cancel</button>
                      <button className="btn btn-primary" onClick={handleInsertImage}>Insert</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-backdrop fade show" onClick={() => setShowImageModal(false)}></div>
            </>
          )}

          {/* Test Email Modal */}
          {showTestModal && (
            <>
              <div className="modal d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Send Test Email</h5>
                      <button type="button" className="btn-close" onClick={() => setShowTestModal(false)}></button>
                    </div>
                    <div className="modal-body">
                  {/* Name Input */}
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter your name"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                    />


                      <input
                        type="email"
                        className={`form-control ${testError ? "is-invalid" : ""}`}
                        placeholder="Enter test email address"
                        value={testEmail}
                        onChange={(e) => {
                          setTestEmail(e.target.value);
                          if (testError) setTestError("");
                        }}
                      />
                      {testError && <div className="invalid-feedback">{testError}</div>}
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={() => setShowTestModal(false)}>Cancel</button>
                      <button
                        className="btn btn-warning"
                        onClick={handleTestEmail}
                        disabled={testLoading || !testEmail.trim() || !testName.trim()}
                      >
                        {testLoading ? "Sending..." : "Send Test Email"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-backdrop fade show" onClick={() => setShowTestModal(false)}></div>
            </>
          )}

          {/* Preview Section */}
          {preview && (
            <div className="mt-4 border p-3 rounded bg-light">
              <h5>📌 Preview</h5>
              <p><strong>Subject:</strong> {subject}</p>
              <p><strong>Message:</strong></p>
              <div
                dangerouslySetInnerHTML={{ __html: message }}
                style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid #ddd", padding: "10px", borderRadius: "8px", background: "#fff" }}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EmailSender;