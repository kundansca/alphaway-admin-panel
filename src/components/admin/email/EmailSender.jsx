import React, { useState } from "react";
import Papa from "papaparse";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Layout from "../../../layout/Index";
import axios from "axios";

const EmailSender = () => {
  const [csvData, setCsvData] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllRecipients, setShowAllRecipients] = useState(false); // NEW state

  // CSV File Upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setCsvData(result.data);
        },
      });
    }
  };

  // Send button click
  const handleSend = async () => {
    if (!csvData.length) {
      alert("Please upload a CSV file with emails first!");
      return;
    }
    setLoading(true);
    try {
      const payload = { subject, message, recipients: csvData };

      const res = await axios.post("http://localhost:5000/send-email", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        alert("Emails sent successfully!");
      } else {
        alert("Error sending emails!");
      }
    } catch (err) {
      console.error(err);
      alert("Server error!");
    } finally {
      setLoading(false);
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

          {/* Rich Text Editor for Message */}
          <div className="mb-3">
            <label className="form-label">Message</label>
            <ReactQuill
              theme="snow"
              value={message}
              onChange={setMessage}
              style={{ minHeight: "150px" }}
            />
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
              className="btn btn-primary"
              onClick={handleSend}
              disabled={
                loading ||
                !csvData.length ||
                !subject.trim() ||
                !message.trim() ||
                !preview
              }
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Sending...
                </>
              ) : (
                "Send Emails"
              )}
            </button>
          </div>

          {/* Preview Section */}
          {preview && (
            <div className="mt-4 border p-3 rounded bg-light">
              <h5>📌 Preview</h5>
              <p>
                <strong>Subject:</strong> {subject}
              </p>
              <p>
                <strong>Message:</strong>
              </p>
              <div dangerouslySetInnerHTML={{ __html: message }} />

              <p>
                <strong>Recipients:</strong>
              </p>

              {!showAllRecipients ? (
                <ul>
                  {csvData.slice(0, 5).map((row, i) => (
                    <li key={i}>{row.email}</li>
                  ))}
                  {csvData.length > 5 && (
                    <li
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => setShowAllRecipients(true)}
                    >
                      + {csvData.length - 5} more...
                    </li>
                  )}
                </ul>
              ) : (
                <div
                  style={{
                    maxHeight: "250px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "8px",
                    background: "#fff",
                  }}
                >
                  <ul className="list-unstyled mb-2">
                    {csvData.map((row, i) => (
                      <li key={i}>{row.email}</li>
                    ))}
                  </ul>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setShowAllRecipients(false)}
                  >
                    Show Less
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EmailSender;
