
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";


function Home() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [AuthLocal, setAuthLocal] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
    getData(); // Simply call getData without checking for storedToken
  }, []); 

  return (
    <div className="container">
      <div className="row">
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Course Code</th>
                <th>Subject</th>
                <th>Description</th>
                <th>Lecturer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.attributes.CourseCode}</td>
                    <td>{item.attributes.name}</td>
                    <td>{item.attributes.description[0]?.children[0]?.text ||   ''}</td>
                    <td>{item.attributes.Lecturer}</td>
                    {/* Add more columns based on your data structure */}
                    <td>{/* Add your actions content here */}</td>
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
      <div className="model_box">{/* ... (your modal code) */}</div>
    </div>
  );
}

export default Home;
