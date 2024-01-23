import React from "react";
import { Button, Modal } from "react-bootstrap";

const ConfirmUploadModal = ({ show, handleClose, handleConfirmUpload }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Upload</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to upload the selected file?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="info" onClick={handleConfirmUpload}>
          Confirm Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmUploadModal;
