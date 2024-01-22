import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";
import NavigationBar from "./components/navbar";
import { useNavigate } from "react-router-dom";
import "./homeS.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from 'date-fns';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  const [errorMessage, setErrorMessage] = useState("");

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

    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <Button
          key={i}
          className={`page-link ${i === currentPage ? "active" : ""}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }

    return (
      <>
        <Row>
          {currentItems.map((item) => (
            <Col key={item.id} md={6}>
              <Card style={{ marginBottom: "20px" }}>
                <Card.Body>
                  <Card.Title>
                    {item.attributes?.name}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Lecturer: {item.attributes?.Lecturer}
                  </Card.Subtitle>
                  <Card.Text>
                    {item.attributes.description[0]?.children[0]?.text}
                  </Card.Text>
                  <Card.Text>
                    <strong>Course Code:</strong>{" "}
                    {item.attributes?.CourseCode}
                  </Card.Text>
                  <Card.Text>
                    <strong>Type Score:</strong>{" "}
                    {item.attributes?.type_score}
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
      console.log(editedItem.attributes.publish_at);

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
    return format(date, 'yyyy-MM-dd HH:mm');
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

      console.log("Delete successful:", response.data);

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
      full_score: 100,
      score_criteria: 50,
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

      // ดึงข้อมูลผู้ใช้ที่ลงทะเบียนเข้าระบบอยู่
      const userResponse = await axios.get(
        "http://localhost:1337/api/users/me",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const currentUserID = userResponse.data.id;
      /* โค้ดสำหรับดึงข้อมูลผู้ใช้ที่ลงทะเบียนเข้าระบบอยู่ */

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
                      newSubjectData.description || "No description available",
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

      console.log("Create successful:", response.data);

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
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <Row>{renderItems()}</Row>
      </Container>

      <Modal show={showEditModal} onHide={handleEditModalClose}>
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
          <Button variant="secondary" onClick={handleEditModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the subject?</p>
          <p>
            <strong>Subject Name:</strong> {editedItem?.attributes?.name}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmation}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCreateModal} onHide={handleCreateModalClose}>
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

            <Form.Group controlId="formTypeScore">
              <Form.Label>Type Score *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Type Score"
                value={newSubjectData.type_score}
                onChange={(e) =>
                  setNewSubjectData({
                    ...newSubjectData,
                    type_score: e.target.value,
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
          <Button variant="secondary" onClick={handleCreateModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateModalSave}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HomeS;
