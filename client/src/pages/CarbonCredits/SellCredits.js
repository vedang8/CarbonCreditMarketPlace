import React, { useEffect, useState } from "react";
import SellCreditsForm from "./SellCreditsForm";
import { useDispatch, useSelector } from "react-redux";
import { message, Table } from "antd";
import { SetLoader } from "../../redux/loadersSlice";
import CountdownTimer from "../../components/CountdownTimer";
import Bids from "./Bids";
import SellCreditsInfo from "../SellCreditsInfo";

function SellCredits() {
  const [showBids, setShowBids] = useState(false);
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
      render: (text) => <span style={{ fontSize: '16px' }}>{text}</span>
    },
    {
      title: "Date Before to be sold",
      dataIndex: "sellBeforeDate",
      render: (sellBeforeDate, record) => <CountdownTimer targetDate={sellBeforeDate} status={record.status} />
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => <span style={{ fontSize: '16px', backgroundColor: record.status === "rejected" ? "#FF7F50" :"greenyellow" }}>{text}</span>
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-5 items-center">
            <i
              className="ri-delete-bin-line cursor-pointer"
              onClick={() => {
                handleDeleteClick(record);
              }}
            ></i>
            <i
              className="ri-pencil-line cursor-pointer"
              onClick={() => {
                handleEditClick(record);
              }}
            ></i>
            <span className="underline cursor-pointer"
              onClick={() => {
                setSelectedSellCredit(record);
                setShowBids(true);
              }}
            >
              Show Bids
            </span>
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
        const resdata = await response.json();
        const { data } = resdata;
        setSellCreditsForm(data);
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

      {showBids && (
        <Bids
          showBidsModal={showBids}
          setShowBidsModal={setShowBids}
          selectedSellCredit={selectedSellCredit}
        />
      )}  
    </div>
  );
}

export default SellCredits;