import React, { useState, useEffect } from "react";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./home.css";

import SubjectTable from "../components/Home/SubjectTable";
import ScoreDetailsModal from "../components/Home/ScoreDetailsModal";

function MainComponent() {
  const [show, setShow] = useState(false);
  const [dataFromApi1, setDataFromApi1] = useState([]);
  const [dataFromApi2, setDataFromApi2] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userScores, setUserScores] = useState([]);
  const [acknowledged, setAcknowledged] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api1Response = await axios.get(
          "http://localhost:1337/api/subjects"
        );

        setDataFromApi1(api1Response.data.data);

        const username = localStorage.getItem("username");
        const authToken = localStorage.getItem("authToken");

        const api2Response = await axios.get(
          `http://localhost:1337/api/subjects?populate=*&filters[views][student_id][$eq]=${username}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setDataFromApi2(api2Response.data.data);

        const userScoresResponse = await axios.get(
          `http://localhost:1337/api/views?filters[student_id][$eq]=${username}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUserScores(userScoresResponse.data.data);
      } catch (error) {
        console.error("API Error:", error);

        if (error.response && error.response.status === 401) {
          toast.warning("Please log in to view your scores.", {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          toast.error("Error fetching data. Please try again.", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      }
    };

    fetchData();
  }, []);

  const handleAcknowledge = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const username = localStorage.getItem("username");

      console.log("Received Item:", selectedItem);
      const itemAttributes = selectedItem.attributes;
      console.log("Item Attributes:", itemAttributes);

      if (
        itemAttributes &&
        itemAttributes.views &&
        Array.isArray(itemAttributes.views.data) &&
        itemAttributes.views.data.length > 0
      ) {
        // Find the view that matches the logged-in user's username
        const userView = itemAttributes.views.data.find(
          (view) => view.attributes.student_id === username
        );

        if (userView) {
          if (!userView.attributes.ack) {
            const acknowledgeResponse = await axios.get(
              `http://localhost:1337/api/views/${userView.id}/ack`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );

            console.log("Acknowledge API Response:", acknowledgeResponse.data);
            toast.success("You have acknowledged your score successfully!");
            setAcknowledged(true);
          } else {
            toast.warning("Score is already acknowledged.", {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        } else {
          toast.warning("Score details not found for the logged-in user.", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } else {
        toast.warning(
          "Score details are not available or are in an unexpected format.",
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
      }
    } catch (error) {
      console.error("Acknowledge API Error:", error);

      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Unknown error";

      toast.error(`Error acknowledging your score: ${errorMessage}`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      handleClose();
    }
  };

  const handleShow = async (item) => {
    setAcknowledged(false);
    setSelectedItem(item);
    console.log("Selected Item:", selectedItem);

    if (item.attributes.publishedAt) {
      const currentTime = new Date();
      const publishTime = new Date(item.attributes.publish_at);

      if (currentTime >= publishTime) {
        setShow(true);
        setButtonDisabled(false);

        try {
          const authToken = localStorage.getItem("authToken");

          const response = await axios.get(
            `http://localhost:1337/api/subjects/${item.id}?populate=views`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          const subjectWithViews = response.data.data;

          // กรองข้อมูล views ที่เป็นของ student ที่ login
          const filteredViewsData =
            subjectWithViews.attributes.views.data.filter(
              (view) =>
                view.attributes.student_id === localStorage.getItem("username")
            );

          if (filteredViewsData.length > 0) {
            const seenResponse = await axios.get(
              `http://localhost:1337/api/views/${filteredViewsData[0].id}/seen`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
            console.log("Score marked as seen:", seenResponse.data);
            console.log("Data from API:", filteredViewsData[0]?.attributes);
          }
        } catch (error) {
          console.error("Seen API Error:", error);
          toast.error("Error marking score as seen. Please try again.", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } else {
        toast.warning(
          "Score details will be available after the publish time.",
          {
            position: toast.POSITION.TOP_CENTER,
          }
        );
        setButtonDisabled(true);
      }
    } else {
      toast.warning("Score details are not available yet.", {
        position: toast.POSITION.TOP_CENTER,
      });
      setButtonDisabled(true);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderTable = (data, isViewTab = false) => (
    <SubjectTable
      data={data}
      isViewTab={isViewTab}
      handleShow={handleShow}
      searchTerm={searchTerm}
    />
  );

  const filteredData = searchTerm
    ? dataFromApi1.filter((item) =>
        item.attributes.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : dataFromApi1;

  const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container">
      <Tabs defaultActiveKey="home" id="main-tabs" className="mb-3">
        <Tab eventKey="home" title="Home">
          <div className="row">
            <div className="search-input mb-3 ">
              <input
                type="text"
                placeholder=" Search Subject Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {filteredData.length > 0 ? (
              <>
                {renderTable(paginatedData)}
                {filteredData.length > itemsPerPage && (
                  <div className="pagination">
                    {Array.from(
                      { length: Math.ceil(filteredData.length / itemsPerPage) },
                      (_, index) => (
                        <Button
                          key={index + 1}
                          className={`page-link ${
                            index + 1 === currentPage ? "active" : ""
                          }`}
                          onClick={() => paginate(index + 1)}
                        >
                          {index + 1}
                        </Button>
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="no-scores-message">
                There are no scores for you. Please contact the course
                instructor.
              </p>
            )}
          </div>
        </Tab>

        <Tab eventKey="view" title="View">
          <div className="row">
            <div className="search-input mb-3 ">
              <input
                type="text"
                placeholder=" Search Subject Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {dataFromApi2.length > 0 ? (
              <>{renderTable(dataFromApi2, true)},</>
            ) : (
              <p className="no-scores-message">
                There are no scores for you. Please contact the course
                instructor.
              </p>
            )}
          </div>
        </Tab>
      </Tabs>
      <div className="model_box">
        <ScoreDetailsModal
          show={show}
          handleClose={handleClose}
          selectedItem={selectedItem}
          handleAcknowledge={handleAcknowledge}
          acknowledged={acknowledged}
          isButtonDisabled={isButtonDisabled}
        />
      </div>
    </div>
  );
}

export { MainComponent };
