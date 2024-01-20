import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Table, Container, Button, Modal, Form } from "react-bootstrap";
import NavigationBar from "./components/navbar";

function ScoreManagement() {
  const [subjectId, setSubjectId] = useState(null);
  const { subjectName } = useParams();
  const [studentScores, setStudentScores] = useState([]);
  const [deleteScoreId, setDeleteScoreId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editScoreId, setEditScoreId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedScore, setEditedScore] = useState({
    student_id: "",
    score: 0,
    seen_datetime: "",
    ack_datetime: "",
    ack: false,
  });

  const [userList, setUserList] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newScore, setNewScore] = useState({
    student_id: "",
    score: 0,
    seen_datetime: "",
    ack_datetime: "",
    ack: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:1337/api/users?populate=role&filters[role][name][$eq]=Student`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const users = response.data || [];
        setUserList(users.map((user) => ({ id: user.id, name: user.username })));
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchUsers();
  }, []);

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
        const filteredScores = response.data.data.filter(
          (score) =>
            score.attributes &&
            score.attributes.subject &&
            score.attributes.subject.data &&
            score.attributes.subject.data.attributes &&
            score.attributes.subject.data.attributes.name === subjectName
        );
        setStudentScores(filteredScores);
        setSubjectId(filteredScores.length > 0 ? filteredScores[0].attributes.subject.data.id : null);

      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchScores();
  }, [subjectName]);

  const formatDatetime = (datetimeString) => {
    if (!datetimeString) {
      return "Not Available";
    }

    const date = new Date(datetimeString);
    return date.toLocaleString();
  };

  const handleEdit = (id) => {
    const scoreToEdit = studentScores.find((score) => score.id === id);
    setEditScoreId(id);
    setEditedScore(scoreToEdit.attributes);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    setDeleteScoreId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:1337/api/views/${deleteScoreId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setStudentScores((prevScores) =>
        prevScores.filter((score) => score.id !== deleteScoreId)
      );
    } catch (error) {
      console.error("Delete Error:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedScore((prevScore) => ({ ...prevScore, [name]: value }));
  };

  const saveEditedScore = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.put(
        `http://localhost:1337/api/views/${editScoreId}`,
        {
          data: editedScore,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setStudentScores((prevScores) =>
        prevScores.map((score) =>
          score.id === editScoreId ? { ...score, attributes: editedScore } : score
        )
      );
    } catch (error) {
      console.error("Edit Error:", error);
    } finally {
      setShowEditModal(false);
    }
  };

  const handleCreateNewScore = () => {
    setShowCreateModal(true);
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setNewScore((prevScore) => ({ ...prevScore, [name]: value }));
  };

  const saveNewScore = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!subjectId || !newScore.student_id) {
        console.error("Subject ID or Student ID is not available");
        return;
      }

      const selectedUser = newScore.student_id.split(',')[1];
      const selectedUserId = newScore.student_id.split(',')[0];

   

      const PostCreate = await axios.post(
        "http://localhost:1337/api/views",
        {
          data: {
            student_id: selectedUser,
            score: newScore.score,
            subject: {
              connect: [
                {
                  id: subjectId,
                },
              ],
            },
            students: {
              connect: [
                {
                  id: selectedUserId ,
                },
              ],
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Created Score Data:", PostCreate.data);

      const response = await axios.get(
        `http://localhost:1337/api/views?populate=*`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const filteredScores = response.data.data.filter(
        (score) =>
          score.attributes &&
          score.attributes.subject &&
          score.attributes.subject.data &&
          score.attributes.subject.data.attributes &&
          score.attributes.subject.data.attributes.name === subjectName
      );

      setStudentScores(filteredScores);
    } catch (error) {
      console.error("Create Error:", error);
    } finally {
      setShowCreateModal(false);
      setNewScore({
        student_id: "",
        score: 0,
        seen_datetime: "",
        ack_datetime: "",
        ack: false,
      });
    }
  };

  return (
    <div>
      <NavigationBar />
      <Container>
        <h3 className="mb-4">{`Score Management - ${subjectName}`}</h3>
        <Button
          variant="success"
          size="sm"
          className="mb-3"
          onClick={handleCreateNewScore}
        >
          Create New Score
        </Button>
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
                  {formatDatetime(score.attributes && score.attributes.seen_datetime)}
                </td>
                <td>
                  {formatDatetime(score.attributes && score.attributes.ack_datetime)}
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this score?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
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
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEditedScore}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create New Score Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
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
            <Form.Group controlId="formScoreNew" style={{ marginTop: '10px' }} >
              <Form.Label>Score</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Score"
                name="score"
                value={newScore.score}
                onChange={handleCreateInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveNewScore}>
            Create Score
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ScoreManagement;
