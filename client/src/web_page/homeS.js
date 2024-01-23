import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Card, Modal } from "react-bootstrap";
import axios from "axios";
import NavigationBar from "../components/navbar";
import EditModal from "../components/HomeS/EditModal";
import DeleteConfirmationModal from "../components/HomeS/DeleteConfirmationModal";
import CreateModal from "../components/HomeS/CreateModal";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { format } from "date-fns";
import "react-toastify/dist/ReactToastify.css";
import "./homeS.css";

function HomeS() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [newSubjectData, setNewSubjectData] = useState({
    name: "",
    lecturer: "",
    courseCode: "",
    type_score: "",
    full_score: "",
    score_criteria: "",
    description: "",
    publish_at: "",
  });
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:1337/api/subjects", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setData(response.data.data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchData();
  }, [authToken]);

  const renderItems = () => {
    const filteredItems = data.filter(
      (item) =>
        item.attributes &&
        item.attributes.name &&
        item.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginationItems = Array.from({ length: totalPages }, (_, index) => (
      <Button
        key={index + 1}
        className={`page-link ${index + 1 === currentPage ? "active" : ""}`}
        onClick={() => setCurrentPage(index + 1)}
      >
        {index + 1}
      </Button>
    ));

    return (
      <>
        <Row>
          {currentItems.map((item) => (
            <Col key={item.id} md={6}>
              <Card style={{ marginBottom: "20px" }}>
                <Card.Body>
                  <Card.Title>{item.attributes?.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Lecturer: {item.attributes?.Lecturer}
                  </Card.Subtitle>
                  <Card.Text>
                    {item.attributes.description[0]?.children[0]?.text}
                  </Card.Text>
                  <Card.Text>
                    <strong>Course Code:</strong> {item.attributes?.CourseCode}
                  </Card.Text>
                  <Card.Text>
                    <strong>Type Score:</strong> {item.attributes?.type_score}
                  </Card.Text>
                  <Card.Text>
                    <strong>Publish Date:</strong>{" "}
                    {formatDate(item.attributes?.publish_at)}
                  </Card.Text>
                  <div className="button-group">
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleScoreManagement(item.attributes.name)
                      }
                    >
                      Score Management
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => handleEdit(item)}
                      style={{ marginLeft: "5px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(item.id)}
                      style={{ marginLeft: "5px" }}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row>
          <Col>
            <ul className="pagination">{paginationItems}</ul>
          </Col>
        </Row>
      </>
    );
  };

  const handleScoreManagement = (subjectName) => {
    navigate(`/score-management/${subjectName}`);
    toast.info(`Announcing scores for ${subjectName}`);
  };

  const handleEdit = (item) => {
    setEditedItem(item);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditedItem(null);
  };

  const handleSaveChanges = async () => {
    if (!editedItem) {
      console.error("No item to save changes for.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:1337/api/subjects/${editedItem.id}`,
        {
          data: {
            name: editedItem.attributes.name,
            Lecturer: editedItem.attributes.Lecturer,
            CourseCode: editedItem.attributes.CourseCode,
            type_score: editedItem.attributes.type_score,
            full_score: editedItem.attributes.full_score,
            score_criteria: editedItem.attributes.score_criteria,
            description: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    text: editedItem.attributes?.description[0]?.children[0]
                      ?.text,
                  },
                ],
              },
            ],
            publish_at: editedItem.attributes.publish_at,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const fetchData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:1337/api/subjects",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setData(response.data.data);
        } catch (error) {
          console.error("API Error:", error);
        }
      };

      fetchData();
    } catch (error) {
      console.error("Update Error:", error);
      console.error("Server response:", error.response);
    }

    handleEditModalClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd HH:mm");
  };

  const handleDelete = (itemId) => {
    const itemToDelete = data.find((item) => item.id === itemId);
    setEditedItem(itemToDelete);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      if (!editedItem) {
        throw new Error("Item to delete is not defined.");
      }

      const response = await axios.delete(
        `http://localhost:1337/api/subjects/${editedItem.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const fetchData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:1337/api/subjects",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setData(response.data.data);
        } catch (error) {
          console.error("API Error:", error);
        }
      };

      fetchData();
    } catch (error) {
      console.error("Delete Error:", error.message);
    }

    setShowDeleteConfirmation(false);
  };

  const handleCreateSubject = () => {
    setShowCreateModal(true);
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
    setNewSubjectData({
      name: "",
      lecturer: "",
      courseCode: "",
      type_score: "",
      full_score: "",
      score_criteria: "",
      description: "",
      publish_at: "",
    });
  };

  const handleCreateModalSave = async () => {
    try {
      if (
        !newSubjectData.name ||
        !newSubjectData.lecturer ||
        !newSubjectData.courseCode ||
        !newSubjectData.type_score ||
        !newSubjectData.full_score ||
        !newSubjectData.publish_at
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const userResponse = await axios.get(
        "http://localhost:1337/api/users/me",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const currentUserID = userResponse.data.id;

      const response = await axios.post(
        "http://localhost:1337/api/subjects",
        {
          data: {
            name: newSubjectData.name,
            Lecturer: newSubjectData.lecturer,
            CourseCode: newSubjectData.courseCode,
            type_score: newSubjectData.type_score,
            full_score: newSubjectData.full_score || 100,
            score_criteria: newSubjectData.score_criteria,
            description: [
              {
                type: "paragraph",
                children: [
                  {
                    type: "text",
                    text:
                      newSubjectData.description ||
                      "No description available",
                  },
                ],
              },
            ],
            publish_at: newSubjectData.publish_at || "2024-01-01",
            createBy: {
              connect: [{ id: currentUserID }],
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const fetchData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:1337/api/subjects",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setData(response.data.data);
        } catch (error) {
          console.error("API Error:", error);
        }
      };

      fetchData();

      setShowCreateModal(false);
      setNewSubjectData({
        name: "",
        lecturer: "",
        courseCode: "",
        type_score: "",
        full_score: "",
        score_criteria: "",
        description: "",
        publish_at: "",
      });
    } catch (error) {
      console.error("Create Error:", error.message);
    }
  };

  return (
    <div>
      <NavigationBar />
      <ToastContainer />
      <Container>
        <h3 className="mb-3">Staff-Management</h3>
        <Row>
          <Col>
            <Button
              variant="primary"
              onClick={handleCreateSubject}
              style={{ marginBottom: "20px" }}
            >
              Create Subject
            </Button>
            <input
              type="text"
              placeholder="Search Subject Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control mb-1"
              style={{ maxWidth: "300px" }}
            />
          </Col>
        </Row>

        <Row>
          {renderItems()}
        </Row>
      </Container>

      <EditModal
        show={showEditModal}
        handleClose={handleEditModalClose}
        handleSaveChanges={handleSaveChanges}
        editedItem={editedItem}
        setEditedItem={setEditedItem}
      />

      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        handleClose={() => setShowDeleteConfirmation(false)}
        handleDeleteConfirmation={handleDeleteConfirmation}
        editedItem={editedItem}
      />

      <CreateModal
        show={showCreateModal}
        handleClose={handleCreateModalClose}
        handleCreateModalSave={handleCreateModalSave}
        newSubjectData={newSubjectData}
        setNewSubjectData={setNewSubjectData}
      />
    </div>
  );
}

export default HomeS;
