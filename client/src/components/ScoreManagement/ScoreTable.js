import React from "react";
import { Button, Table } from "react-bootstrap";

const ScoreTable = ({ studentScores, handleEdit, handleDelete, subjectName }) => {
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
            <td>{score.attributes?.student_id}</td>
            <td>
              {score.attributes?.score} /{" "}
              {score.attributes?.subject?.data?.attributes?.full_score ||
                "N/A"}
            </td>
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
            <td>{formatDatetime(score.attributes?.seen_datetime)}</td>
            <td>{formatDatetime(score.attributes?.ack_datetime)}</td>
            <td>
              {score.attributes?.ack
                ? "Acknowledged"
                : "Not Acknowledged"}
            </td>
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
