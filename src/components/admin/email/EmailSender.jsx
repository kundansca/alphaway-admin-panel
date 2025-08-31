import React, { useState, useRef, useMemo } from "react";
import Papa from "papaparse";
import JoditEditor, { Jodit } from "jodit-react";
import Layout from "../../../layout/Index";
import axios from "axios";
import "./EmailSender.css";
import { useSelector } from "react-redux";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";
import "./EmailSender.css";
const EmailSender = () => {
  const [csvData, setCsvData] = useState([]);
  const [csvFile, setCsvFile] = useState();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const editorRef = useRef(null);
  const [testName, setTestName] = useState("");
  const fileInputRef = useRef(null);
  const authData = useSelector((state) => state.auth);
  const BASEURL = import.meta.env.VITE_APP_BASE_API_URL;

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => setCsvData(result.data),
      });
      setCsvFile(file);
      setPreview(false);
      setTestPassed(false);
    }
  };

  const applyTextColor = (color) => {
    if (editorRef.current) {
      editorRef.current.current?.editor?.execCommand("foreColor", false, color);
      setTextColor(color);
    }
  };

  const applyBackgroundColor = (color) => {
    if (editorRef.current) {
      editorRef.current.current?.editor?.execCommand(
        "hiliteColor",
        false,
        color
      );
      setBackgroundColor(color);
    }
  };

  const handleInsertImage = () => {
    if (!imageUrl.trim()) return;
    const editor = editorRef.current.editor;
    if (redirectUrl.trim()) {
      editor.selection.insertHTML(
        `<a href="${redirectUrl}" target="_blank"><img src="${imageUrl}" alt="image"/></a>`
      );
    } else {
      editor.selection.insertImage(imageUrl);
    }
    setShowImageModal(false);
    setImageUrl("");
    setRedirectUrl("");
  };

  //   const sanitizeContent = (content) => {
  //     return DOMPurify.sanitize(content, {
  //       ALLOWED_TAGS: ["a", "img", "p", "br", "b", "i", "u", "span", "div"],
  //       ALLOWED_ATTR: ["href", "src", "alt", "title", "style", "target"],
  //     });
  //   };

  const handleSend = async () => {
    if (!csvFile) return alert("Upload CSV first!");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("template", message);
      formData.append("file", csvFile);

      const res = await axios.post(`${BASEURL}/email/send-bulk`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authData.userData.accessToken}`,
        },
      });

      if (res.status === 200) {
        Toast.fire({ icon: "success", title: "Emails sent successfully!" });
        setCsvData([]);
        setCsvFile(null);
        setSubject("");
        setMessage("");
        setPreview(false);
        setTestPassed(false);
        setTestEmail("");
        setTestName("");
        setTextColor("#000000");
        setBackgroundColor("#ffffff");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        Toast.fire({ icon: "error", title: "Error sending emails!" });
      }
    } catch {
      Toast.fire({ icon: "error", title: "Server error!" });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!validateEmail(testEmail)) {
      setTestError("Please enter a valid email address!");
      return;
    }
    setTestError("");
    setTestLoading(true);
    try {
      const payload = {
        emailSubject: subject,
        template: message,
        recipientEmail: testEmail,
        recipientName: testName,
      };

      const res = await axios.post(`${BASEURL}/email/send-test`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.userData.accessToken}`,
        },
      });

      if (res.status === 200) {
        Toast.fire({ icon: "success", title: "Test email sent successfully!" });
        setTestPassed(true);
        setShowTestModal(false);
        setTestEmail("");
        setTestName("");
      } else {
        Toast.fire({ icon: "error", title: "Error sending test email!" });
      }
    } catch {
      Toast.fire({ icon: "error", title: "Server error!" });
    } finally {
      setTestLoading(false);
    }
  };

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 350,
      toolbarSticky: true,
      toolbarStickyOffset: 50,
      removeButtons: ["about"],
      controls: {
        paragraph: {
          list: {
            p: "Normal",
            h1: "Heading 1",
            h2: "Heading 2",
            h3: "Heading 3",
            h4: "Heading 4",
            h5: "Heading 5",
            h6: "Heading 6",
          },
        },
      },
    }),
    []
  );

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
              ref={fileInputRef}
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

            <JoditEditor
              ref={editorRef}
              value={message}
              tabIndex={1}
              onBlur={(newContent) => setMessage(newContent)}
              config={editorConfig}
            />
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between flex-wrap gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => setPreview(!preview)}
              disabled={!csvData.length || !subject.trim() || !message.trim()}
            >
              {preview ? "Hide Preview" : "Preview"}
            </button>

            <button
              className="btn btn-warning"
              onClick={() => setShowTestModal(true)}
              disabled={
                !csvData.length ||
                !subject.trim() ||
                !message.trim() ||
                !preview
              }
            >
              Send Test Email
            </button>

            <button
              className="btn btn-primary"
              onClick={handleSend}
              disabled={
                loading ||
                !csvData.length ||
                !subject.trim() ||
                !message.trim() ||
                !preview ||
                !testPassed
              }
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

          {/* Preview */}
          {preview && (
            <div className="mt-4 border p-3 rounded bg-light">
              <h5>📌 Preview</h5>
              <p>
                <strong>Subject:</strong> {subject}
              </p>
              <p>
                <strong>Message:</strong>
              </p>
              <div
                dangerouslySetInnerHTML={{ __html: message }}
                style={{
                  maxHeight: "250px",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#fff",
                }}
              />
            </div>
          )}

          {/* Modals */}
          {/* Image Modal */}
          {showImageModal && (
            <>
              <div className="modal d-block" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Insert Image</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowImageModal(false)}
                      ></button>
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
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowImageModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleInsertImage}
                      >
                        Insert
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="modal-backdrop fade show"
                onClick={() => setShowImageModal(false)}
              ></div>
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
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowTestModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Enter your name"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                      />
                      <input
                        type="email"
                        className={`form-control ${
                          testError ? "is-invalid" : ""
                        }`}
                        placeholder="Enter test email"
                        value={testEmail}
                        onChange={(e) => {
                          setTestEmail(e.target.value);
                          if (testError) setTestError("");
                        }}
                      />
                      {testError && (
                        <div className="invalid-feedback">{testError}</div>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowTestModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={handleTestEmail}
                        disabled={
                          testLoading || !testEmail.trim() || !testName.trim()
                        }
                      >
                        {testLoading ? "Sending..." : "Send Test Email"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="modal-backdrop fade show"
                onClick={() => setShowTestModal(false)}
              ></div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EmailSender;
