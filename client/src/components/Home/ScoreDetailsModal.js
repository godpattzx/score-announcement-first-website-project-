import React from "react";
import { Button, Modal } from "react-bootstrap";
import { format } from "date-fns";
import passImage from "../../image/pass.png";
import failImage from "../../image/fail.png";
import neutralImage from "../../image/neutral.png";

const ScoreDetailsModal = ({
  show,
  handleClose,
  selectedItem,
  handleAcknowledge,
  acknowledged,
  isButtonDisabled,
}) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Score Details</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      {selectedItem && (
        <div className="modal-body-content">
          <div className="header">
            <p style={{ color: "darkblue" , fontWeight:'700'}}>
              {selectedItem.attributes.type_score} score.
            </p>
            <hr/>
            <p>Course Code: {selectedItem.attributes.CourseCode}</p>
            <p>Subject: {selectedItem.attributes.name}</p>
          </div>
        <hr/>
          <div className="scores">
            {selectedItem.attributes.views.data.length > 0 ? (
              selectedItem?.attributes?.views.data
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
                          <img src={passImage} className="status-image" alt="pass" />
                        </>
                      ) : score.attributes.score <= selectedItem.attributes.score_criteria - 10 ? (
                        <>
                          <p>Status: Negative</p>
                          <img src={failImage} className="status-image" alt="fail" />
                        </>
                      ) : (
                        <>
                          <p>Status: Neutral</p>
                          <img src={neutralImage} className="status-image" alt="neutral" />
                        </>
                      )}
                    </div>
                    <hr/>
                    <p className="acknowledged-text" style={{ marginTop: '13px' }}>
                      {score.attributes.ack
                        ? `Score Acknowledged at: ${format(
                            new Date(score.attributes.ack_datetime),
                            "yyyy-MM-dd HH:mm:ss"
                          )}`
                        : "Score not yet acknowledged"}
                    </p>
                    <hr/>
                  </div>
                ))
            ) : (
              <p>No scores available for this subject.</p>
            )}
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
        onClick={() => handleAcknowledge()}
        disabled={
          acknowledged ||
          (selectedItem?.attributes?.views?.data
              .filter(
                (view) =>
                  view.attributes.student_id ===
                  localStorage.getItem("username")
              )
              .some((view) => view.attributes.ack === true))
        }
      >
        {acknowledged ||
          (selectedItem?.attributes?.views?.data
            .filter(
              (view) =>
                view.attributes.student_id ===
                localStorage.getItem("username")
            )
            .some((view) => view.attributes.ack === true)
            ? "Score Acknowledged"
            : "Acknowledge")}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ScoreDetailsModal;
