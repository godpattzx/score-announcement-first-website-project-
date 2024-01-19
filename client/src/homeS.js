import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import NavigationBar from "./components/navbar";
import { useNavigate } from 'react-router-dom';

function HomeS() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const renderItems = () => {
    const filteredItems = data.filter((item) =>
      item.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredItems.map((item) => (
      <Col key={item.id} md={6}>
        <Card style={{ marginBottom: "20px" }}>
          <Card.Body>
            <Card.Title>{item.attributes.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Lecturer: {item.attributes.Lecturer}</Card.Subtitle>
            <Card.Text>{item.attributes.description[0]?.children[0]?.text}</Card.Text>
            <Button variant="primary" onClick={() => handleScoreManagement(item.attributes.name)}>Score Management</Button>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleScoreManagement = (subjectName) => {
    navigate(`/score-management/${subjectName}`);
  };

  return (
    <div>
      <NavigationBar />
      <Container>
        <h3 className="mb-4">Staff-Management</h3>
        <Row>
          <Col>
          <input
              type="text"
              placeholder=" Subject Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control mb-3" 
              style={{ maxWidth: '300px' }} 
            />
          </Col>
        </Row>
        <Row>{renderItems()}</Row>
        <Row>
          <Col>
            <ul className="pagination">
              {pageNumbers.map((number) => (
                <li key={number} className="page-item">
                  <Button className="page-link" onClick={() => paginate(number)}>
                    {number}
                  </Button>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomeS;
