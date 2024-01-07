import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import "./home.css";

function Home() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userScores, setUserScores] = useState([]); // State to store user scores

  const handleClose = () => setShow(false);

  const handleShow = (item) => {
    setSelectedItem(item);
    setShow(true);

    const subjectName = item.attributes.name;
    const username = "1student"; // Replace with the actual logged-in user's username
    const authToken = localStorage.getItem("authToken");

    axios
      .get(`http://localhost:1337/api/views?subject=${subjectName}&student_id=${username}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((res) => {
        console.log("User Scores API Response:", res.data);

        // Assuming the response contains an array of scores under the "data" key
        setUserScores(res.data.data);
      })
      .catch((err) => {
        console.error("User Scores API Error:", err);
      });
  };

  const getData = () => {
    axios
      .get("http://localhost:1337/api/subjects")
      .then((res) => {
        console.log("API Response:", res.data);
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
        {/* Modal code for displaying the selected item's score */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Score Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedItem && (
              <div>
                {/* Display score details for the selected item */}
                <p>Course Code: {selectedItem.attributes.CourseCode}</p>
                <p>Subject: {selectedItem.attributes.name}</p>
                {/* Display user scores */}
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
