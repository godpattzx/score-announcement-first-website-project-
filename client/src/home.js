import React, { useState, useEffect } from "react";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import "./home.css";

function MainComponent() {
  const [show, setShow] = useState(false);
  const [dataFromApi1, setDataFromApi1] = useState([]);
  const [dataFromApi2, setDataFromApi2] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userScores, setUserScores] = useState([]);
  const [acknowledged, setAcknowledged] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api1Response = await axios.get(
          "http://localhost:1337/api/subjects"
        );

        setDataFromApi1(api1Response.data.data);

        const username = localStorage.getItem("username");
        const authToken = localStorage.getItem("authToken");

        const api2Response = await axios.get(
          `http://localhost:1337/api/subjects?populate=*&filters[views][student_id][$eq]=${username}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setDataFromApi2(api2Response.data.data);

        const userScoresResponse = await axios.get(
          `http://localhost:1337/api/views?filters[student_id][$eq]=${username}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUserScores(userScoresResponse.data.data);
      } catch (error) {
        console.error("API Error:", error);

        if (error.response && error.response.status === 401) {
          toast.warning("Please log in to view your scores.", {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          toast.error("Error fetching data. Please try again.", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      }
    };

    fetchData();
  }, []);

  const handleShow = (item) => {
    setAcknowledged(false);
    setSelectedItem(item);

    if (item.attributes.publishedAt) {
      const currentTime = new Date();
      const publishTime = new Date(item.attributes.publish_at);

      if (currentTime >= publishTime) {
        setShow(true);
        setButtonDisabled(false);
      } else {
        toast.warning("Score details will be available after the publish time.", {
          position: toast.POSITION.TOP_CENTER,
        });
        setButtonDisabled(true);
      }
    } else {
      toast.warning("Score details are not available yet.", {
        position: toast.POSITION.TOP_CENTER,
      });
      setButtonDisabled(true);
    }
  };

  const handleAcknowledge = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (selectedItem && !acknowledged) {
        const entityId = userScores.length > 0 ? userScores[0].id : null;

        if (entityId) {
          const acknowledgeResponse = await axios.get(
            `http://localhost:1337/api/views/${entityId}/ack`,
            null,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          toast.success("You have acknowledged your score successfully!", {
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
        }
      }
    } catch (error) {
      console.error("Acknowledge API Error:", error);

      toast.error("Error acknowledging your score. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      handleClose();
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const filteredDataFromApi2 = dataFromApi2.filter((item) =>
    item.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <Tabs defaultActiveKey="home" id="main-tabs" className="mb-3">
      <Tab eventKey="home" title="Home">
  <div className="row">
    <div className="search-input mb-3 ">
      <input
        type="text"
        placeholder=" Subject Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    {dataFromApi1.length > 0 ? (
      <div className="table-responsive mb-4">
        <table className="table table-striped table-hover table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Course Code</th>
              <th>Subject</th>
              <th>Description</th>
              <th>Lecturer</th>
              <th>Publication Time</th>
            </tr>
          </thead>
          <tbody>
            {dataFromApi1.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.attributes.CourseCode}</td>
                <td>{item.attributes.name}</td>
                <td>
                  {item.attributes.description[0]?.children[0]?.text || ""}
                </td>
                <td>{item.attributes.Lecturer}</td>
                <td>
                  {format(
                    new Date(item.attributes.publish_at),
                    "yyyy-MM-dd HH:mm:ss"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="no-scores-message">
        No scores available for you to view.
      </p>
    )}
  </div>
</Tab>

        <Tab eventKey="view" title="View">
          <div className="row">
            <div className="search-input mb-3 ">
              <input
                type="text"
                placeholder=" Subject Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {filteredDataFromApi2.length > 0 ? (
              <div className="table-responsive mb-4">
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
                    {filteredDataFromApi2.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.attributes.CourseCode}</td>
                        <td>{item.attributes.name}</td>
                        <td>
                          {item.attributes.description[0]?.children[0]?.text ||
                            ""}
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
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-scores-message">No scores available for you to view.</p>
            )}
          </div>
        </Tab>
      </Tabs>
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
                  {selectedItem.attributes.views.data
                    .filter(
                      (score) =>
                        score.attributes.student_id ===
                        localStorage.getItem("username")
                    )
                    .map((score) => (
                      <div key={score.id} className="score-item">
                        <p>
                          Score: {score.attributes.score}/
                          {selectedItem.attributes.full_score}
                        </p>
                        <p
                          className={`status ${
                            score.attributes.score >= 50 ? "pass" : "fail"
                          }`}
                        >
                          {score.attributes.score >= 50
                            ? "Status: Passed"
                            : "Status: Failed"}
                        </p>
                        <p className="acknowledged-text">
                          {score.attributes.ack
                            ? `Score Acknowledged at: ${format(
                                new Date(score.attributes.ack_datetime),
                                "yyyy-MM-dd HH:mm:ss"
                              )}`
                            : "Score not yet acknowledged"}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleAcknowledge}
              disabled={
                acknowledged ||
                (selectedItem &&
                  selectedItem.attributes.views.data[0]?.attributes.ack)
              }
            >
              {acknowledged ? "Score Acknowledged" : "Acknowledge"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default MainComponent;
