import React, {useEffect, useState} from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { message, Table } from "antd";
import { SetLoader } from "../../redux/loadersSlice";

function Credits() {

  const [creditsForm, setCreditsForm] = useState([]);

  const dispatch = useDispatch();
  
  const columns = [
    {
      title: "Sender's Name",
      dataIndex: "senderName",
      render: (_, record) => {
        return record.user ? record.user.fname : "";
      },
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
    },
    // {
    //   title: "Project Type",
    //   dataIndex: "projectType",
    // },
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
      render: (text, record) => {
        return record.status.toUpperCase();
      },
    },
    {
      title: "Added On",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const { status, _id } = record;
        return (
          <div className="flex gap-5">
            {status === "pending" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Approve
              </span>
            )}
            {status === "pending" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "rejected")}
              >
                Reject
              </span>
            )}
            {status === "approved" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "blocked")}
              >
                Block
              </span>
            )}
            {status === "blocked" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Unblock
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const getData = async () => {
    console.log("get data fun called");
    try {
      dispatch(SetLoader(true));
      const response = await fetch(`/get-credit-forms`);
      console.log(response);
      dispatch(SetLoader(false));
      if (response.ok) {
        const data = await response.json();
        console.log("my data is:", data);
        setCreditsForm(data?.forms);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
  
  

  useEffect(()=>{
    getData()
  },[])
  
  const onStatusUpdate = async (id, status) => {
    try {
      dispatch(SetLoader(true));
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(`/update-credits-forms-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ status }),
      });
  
      dispatch(SetLoader(false));
  
      if (response.ok) {
        const data = await response.json();
        message.success(data.message);
        getData();
      } else {
        throw new Error("Error updating form status");
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
  
  return (
     <div>
         <Table columns={columns}  dataSource={creditsForm}/>
    </div>
  );
}

export default Credits;
