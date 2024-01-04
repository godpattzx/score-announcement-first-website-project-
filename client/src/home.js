import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

function Home() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [AuthLocal, setAuthLocal] = useState(""); // สร้าง state เพื่อเก็บ token

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    // ตรวจสอบว่ามี token ใน localStorage หรือไม่
    const storedToken = localStorage.getItem("authToken");
    console.log("Stored Token:", storedToken); // Add this line for debugging
  
    if (storedToken) {
      setAuthLocal(storedToken);
    }
  
    axios.get("http://localhost:1337/api/subjects", {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
    .then(res => {
      console.log("API Response:", res.data); // Add this line for debugging
      setData(res.data);
    })
    .catch(err => {
      console.log("API Error:", err); // Add this line for debugging
    });
  }, [AuthLocal]);
  

  return (
    <div className="container ">
      <div className="row">
        <div className="col-sm-3 mt-5 mb-4 text-gred">
          <div className="search">
            <form className="form-inline">
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Search Student"
                aria-label="Search"
              />
            </form>
          </div>
        </div>
        <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{ color: "green" }}>
          <h2><b>Student Details</b></h2>
        </div>
        <div className="col-sm-3 offset-sm-1  mt-5 mb-4 text-gred">
          <Button variant="primary" onClick={handleShow}>
            Add New Student
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="table-responsive ">
          <table className="table table-striped table-hover table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Course Code </th>
                <th>Subject </th>
                <th>Description</th>
                <th>Lecturer </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* ... (your table rows) */}
            </tbody>
          </table>
        </div>
      </div>
      <div className="model_box">
        {/* ... (your modal code) */}
      </div>
    </div>
  );
}

export default Home;
