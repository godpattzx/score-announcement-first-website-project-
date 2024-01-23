import React from "react";

const UploadFile = ({ handleFileChange, handleUpload }) => {
  return (
    <div className="input-group mb-3">
      <input
        type="file"
        className="form-control"
        id="customFile"
        onChange={handleFileChange}
      />
      <div className="input-group-append">
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={handleUpload}
          style={{ marginLeft: "5px" }}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadFile;
