import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import "./home.css";
import NavigationBar from "./components/navbar";

function HomeS() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    setSelectedItem(item);
    setShow(true);
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
    <div>
      <NavigationBar />
      <div className="container">
        <Tabs
          defaultActiveKey="home"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="home" title="Home">
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
                            {
                              item.attributes.description[0]?.children[0]?.text ||
                              ""
                            }
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
          </Tab>
          <Tab eventKey="land" title="Land">
            {/* Add content for the "Land" tab here */}
          </Tab>
        </Tabs>
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
                  {/* Add more details as needed */}
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
    </div>
  );
}

export default HomeS;
