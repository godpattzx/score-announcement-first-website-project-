import React from "react";
import { Button } from "react-bootstrap";
import { format } from "date-fns";

// คอมโพเนนต์สำหรับแสดงตารางรายวิชา
const SubjectTable = ({ data, isViewTab, handleShow }) => (
  <div className="table-responsive mb-4">
    <table className="table table-striped table-hover table-bordered">
      {/* ส่วนหัวตาราง */}
      <thead className="thead-dark">
        <tr>
          <th>Course Code</th>
          <th>Subject</th>
          <th>Description</th>
          <th>Lecturer</th>
          {/* ส่วนของ Action หรือ Publish Date ขึ้นอยู่กับ Tab ที่เลือก */}
          {isViewTab ? (
            <th className="text-center">Action</th>
          ) : (
            <th className="text-center">Publish Date</th>
          )}
        </tr>
      </thead>
      {/* ส่วนของรายการรายวิชา */}
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {/* แสดงข้อมูลรายวิชาที่ต่างกันตามแต่ละคอลัมน์ */}
            <td>{item.attributes.CourseCode}</td>
            <td>{item.attributes.name}</td>
            <td>
              {item.attributes?.description[0]?.children[0]
                ? item.attributes.description[0].children[0].text
                : ""}
            </td>
            <td>{item.attributes.Lecturer}</td>
            {/* ส่วนของ Action หรือ Publish Date ขึ้นอยู่กับ Tab ที่เลือก */}
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
