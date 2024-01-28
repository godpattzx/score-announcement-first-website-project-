import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { format } from "date-fns";
import passImage from "../../image/pass.png";
import failImage from "../../image/fail.png";
import neutralImage from "../../image/neutral.png";
import { AuthContext } from "../../Auth/AuthContext";
import axios from "axios";

const ScoreDetailsModal = ({
  show,
  handleClose,
  selectedItem,
  handleAcknowledge,
  acknowledged,
  selectedScoreType,
  handleScoreTypeChange,
}) => {
  const { state: ContextState } = useContext(AuthContext);
  const { user } = ContextState;

  const [subjectViews, setSubjectViews] = useState([]);
  const [scoreTypes, setScoreTypes] = useState([]);

  useEffect(() => {
    const fetchSubjectViews = async () => {
      try {
        if (selectedItem) {
          const authToken = sessionStorage.getItem('auth.jwt');
          const headers = {
            Authorization: `Bearer ${authToken}`,
          };

          const response = await axios.get(
            `http://localhost:1337/api/views?populate=*&filters[student_id][$eq]=${user?.username}&filters[subject][name][$eq]=${selectedItem.attributes.name}`,
            { headers }
          );

          setSubjectViews(response.data.data);

          const types = generateScoreTypes(response.data.data);
          setScoreTypes(types);
        }
      } catch (error) {
        console.error("Error fetching subject views:", error);
      }
    };

    fetchSubjectViews();
  }, [selectedItem, user?.username]);

  const generateScoreTypes = (data) => {
    const types = Array.from(new Set(data.map((item) => item.attributes.typeScore)));
    return types;
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Score Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {selectedItem && (
          <div className="modal-body-content">
            <Form.Group controlId="scoreType">
              <Form.Label>Select Score Type:</Form.Label>
              <Form.Control
                as="select"
                value={selectedScoreType}
                onChange={handleScoreTypeChange}
                disabled={scoreTypes.length === 0} 
              >
                <option value="" disabled={!scoreTypes.length}>Select Score Type</option>
                {scoreTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {selectedScoreType && (
              <div className="header">
                <hr />
                <p>Course Code: {selectedItem.attributes.CourseCode}</p>
                <p>Subject: {selectedItem.attributes.name}</p>
              </div>
            )}

            <hr />

            <div className="scores">
              {subjectViews.length > 0 ? (
                subjectViews
                  .filter((score) => score.attributes.student_id === user?.username && score.attributes.typeScore === selectedScoreType)
                  .map((score) => (
                    <div key={score.id} className="score-item">
                      <p>
                        Score: {score.attributes.score}/{selectedItem.attributes.full_score}
                      </p>
                      <div
                        className={`status ${
                          score.attributes.score >= selectedItem.attributes.score_criteria + 10
                            ? "positive"
                            : score.attributes.score <= selectedItem.attributes.score_criteria - 10
                              ? "negative"
                              : "neutral"
                        }`}
                      >
                        {score.attributes.score >= selectedItem.attributes.score_criteria + 10 ? (
                          <>
                            <p>Status: Positive</p>
                            <img
                              src={passImage}
                              className="status-image"
                              alt="pass"
                            />
                          </>
                        ) : score.attributes.score <= selectedItem.attributes.score_criteria - 10 ? (
                          <>
                            <p>Status: Negative</p>
                            <img
                              src={failImage}
                              className="status-image"
                              alt="fail"
                            />
                          </>
                        ) : (
                          <>
                            <p>Status: Neutral</p>
                            <img
                              src={neutralImage}
                              className="status-image"
                              alt="neutral"
                            />
                          </>
                        )}
                      </div>
                      <hr />
                      <p className="acknowledged-text" style={{ marginTop: '13px' }}>
                        {score.attributes.ack
                          ? `Score Acknowledged at: ${format(
                            new Date(score.attributes.ack_datetime),
                            "yyyy-MM-dd HH:mm:ss"
                          )}`
                          : "Score not yet acknowledged"}
                      </p>
                      <hr />
                    </div>
                  ))
              ) : (
                <p>No scores available for this subject and selected score type.</p>
              )}
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>

        {subjectViews.length > 0 && (
          <Button
            variant="outline-secondary"
            onClick={() => handleAcknowledge(selectedScoreType)}
            disabled={
              acknowledged ||
              (subjectViews
                .filter((view) => view.attributes.student_id === user?.username && view.attributes.typeScore === selectedScoreType)
                .some((view) => view.attributes.ack === true))
            }
          >
            {acknowledged ||
              (subjectViews
                .filter((view) => view.attributes.student_id === user?.username && view.attributes.typeScore === selectedScoreType)
                .some((view) => view.attributes.ack === true)
                ? "Score Acknowledged"
                : "Acknowledge")}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ScoreDetailsModal;
