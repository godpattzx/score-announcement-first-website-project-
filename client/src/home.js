import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./home.css";

function Home() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userScores, setUserScores] = useState([]);
  const [username, setUsername] = useState(null);
  const [userData, setUserData] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      axios
        .get("http://localhost:1337/api/users/me", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    setAcknowledged(false);
  };

  const handleShow = (item) => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      window.location.href = "/login";
      return;
    }

    setSelectedItem(item);
    setShow(true);

    const subjectName = item.attributes.name;
    let username;

    axios
      .get("http://localhost:1337/api/users/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        username = response.data.username;
        setUsername(username);

        axios
          .get(
            `http://localhost:1337/api/views?filters[subject][name][$eq]=${subjectName}&filters[student_id][$eq]=${username}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          )
          .then((res) => {
            console.log("User Scores API Response:", res.data);
            setUserScores(res.data.data);

            const acknowledgedScore = res.data.data.find(
              (score) => score.attributes.ack
            );

            if (acknowledgedScore) {
              setAcknowledged(true);
            }
          })
          .catch((err) => {
            console.error("User Scores API Error:", err);
          });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  const handleAcknowledge = () => {
    const authToken = localStorage.getItem("authToken");

    if (selectedItem && !acknowledged) {
      const entityId = userScores.length > 0 ? userScores[0].id : null;

      if (entityId) {
        axios
          .get(`http://localhost:1337/api/views/${entityId}/ack`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          })
          .then((acknowledgeResponse) => {
            console.log("Acknowledge API Response:", acknowledgeResponse.data);

            toast.success('"You have acknowledged your score successfully!"', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
              theme: "colored",
            });

            setAcknowledged(true);
          })
          .catch((acknowledgeError) => {
            console.error("Acknowledge API Error:", acknowledgeError);

            toast.error("Error acknowledging your score. Please try again.", {
              position: toast.POSITION.TOP_CENTER,
            });
          });
      }
    }

    handleClose();
  };

  const getData = () => {
    const authToken = localStorage.getItem("authToken");
  
    let username;
  
    axios
      .get("http://localhost:1337/api/users/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        username = response.data.username;
        setUsername(username);
  
        axios
          .get(`http://localhost:1337/api/subjects?populate=*&filters[views][student_id][$eq]=${username}`)
          .then((res) => {
            console.log("API Response Subjects:", res.data);
            setData(res.data.data);
          })
          .catch((err) => {
            console.log("API Error:", err);
          });
      })
      .catch((err) => {
        console.log("API Error:", err);
      });
  };
  
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Course Code</th>
                <th>Subject</th>
                <th>Description</th>
                <th>Lecturer</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.attributes.CourseCode}</td>
                    <td>{item.attributes.name}</td>
                    <td>
                      {item.attributes.description[0]?.children[0]?.text || ""}
                    </td>
                    <td>{item.attributes.Lecturer}</td>
                    <td className="table-column-button">
                      <Button
                        className="button-view-score"
                        onClick={() => handleShow(item)}
                      >
                        View Score
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="model_box">
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Score Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedItem && (
              <div className="modal-body-content">
                <div className="header">
                  <p>Course Code: {selectedItem.attributes.CourseCode}</p>
                  <p>Subject: {selectedItem.attributes.name}</p>
                </div>

                <div className="scores">
                  {userScores.map((score) => (
                    <div key={score.id} className="score-item">
                      <p
                        className="score-value"
                        style={{ background: "#FFFF00", fontSize: "25px" }}
                      >
                        {" "}
                        Score: {score.attributes.score}
                      </p>
                    </div>
                  ))}
                  <p>
                    Status:{" "}
                    {acknowledged
                      ? '" Score Acknowledged "'
                      : '" Not Acknowledged "'}
                  </p>

                  <div className="status-container">
                    <Button
                      variant="secondary"
                      className="acknowledge-button"
                      onClick={handleAcknowledge}
                      disabled={acknowledged}
                    >
                      {acknowledged ? "Score Acknowledged" : "Acknowledge"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default Home;
