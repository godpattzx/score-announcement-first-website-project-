import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

const EditModal = ({ show, handleClose, handleEditInputChange, saveEditedScore, editedScore }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Score</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formStudentId">
            <Form.Label>Student ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Student ID"
              name="student_id"
              value={editedScore.student_id}
              onChange={handleEditInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formScore">
            <Form.Label>Score</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Score"
              name="score"
              value={editedScore.score}
              onChange={handleEditInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={saveEditedScore}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
