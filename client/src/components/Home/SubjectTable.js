import React from "react";
import { Button } from "react-bootstrap";
import { format } from "date-fns";

const SubjectTable = ({ data, isViewTab, handleShow, searchTerm, paginate, currentPage, itemsPerPage }) => (
  <div className="table-responsive mb-4">
    <table className="table table-striped table-hover table-bordered">
      <thead className="thead-dark">
        <tr>
          <th>Course Code</th>
          <th>Subject</th>
          <th>Description</th>
          <th>Type Score</th>
          <th>Lecturer</th>
          {isViewTab ? (
            <th className="text-center">Action</th>
          ) : (
            <th className="text-center">Publish Date</th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.attributes.CourseCode}</td>
            <td>{item.attributes.name}</td>
            <td>
              {item.attributes?.description[0]?.children[0]
                ? item.attributes.description[0].children[0].text
                : ""}
            </td>
            <td>{item.attributes.type_score}</td>
            <td>{item.attributes.Lecturer}</td>
            <td>
              {isViewTab ? (
                <Button
                  className="button-view-score text-center"
                  style={{ display: "block", margin: "auto" }}
                  onClick={() => handleShow(item)}
                >
                  <span>View Score</span>
                </Button>
              ) : (
                <span style={{ display: "block", textAlign: "center" }}>
                  {format(
                    new Date(item.attributes.publish_at),
                    "yyyy-MM-dd HH:mm:ss"
                  )}
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SubjectTable;
