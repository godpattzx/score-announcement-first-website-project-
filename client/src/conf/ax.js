import axios from "axios";
import conf from './main';

// สร้างตัวแปร axData เพื่อเก็บข้อมูล jwt ที่จะใช้ในการกำหนด header ของ request
export const axData = {
  jwt: null
};

// สร้าง instance ของ axios ด้วยค่า baseURL และ withCredentials ที่กำหนด
const ax = axios.create({
  baseURL: conf.apiUrlPrefix,
  withCredentials: true,
});

// กำหนด interceptor ในการตรวจสอบและกำหนด header ของ request ก่อนที่จะถูกส่ง
ax.interceptors.request.use(function (config) {
  // ทำบางอย่างก่อนที่ request จะถูกส่ง
  // ตรวจสอบว่ามี jwt และ url ไม่ใช่ loginEndpoint ก่อนที่จะกำหนด header
  if(axData.jwt && config.url !== conf.loginEndpoint){
    config.headers['Authorization'] = `Bearer ${axData.jwt}`;
  }
  return config;
}, function (error) {
  // ทำบางอย่างเมื่อเกิด error ในการ request
  return Promise.reject(error);
});

export default ax;
