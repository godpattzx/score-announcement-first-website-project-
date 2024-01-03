import NavigationBar from "../components/navbar";
import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentPage = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:1337/api/subjects");
        setScores(response.data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <NavigationBar />
      <h2>Student Page</h2>

      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.data ? (
            scores.data.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.attributes.name}</td>
                {/* Assuming there's only one paragraph and one text node for simplicity */}
                <td>
                  {subject.attributes.description[0].children[0].text}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentPage;
