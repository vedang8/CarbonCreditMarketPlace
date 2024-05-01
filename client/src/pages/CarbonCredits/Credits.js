import React, { useEffect, useState } from "react";
import CreditsForm from "./CreditsForm";
import { useDispatch, useSelector } from "react-redux";
import { message, Table } from "antd";
import { SetLoader } from "../../redux/loadersSlice";

function Credits() {
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [showCreditsForm, setShowCreditsForm] = useState(false);
  const [creditsForm, setCreditsForm] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const handleGenerateClick = () => {
    setSelectedCredit(null);
    setShowCreditsForm(true);
    setEditMode(false);
  };

  const handleEditClick = (record) => {
    console.log("Before setSelectedCredit:", selectedCredit);
    setSelectedCredit(record);
    console.log("After setSelectedCredit:", selectedCredit);
    setShowCreditsForm(true);
    setEditMode(true);
    setDeleteMode(false);
  };

  const handleDeleteClick = async (record) => {
    console.log("Delete icon clicked");
    if (
      record &&
      record._id &&
      window.confirm("Are you sure you want to delete this form?")
    ) {
      try {
        dispatch(SetLoader(true));

        const token = localStorage.getItem("usersdatatoken");
        const res = await fetch(`/delete-credit-forms/${record._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        dispatch(SetLoader(false));
        console.log("Delete response:", res);
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          message.success(data.message);
          getData();
        } else {
          console.error("Error deleting form");
        }
      } catch (error) {
        dispatch(SetLoader(false));
        console.error("Errro", error);
        message.error(error.message);
      }
    }
  };
  const columns = [
    {
      title: "Project Name",
      dataIndex: "projectName",
      render: (text) => (
        <span
          style={{
            fontSize: "16px",
            color: "#652A0E",
            backgroundColor: "#FFF39A",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Project Type",
      dataIndex: "projectType",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (record) => {
        return (
          <span style={{ color: "blueviolet" }}>{new Date(record).toLocaleDateString()}</span>
        );
      }
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (record) => {
        return (
          <span style={{ color: "red" }}>{new Date(record).toLocaleDateString()}</span>
        );
      }
    },
    {
      title: "Baseline Emission Amt",
      dataIndex: "baselineEmissionAmount",
    },
    {
      title: "Project Emission Amt",
      dataIndex: "projectEmissionAmount",
    },
    {
      title: "Trees",
      dataIndex: "numOfTrees",
      render: (record) => {
        return (
          <span style={{ color: "darkgreen" }}>{record}</span>
        );
      }
    },
    {
      title: "Solar Panels",
      dataIndex: "numOfSolarPanels",
      render: (record) => {
        return (
          <span style={{ color: "darkgreen" }}>{record}</span>
        );
      }
    },
    {
      title: "Electricity Consumption",
      dataIndex: "electricity",
      render: (record) => {
        return (
          <span style={{ color: "darkgreen" }}>{record}</span>
        );
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => <span style={{ fontSize: '16px', backgroundColor: record.status === "pending" ? "orange" : record.status === "rejected" || record.status === "blocked" ? "#FF7F50" :"greenyellow" }}>{text}</span>
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-5">
            <i
              className="ri-delete-bin-line"
              onClick={() => {
                handleDeleteClick(record);
              }}
            ></i>
            <i
              className="ri-pencil-line"
              onClick={() => {
                handleEditClick(record);
              }}
            ></i>
          </div>
        );
      },
    },
  ];

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(`/get-credit-forms-user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
      dispatch(SetLoader(false));
      if (response.ok) {
        const resdata = await response.json();
        const { data } = resdata;
        setCreditsForm(data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  console.log(user);
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="mb-2">
        <button className="btn" onClick={handleGenerateClick}>
          Generate
        </button>
      </div>
      <Table columns={columns} dataSource={creditsForm} />
      {showCreditsForm && (
        <CreditsForm
          setShowCreditsForm={setShowCreditsForm}
          selectedCredit={selectedCredit}
          getData={getData}
          editMode={editMode}
          handleDeleteClick={handleDeleteClick}
        />
      )}
    </div>
  );
}

export default Credits;
