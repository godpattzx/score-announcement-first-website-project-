import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Button } from "react-bootstrap";
import NavigationBar from "../components/navbar";
import * as xlsx from "xlsx";
import "./ScoreManagement.css";
import ScoreTable from "../components/ScoreManagement/ScoreTable";
import UploadFile from "../components/ScoreManagement/UploadFile";
import DeleteConfirmationModal from "../components/ScoreManagement/DeleteConfirmationModal";
import EditModal from "../components/ScoreManagement/EditModal";
import CreateModal from "../components/ScoreManagement/CreateModal";
import ConfirmUploadModal from "../components/ScoreManagement/ConfirmUploadModal";

import { AuthContext, ContextProvider } from "../Auth/AuthContext";
import conf from "../conf/main";

function ScoreManagement() {
  const [showConfirmUploadModal, setShowConfirmUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [subjectId, setSubjectId] = useState(null);
  const { subjectName } = useParams();
  const [studentScores, setStudentScores] = useState([]);
  const [deleteScoreId, setDeleteScoreId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editScoreId, setEditScoreId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedScore, setEditedScore] = useState({
    student_id: "",
    score: 0,
    seen_datetime: "",
    ack_datetime: "",
    ack: false,
  });

  const [userList, setUserList] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newScore, setNewScore] = useState({
    student_id: "",
    score: 0,
    seen_datetime: "",
    ack_datetime: "",
    ack: false,
    typeScore: "",
    otherTypeScore: "",
  });

  const [scoreTypes, setScoreTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  const { state: ContextState } = useContext(AuthContext);
  const { user } = ContextState;
  const storedJwt = sessionStorage.getItem("auth.jwt");

  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${conf.apiUrlPrefix}/users?populate=role&filters[role][name][$eq]=Student`,
          {
            headers: {
              Authorization: `Bearer ${storedJwt}`,
            },
          }
        );

        const users = response.data || [];
        setUserList(
          users.map((user) => ({ id: user.id, name: user.username }))
        );
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchUsers();
  }, [storedJwt]);


  useEffect(() => {
    setSelectedType("");
  }, [scoreTypes]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${conf.apiUrlPrefix}${conf.viewsEndpoint}`,
          {
            headers: {
              Authorization: `Bearer ${storedJwt}`,
            },
          }
        );

        const data = response.data.data;
        const filteredScores = data.filter(
          (score) =>
            score.attributes?.subject?.data?.attributes?.name === subjectName &&
            (selectedType === "" ||
              score.attributes?.typeScore === selectedType)
        );

        console.log("Filtered Scores:", filteredScores);

        setStudentScores(filteredScores);

        if (filteredScores.length > 0) {
          setSubjectId(filteredScores[0]?.attributes?.subject?.data?.id);
        }

        console.log("Subject ID after setting:", subjectId);
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchData();
  }, [subjectName, storedJwt, selectedType, subjectId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${conf.apiUrlPrefix}${conf.viewsNotPopEndpoint}`,
          {
            headers: {
              Authorization: `Bearer ${storedJwt}`,
            },
          }
        );

        const typeScores = response.data.data.map(
          (score) => score.attributes.typeScore
        );
        const uniqueTypeScores = [...new Set(typeScores)];
        setScoreTypes(uniqueTypeScores);
        console.log(uniqueTypeScores);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user, subjectName, storedJwt]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (selectedFile) {
      setIsFileSelected(true);
      setShowConfirmUploadModal(true);
    } else {
      console.error("No file selected");
    }
  };

  const readUploadFile = async (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);

        try {
          for (const item of json) {
            const userResponse = await axios.get(
              `${conf.apiUrlPrefix}/users?filters[username][$eq]=${item["Student ID"]}`,
              {
                headers: {
                  Authorization: `Bearer ${storedJwt}`,
                },
              }
            );

            const userId = userResponse.data[0]?.id;
            if (!userId) {
              console.error(
                `User with username ${item["Student ID"]} not found.`
              );
              continue;
            }

            const response = await axios.post(
              `${conf.apiUrlPrefix}${conf.viewsEndpoint}`,
              {
                data: {
                  student_id: String(item["Student ID"]),
                  score: item["Score"],
                  typeScore: item["Type Score"],
                  subject: {
                    connect: [
                      {
                        id: subjectId,
                      },
                    ],
                  },
                  students: {
                    connect: [
                      {
                        id: userId,
                      },
                    ],
                  },
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${storedJwt}`,
                },
              }
            );
            console.log("Created Score Data:", response.data);
          }

          const scoresResponse = await axios.get(
            `${conf.apiUrlPrefix}${conf.viewsNotPopEndpoint}`,
            {
              headers: {
                Authorization: `Bearer ${storedJwt}`,
              },
            }
          );
          const filteredScores = scoresResponse.data.data.filter(
            (score) =>
              score.attributes?.subject?.data?.attributes?.name === subjectName
          );
          setStudentScores(filteredScores);
        } catch (error) {
          console.error("Create Error:", error);
        } finally {
          setIsFileSelected(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleConfirmUpload = () => {
    setShowConfirmUploadModal(false);
    readUploadFile(selectedFile);
  };

  const formatDatetime = (datetimeString) => {
    if (!datetimeString) {
      return "Not Available";
    }

    const date = new Date(datetimeString);
    return date.toLocaleString();
  };

  const handleEdit = (id) => {
    const scoreToEdit = studentScores.find((score) => score.id === id);
    setEditScoreId(id);
    setEditedScore(scoreToEdit.attributes);
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    setDeleteScoreId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${conf.apiUrlPrefix}${conf.viewsNotPopEndpoint}/${deleteScoreId}`,
        {
          headers: {
            Authorization: `Bearer ${storedJwt}`,
          },
        }
      );

      setStudentScores((prevScores) => {
        const newScores = prevScores.filter((score) => score.id !== deleteScoreId);
      
        if (newScores.length === 0) {
          setSelectedType("");
        }
      
        return newScores;
      });
      
      
    } catch (error) {
      console.error("Delete Error:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedScore((prevScore) => ({ ...prevScore, [name]: value }));
  };

  const saveEditedScore = async () => {
    try {
      await axios.put(
        `${conf.apiUrlPrefix}${conf.viewsNotPopEndpoint}/${editScoreId}`,
        {
          data: editedScore,
        },
        {
          headers: {
            Authorization: `Bearer ${storedJwt}`,
          },
        }
      );

      setStudentScores((prevScores) =>
        prevScores.map((score) =>
          score.id === editScoreId
            ? { ...score, attributes: editedScore }
            : score
        )
      );
    } catch (error) {
      console.error("Edit Error:", error);
    } finally {
      setShowEditModal(false);
    }
  };

  const handleCreateNewScore = () => {
    setShowCreateModal(true);
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setNewScore((prevScore) => ({ ...prevScore, [name]: value }));
  
  };

  const saveNewScore = async () => {
    try {
      const selectedUser = newScore.student_id.split(",")[1];
      const selectedUserId = newScore.student_id.split(",")[0];
      console.log(newScore.student_id);
      console.log(selectedUserId);
      console.log(newScore);
     
      if (newScore.typeScore === "Other") {
        newScore.typeScore = newScore.otherTypeScore;
      }
      const postCreateData = {
        data: {
          student_id: selectedUser,
          score: newScore.score,
          typeScore: newScore.typeScore,
          subject: {
            connect: [
              {
                id: subjectId,
              },
            ],
          },
          students: {
            connect: [
              {
                id: selectedUserId,
              },
            ],
          },
        },
      };

      const PostCreate = await axios.post(
        `${conf.apiUrlPrefix}${conf.viewsNotPopEndpoint}`,
        postCreateData,
        {
          headers: {
            Authorization: `Bearer ${storedJwt}`,
          },
        }
      );

      console.log("Created Score Data:", PostCreate.data);

      const response = await axios.get(
        `${conf.apiUrlPrefix}${conf.viewsEndpoint}`,
        {
          headers: {
            Authorization: `Bearer ${storedJwt}`,
          },
        }
      );

      const data = response.data.data;
      const filteredScores = data.filter(
        (score) =>
          score.attributes?.subject?.data?.attributes?.name === subjectName &&
          (selectedType === "" || score.attributes?.typeScore === selectedType)
      );

      console.log("Filtered Scores:", filteredScores);

      setStudentScores(filteredScores);

      setNewScore({
        student_id: "",
        score: 0,
        seen_datetime: "",
        ack_datetime: "",
        ack: false,
        typeScore: "",
        otherTypeScore: "",
      });

      setSelectedType(newScore.typeScore);

      setShowCreateModal(false);

    } catch (error) {
      console.error("Create Error:", error);
    }
  };

  const handleDownload = () => {
    const fileUrl = "./components/excelTest.xlsx";
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "excelTest.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <ContextProvider>
        <NavigationBar />
        <Container>
          <h3 className="mb-4">{`Score Management - ${subjectName}`}</h3>
          <Button
            variant="success"
            size="sm"
            className="mb-3"
            onClick={handleCreateNewScore}
          >
            Create New Score
          </Button>

          <Button
            variant="primary"
            size="sm"
            className="mb-3"
            style={{ marginLeft: "10px" }}
            onClick={handleDownload}
          >
            Download Form Excel
          </Button>
          <UploadFile
            handleFileChange={handleFileChange}
            handleUpload={handleUpload}
          />

          <div className="mb-3">
            <label className="form-label">Select Type Score: </label>
            <select
              className={`form-select ${
                selectedType === "" ? "is-invalid" : ""
              }`}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Please Select Type Score</option>
              {scoreTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {selectedType === "" && <div className="invalid-feedback"></div>}
          </div>

          <ScoreTable
            studentScores={studentScores}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            formatDatetime={formatDatetime}
          />
        </Container>

        <DeleteConfirmationModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          confirmDelete={confirmDelete}
        />

        <EditModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          handleEditInputChange={handleEditInputChange}
          saveEditedScore={saveEditedScore}
          editedScore={editedScore}
        />

        <CreateModal
          show={showCreateModal}
          handleClose={() => setShowCreateModal(false)}
          handleCreateInputChange={handleCreateInputChange}
          saveNewScore={saveNewScore}
          newScore={newScore}
          userList={userList}
          scoreTypes={scoreTypes}
        />
        <ConfirmUploadModal
          show={showConfirmUploadModal}
          handleClose={() => setShowConfirmUploadModal(false)}
          handleConfirmUpload={handleConfirmUpload}
        />
      </ContextProvider>
    </div>
  );
}

export default ScoreManagement;
