import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditModal = ({ show, handleClose, handleSaveChanges, editedItem, setEditedItem }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Subject</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Form>
            <Form.Group controlId="formSubjectName">
              <Form.Label>Subject Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Subject Name"
                value={editedItem?.attributes?.name || ""}
                onChange={(e) =>
                  setEditedItem((prevItem) => ({
                    ...prevItem,
                    attributes: {
                      ...prevItem.attributes,
                      name: e.target.value,
                    },
                  }))
                }
              />
            </Form.Group>

            <Form.Group controlId="formLecturer">
              <Form.Label>Lecturer *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Lecturer's Name"
                value={editedItem?.attributes?.Lecturer || ""}
                onChange={(e) =>
                  setEditedItem((prevItem) => ({
                    ...prevItem,
                    attributes: {
                      ...prevItem.attributes,
                      Lecturer: e.target.value,
                    },
                  }))
                }
              />
            </Form.Group>

            <Form.Group controlId="formCourseCode">
              <Form.Label>Course Code *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Course Code"
                value={editedItem?.attributes?.CourseCode || ""}
                onChange={(e) =>
                  setEditedItem((prevItem) => ({
                    ...prevItem,
                    attributes: {
                      ...prevItem.attributes,
                      CourseCode: e.target.value,
                    },
                  }))
                }
              />
            </Form.Group>

            <Form.Group controlId="formTypescore">
              <Form.Label>Type Score *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Type Score"
                value={editedItem?.attributes?.type_score || ""}
                onChange={(e) =>
                  setEditedItem((prevItem) => ({
                    ...prevItem,
                    attributes: {
                      ...prevItem.attributes,
                      type_score: e.target.value,
                    },
                  }))
                }
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter Description"
                value={
                  (editedItem?.attributes?.description &&
                    editedItem.attributes.description[0]?.children[0]?.text) ||
                  ""
                }
                onChange={(e) =>
                  setEditedItem((prevItem) => ({
                    ...prevItem,
                    attributes: {
                      ...prevItem.attributes,
                      description: [
                        {
                          type: "paragraph",
                          children: [
                            {
                              type: "text",
                              text: e.target.value,
                            },
                          ],
                        },
                      ],
                    },
                  }))
                }
              />
            </Form.Group>
            <Form.Group controlId="formFullScore" style={{ marginTop: "8px" }}>
              <Form.Label>Full Score *</Form.Label>
              <Form.Control
                type="int"
                placeholder="Enter Full Score"
                value={editedItem?.attributes?.full_score || ""}
                onChange={(e) =>
                  setEditedItem((prevItem) => ({
                    ...prevItem,
                    attributes: {
                      ...prevItem.attributes,
                      full_score: e.target.value,
                    },
                  }))
                }
              />
            </Form.Group>

            <Form.Group controlId="formScoreCriteria" style={{ marginTop: "8px" }}>
              <Form.Label>Score Criteria *</Form.Label>
              <Form.Control
                type="int"
                placeholder="Enter Score Criteria"
                value={editedItem?.attributes?.score_criteria || ""}
                onChange={(e) =>
                  setEditedItem((prevItem) => ({
                    ...prevItem,
                    attributes: {
                      ...prevItem.attributes,
                      score_criteria: e.target.value,
                    },
                  }))
                }
              />
            </Form.Group>
            

            <Form.Group controlId="formPublishAt" style={{ marginTop: "8px" }}>
              <Form.Label>Publish Date *</Form.Label>
              <Form.Control
                type="datetime-local"
                value={editedItem?.attributes?.publish_at || ""}
                onChange={(e) =>
                  setEditedItem((prevItem) => ({
                    ...prevItem,
                    attributes: {
                      ...prevItem.attributes,
                      publish_at: e.target.value,
                    },
                  }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
