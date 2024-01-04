// StaffPage.js
import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/navbar';
import axios from 'axios';

const StaffPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/subjects');
        setSubjects(response.data.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <NavigationBar />
   
      <h2>Staff Page</h2>
      <select onChange={(e) => setSelectedSubject(e.target.value)}>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.attributes.name}>
            {subject.attributes.name}
          </option>
        ))}
      </select>

      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {subjects
            .filter((subject) => subject.attributes.name === selectedSubject)
            .map((selectedSubject) => (
              <tr key={selectedSubject.id}>
                <td>{selectedSubject.attributes.score}</td>
                <td>
                  {selectedSubject.attributes.seen_datetime}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffPage;
