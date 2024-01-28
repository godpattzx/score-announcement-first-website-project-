
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CreateModal = ({
  show,
  handleClose,
  handleCreateModalSave,
  newSubjectData,
  setNewSubjectData,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Subject</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formSubjectName">
            <Form.Label>Subject Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Subject Name"
              value={newSubjectData.name}
              onChange={(e) =>
                setNewSubjectData({ ...newSubjectData, name: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formDescription">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Description"
              value={newSubjectData.description}
              onChange={(e) =>
                setNewSubjectData({
                  ...newSubjectData,
                  description: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group controlId="formLecturer">
            <Form.Label>Lecturer *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Lecturer's Name"
              value={newSubjectData.lecturer}
              onChange={(e) =>
                setNewSubjectData({
                  ...newSubjectData,
                  lecturer: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group controlId="formCourseCode">
            <Form.Label>Course Code *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Course Code"
              value={newSubjectData.courseCode}
              onChange={(e) =>
                setNewSubjectData({
                  ...newSubjectData,
                  courseCode: e.target.value,
                })
              }
            />
          </Form.Group>


          <Form.Group controlId="formFullScore">
            <Form.Label>Full Score *</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Full Score"
              value={newSubjectData.full_score}
              onChange={(e) =>
                setNewSubjectData({
                  ...newSubjectData,
                  full_score: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group controlId="formScoreCriteria" style={{ marginTop: "8px" }}>
            <Form.Label>Score Criteria *</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Score Criteria"
              value={newSubjectData.score_criteria}
              onChange={(e) =>
                setNewSubjectData({
                  ...newSubjectData,
                  score_criteria: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group controlId="formPublishAt" style={{ marginTop: "8px" }}>
            <Form.Label>Publish Date *</Form.Label>
            <Form.Control
              type="datetime-local"
              value={newSubjectData.publish_at}
              onChange={(e) =>
                setNewSubjectData({
                  ...newSubjectData,
                  publish_at: e.target.value,
                })
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateModalSave}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateModal;
