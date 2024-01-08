import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import "./home.css";

function Home() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userScores, setUserScores] = useState([]);
  const [username, setUsername] = useState(null);

  const handleClose = () => setShow(false);

  const handleShow = (item) => {
    setSelectedItem(item);
    setShow(true);
  
    const subjectName = item.attributes.name;
    let username; // Declare the variable here
  
    const authToken = localStorage.getItem("authToken");
  
    axios
      .get("http://localhost:1337/api/users/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        username = response.data.username; // Assign the value here
        setUsername(username); // Set the state
        console.log(response.data.username);
  
        // Now, make the second Axios request inside this block
        axios
          .get(`http://localhost:1337/api/views?filters[subject][name][$eq]=${subjectName}&filters[student_id][$eq]=${username}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          })
          .then((res) => {
            console.log("User Scores API Response:", res.data);
            setUserScores(res.data.data);
  
            // Extract the ID from the first item in the response
            const entityId = res.data.data.length > 0 ? res.data.data[0].id : null;
  
            // Make the API call to update seen_datetime
            if (entityId) {
              axios.get(`http://localhost:1337/api/views/${entityId}/seen`, {}, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              })
                .then((seenResponse) => {
                  console.log("Seen API Response:", seenResponse.data);
                })
                .catch((seenError) => {
                  console.error("Seen API Error:", seenError);
                });
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

  const getData = () => {
    axios
      .get("http://localhost:1337/api/subjects")
      .then((res) => {
        console.log("API Response Subjects:", res.data);
        setData(res.data.data);
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
              <div>
                <p>Course Code: {selectedItem.attributes.CourseCode}</p>
                <p>Subject: {selectedItem.attributes.name}</p>
                {userScores.map((score) => (
                  <div key={score.id}>
                    <p>Score: {score.attributes.score}</p>
                  </div>
                ))}
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
