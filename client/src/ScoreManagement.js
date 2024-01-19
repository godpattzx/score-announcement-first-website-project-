import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table, Container, Button } from "react-bootstrap";
import NavigationBar from "./components/navbar";

function ScoreManagement() {
  const { subjectName } = useParams();
  const [studentScores, setStudentScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        const response = await axios.get(
          `http://localhost:1337/api/views?populate=*`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        console.log("API Response:", response.data);

        const filteredScores = response.data.data.filter(
          (score) =>
            score.attributes &&
            score.attributes.subject &&
            score.attributes.subject.data &&
            score.attributes.subject.data.attributes &&
            score.attributes.subject.data.attributes.name === subjectName
        );

        setStudentScores(filteredScores);
        console.log(filteredScores);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchScores();
  }, [subjectName]);

  const handleEdit = (id) => {
    console.log(`Edit score with ID ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete score with ID ${id}`);
  };

  return (
   <div> <NavigationBar />
    <Container>
       
      <h3 className="mb-4">{`Score Management - ${subjectName}`}</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Student</th>
            <th>Score</th>
            <th>Seen Datetime</th>
            <th>Acknowledge Datetime</th>
            <th>Acknowledge Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {studentScores.map((score) => (
            <tr key={score.id}>
              <td>{score.attributes && score.attributes.student_id}</td>
              <td>
                {score.attributes && score.attributes.score} /{" "}
                {(score.attributes &&
                  score.attributes.subject &&
                  score.attributes.subject.data &&
                  score.attributes.subject.data.attributes &&
                  score.attributes.subject.data.attributes.full_score) ||
                  "N/A"}
              </td>
              <td>
                {score.attributes && score.attributes.seen_datetime
                  ? score.attributes.seen_datetime
                  : "Not Seen"}
              </td>
              <td>
                {score.attributes && score.attributes.ack_datetime
                  ? score.attributes.ack_datetime
                  : "Not Acknowledged"}
              </td>
              <td>
                {score.attributes && score.attributes.ack
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
    </Container>
    </div> 
  );
}

export default ScoreManagement;
