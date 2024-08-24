import React, { useState, useEffect } from "react";
import { uploadFile, getUserFiles, deleteFile } from "./authService";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [fileInput, setFileInput] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getUserFiles()
      .then(response => {
        setFiles(response);
      })
      .catch(error => {
        console.error("Failed to fetch files:", error);
        setError("Failed to fetch files.");
      });
  }, []);

  const handleFileChange = (e) => {
    setFileInput(e.target.files[0]);
  };

  const handleFileUpload = (e) => {
    e.preventDefault();

    if (fileInput) {
      uploadFile(fileInput)
        .then(response => {
          setFiles([...files, response]);
          setFileInput(null);
          alert("File uploaded successfully!");
        })
        .catch(error => {
          console.error("Failed to upload file:", error);
          setError("Failed to upload file.");
        });
    } else {
      alert("Please select a file to upload.");
    }
  };

  const handleFileDelete = (fileId) => {
    deleteFile(fileId)
      .then(() => {
        setFiles(files.filter(file => file._id !== fileId));
        alert("File deleted successfully!");
      })
      .catch(error => {
        console.error("Failed to delete file:", error);
        setError("Failed to delete file.");
      });
  };

  return (
    <div className="file-upload-container">
      <h3 className="section-header">Upload Files</h3>
      <input type="file" onChange={handleFileChange} class="form-control" />
      {fileInput && (
        <p className="chosen-file-name">{fileInput.name}</p>
      )}
      <button onClick={handleFileUpload} className="btn btn-primary">Upload</button>
      
      {error && <p className="error-message">{error}</p>}

      <div className="file-list-section">
        <h3 className="section-header">Uploaded Files</h3>
        <ul>
          {files.map(file => (
            <li key={file._id}>
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="file-name">
                {file.fileName}
              </a>
              <button 
                onClick={() => handleFileDelete(file._id)} 
                className="btn btn-danger delete-btn">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
