"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FiUpload, FiFile, FiX, FiCheck } from "react-icons/fi";

const FileUpload = ({
  onFileSelect,
  onJobDescriptionChange,
  jobDescription,
  selectedFile,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Please upload only PDF or DOCX files.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB.";
    }
    return null;
  };

  const handleFile = useCallback(
    (file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError("");
      setUploadedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        handleFile(file);
      }
    },
    [handleFile]
  );

  const removeFile = () => {
    setUploadedFile(null);
    setError("");
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Sync with parent-selectedFile to support external resets
  useEffect(() => {
    if (selectedFile == null) {
      setUploadedFile(null);
      setError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [selectedFile]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive
            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
            : uploadedFile
            ? "border-green-400 bg-green-50 dark:bg-green-900/20"
            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleChange}
        />

        {uploadedFile ? (
          <div className="space-y-4 animate-file-upload-success">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-lg px-4 py-3 shadow-sm">
                <FiFile className="w-6 h-6 text-green-500" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <FiX className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center text-green-600 dark:text-green-400">
              <FiCheck className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">
                File uploaded successfully
              </span>
            </div>
          </div>
        ) : (
          <div
            className={`space-y-4 ${dragActive ? "animate-drag-pulse" : ""}`}
          >
            <div className="flex justify-center">
              <FiUpload className="w-12 h-12 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Drop your resume here, or{" "}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports PDF and DOCX files up to 10MB
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>

      {/* Job Description Input */}
      {uploadedFile && (
        <div className="space-y-2">
          <label
            htmlFor="jobDescription"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Job Description (Optional)
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            placeholder="Paste the job description here to get more targeted analysis..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            rows={4}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Providing a job description will help AI analyze your resume more
            effectively
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
