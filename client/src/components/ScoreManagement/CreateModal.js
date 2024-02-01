import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

// คอมโพเนนต์ CreateModal ใช้สำหรับสร้าง Modal สำหรับการเพิ่มคะแนนใหม่
// โดยรับพารามิเตอร์ต่าง ๆ เช่น show (แสดง Modal หรือไม่), handleClose (ฟังก์ชันปิด Modal), handleCreateInputChange (ฟังก์ชันที่จัดการการเปลี่ยนแปลงข้อมูลใน Modal),
// saveNewScore (ฟังก์ชันบันทึกคะแนนใหม่), userList (รายชื่อนักเรียน), newScore (ข้อมูลคะแนนใหม่), scoreTypes (ประเภทคะแนน)

const CreateModal = ({ show, handleClose, handleCreateInputChange, saveNewScore, userList, newScore, scoreTypes }) => {

  // ฟังก์ชัน handleTypeScoreChange ใช้สำหรับจัดการเหตุการณ์เมื่อเปลี่ยนแปลงประเภทคะแนน
  const handleTypeScoreChange = (e) => {
    const selectedTypeScore = e.target.value;
    handleCreateInputChange(e);

    // ถ้าประเภทคะแนนที่เลือกไม่ใช่ "Other" ก็ล้างค่า otherTypeScore
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
          {/* เลือกนักเรียน */}
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
          {/* ป้อนคะแนน */}
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
          {/* เลือกประเภทคะแนน */}
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
          {/* ถ้าประเภทคะแนนเป็น "Other" ให้แสดงช่องให้กรอกประเภทคะแนนเพิ่มเติม */}
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
        {/* ปุ่มยกเลิก */}
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        {/* ปุ่มบันทึกคะแนนใหม่ */}
        <Button variant="primary" onClick={saveNewScore}>
          Create Score
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateModal;
