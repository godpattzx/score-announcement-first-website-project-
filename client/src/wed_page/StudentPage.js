import React from "react";
import NavigationBar from "../compoments/navbar"; // ปรับที่ตรงนี้ตามโครงสร้างโปรเจ็กต์ของคุณ
function StudentPage() {
  return (
    <div>
      <NavigationBar />
      <div className="container">
        Student Page
      </div>
    </div>
  );
}

export default StudentPage;
