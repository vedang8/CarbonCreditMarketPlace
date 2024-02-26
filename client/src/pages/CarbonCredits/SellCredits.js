import React, { useEffect, useState } from "react";
import SellCreditsForm from "./SellCreditsForm";
import { useDispatch, useSelector } from "react-redux";
import { message, Table } from "antd";
import { SetLoader } from "../../redux/loadersSlice";

function SellCredits() {
  const [selectedSellCredit, setSelectedSellCredit] = useState(null);
  const [showSellCreditsForm, setShowSellCreditsForm] = useState(false);
  const [sellCreditsForm, setSellCreditsForm] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const handleSellClick = () => {
    setSelectedSellCredit(null);
    setShowSellCreditsForm(true);
    setEditMode(false);
  };

  const handleEditClick = (record) => {
    console.log("Before setSelectedCredit:", selectedSellCredit);
    setSelectedSellCredit(record);
    console.log("After setSelectedCredit:", selectedSellCredit);
    setShowSellCreditsForm(true);
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
        const res = await fetch(`/delete-sell-credit-forms/${record._id}`, {
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
      title: "Selling Credits",
      dataIndex: "sellCredits",
    },
    {
      title: "Date Before to be sold",
      dataIndex: "sellBeforeDate",
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
      
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(
        "/get-sell-credit-forms",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      dispatch(SetLoader(false));

      if (response.ok) {
        const data = await response.json();
        setSellCreditsForm(data?.forms);
        console.log("edbhxuidhui",sellCreditsForm);
        message.success(data.message)
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="mb-2">
        <button className="btn" onClick={handleSellClick}>
          Sell
        </button>
      </div>
      <Table columns={columns} dataSource={sellCreditsForm} />
      {showSellCreditsForm && (
        <SellCreditsForm
          setShowSellCreditsForm={setShowSellCreditsForm}
          selectedSellCredit={selectedSellCredit}
          getData={getData}
          editMode={editMode}
          handleDeleteClick={handleDeleteClick}
        />
      )}
    </div>
  );
}

export default SellCredits;