import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

// คอมโพเนนต์ EditModal ใช้สำหรับแสดง Modal สำหรับการแก้ไขคะแนน
// โดยรับพารามิเตอร์ต่าง ๆ เช่น show (แสดง Modal หรือไม่), handleClose (ฟังก์ชันปิด Modal), handleEditInputChange (ฟังก์ชันที่จัดการการเปลี่ยนแปลงข้อมูลใน Modal),
// saveEditedScore (ฟังก์ชันบันทึกคะแนนที่แก้ไข), editedScore (ข้อมูลคะแนนที่แก้ไข)

const EditModal = ({ show, handleClose, handleEditInputChange, saveEditedScore, editedScore }) => {

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Score</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* ป้อน Student ID ที่ต้องการแก้ไข */}
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
          {/* ป้อนคะแนนที่ต้องการแก้ไข */}
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
        {/* ปุ่มยกเลิกการแก้ไข */}
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        {/* ปุ่มบันทึกคะแนนที่แก้ไข */}
        <Button variant="primary" onClick={saveEditedScore}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
