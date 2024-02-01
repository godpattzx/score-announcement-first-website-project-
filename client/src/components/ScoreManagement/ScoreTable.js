import React from "react";
import { Button, Table } from "react-bootstrap";

// คอมโพเนนต์ ScoreTable ใช้สำหรับแสดงตารางคะแนนของนักเรียน
// โดยรับพารามิเตอร์ต่าง ๆ เช่น studentScores (รายการคะแนนนักเรียน), handleEdit (ฟังก์ชันแก้ไขคะแนน), handleDelete (ฟังก์ชันลบคะแนน), subjectName (ชื่อวิชา)

const ScoreTable = ({ studentScores, handleEdit, handleDelete, subjectName }) => {

  // ฟังก์ชัน formatDatetime ใช้สำหรับแปลงวันที่เป็นรูปแบบที่อ่านง่าย
  const formatDatetime = (datetimeString) => {
    if (!datetimeString) {
      return "Not Available";
    }

    const date = new Date(datetimeString);
    return date.toLocaleString();
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Student</th>
          <th>Score</th>
          <th>Status</th>
          <th>Seen Datetime</th>
          <th>Acknowledge Datetime</th>
          <th>Acknowledge Status</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {studentScores.map((score) => (
          <tr key={score.id}>
            {/* แสดงข้อมูลนักเรียน */}
            <td>{score.attributes?.student_id}</td>
            {/* แสดงคะแนน */}
            <td>
              {score.attributes?.score} /{" "}
              {score.attributes?.subject?.data?.attributes?.full_score ||
                "N/A"}
            </td>
            {/* แสดงสถานะคะแนน */}
            <td
              className={`status ${
                score.attributes?.score >=
                score.attributes?.subject?.data?.attributes?.score_criteria
                  ? "passed"
                  : "failed"
              }`}
            >
              {score.attributes?.score >=
              score.attributes?.subject?.data?.attributes?.score_criteria
                ? "Positive"
                : "Negative"}
            </td>
            {/* แสดงวันที่เห็นคะแนน */}
            <td>{formatDatetime(score.attributes?.seen_datetime)}</td>
            {/* แสดงวันที่ยอมรับคะแนน */}
            <td>{formatDatetime(score.attributes?.ack_datetime)}</td>
            {/* แสดงสถานะการยอมรับคะแนน */}
            <td>
              {score.attributes?.ack
                ? "Acknowledged"
                : "Not Acknowledged"}
            </td>
            {/* แสดงปุ่มแก้ไขและลบคะแนน */}
            <td className="text-center">
              <Button
                variant="info"
                size="sm"
                onClick={() => handleEdit(score.id)}
              >
                Edit
              </Button>{" "}
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(score.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ScoreTable;
