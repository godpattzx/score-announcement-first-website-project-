import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

const CreateModal = ({ show, handleClose, handleCreateInputChange, saveNewScore, userList, newScore, scoreTypes }) => {
  const handleTypeScoreChange = (e) => {
    const selectedTypeScore = e.target.value;
    handleCreateInputChange(e);

    // Reset otherTypeScore when a different type is selected
    if (selectedTypeScore !== "Other") {
      handleCreateInputChange({
        target: {
          name: "otherTypeScore",
          value: "",
        },
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Score</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formStudentIdNew">
            <Form.Label>Student ID</Form.Label>
            <Form.Control
              as="select"
              name="student_id"
              value={newScore.student_id}
              onChange={handleCreateInputChange}
            >
              <option value="">Select Student</option>
              {userList.map((user) => (
                <option key={user.id} value={`${user.id},${user.name}`}>
                  {user.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formScoreNew" style={{ marginTop: "10px" }}>
            <Form.Label>Score</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Score"
              name="score"
              value={newScore.score}
              onChange={handleCreateInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formTypeScore" style={{ marginTop: "10px" }}>
            <Form.Label>Select Type Score</Form.Label>
            <Form.Control
              as="select"
              name="typeScore"
              value={newScore.typeScore}
              onChange={handleTypeScoreChange}
            >
              <option value="">Select Type Score</option>
              {scoreTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>
          {newScore.typeScore === "Other" && (
           <Form.Group controlId="formOtherTypeScore" style={{ marginTop: "10px" }}>
           <Form.Label>Other Type Score</Form.Label>
           <Form.Control
             type="text"
             placeholder="Enter Other Type Score"
             name="otherTypeScore"
             value={newScore.otherTypeScore}
             onChange={handleCreateInputChange}  
           />
         </Form.Group>
         
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={saveNewScore}>
          Create Score
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateModal;
