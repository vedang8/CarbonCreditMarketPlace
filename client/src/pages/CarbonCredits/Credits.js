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
    },
    {
      title: "Project Type",
      dataIndex: "projectType",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
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
    },
    {
      title: "Solar Panels",
      dataIndex: "numOfSolarPanels",
    },
    {
      title: "Electricity Consumption",
      dataIndex: "electricity",
    },
    {
      title: "Status",
      dataIndex: "status",
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
      
      const response = await fetch(
        `/get-credit-forms`
      );
      dispatch(SetLoader(false));
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCreditsForm(data.forms);
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
