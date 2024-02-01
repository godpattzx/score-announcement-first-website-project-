// PrivateRoute.js
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import HomeS from "../web_page/homeS";
import conf from "../conf/main";

// คอมโพเนนต์ PrivateRoute ใช้สำหรับการสร้าง Route ที่ต้องการการตรวจสอบสิทธิ์การเข้าถึง
// โดยรับพารามิเตอร์ roles ซึ่งเป็นรายการของบทบาทที่มีสิทธิ์เข้าถึง Route นี้

const PrivateRoute = ({ roles }) => {
  const [state, setState] = useState({
    isLoggedIn: false,
    user: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('auth.jwt');
        const response = await axios.get(`${conf.apiUrlPrefix}${conf.jwtUserRoleEndpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        setState({
          isLoggedIn: true,
          user,
        });
      } catch (error) {
        setState({
          isLoggedIn: false,
          user: null,
        });
      }
    };

    fetchUserData();
  }, []);

  if (state.isLoggedIn && state.user && state.user.role) {
    const isAuthorized = roles.includes(state.user.role.name);

    // ถ้ามีสิทธิ์เข้าถึง Route นี้
    if (isAuthorized) {
      return <HomeS />;
    } else {
      // ถ้าไม่มีสิทธิ์เข้าถึง Route นี้ ให้นำทางไปยัง Route "/student"
      return <Navigate to="/student" replace={true} />;
    }
  }


};

export default PrivateRoute;
