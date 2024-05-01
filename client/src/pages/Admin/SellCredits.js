import React, {useEffect, useState} from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { message, Table } from "antd";
import { SetLoader } from "../../redux/loadersSlice";

function SellCredits() {
    const [sellCreditsForm, setSellCreditsForm] = useState([]);
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
        title: "Carbon Credits",
        dataIndex: "sellCredits",
        style: { color: "#0047ab" },
      },
      {
        title: "Bidding Deadline",
        dataIndex: "sellBeforeDate",
        render: (text, record) =>
          moment(record.sellBeforeDate).format("DD-MM-YYYY hh:mm A"),
          style: { color: "#333333" },
      },
      {
        title: "Selling Status",
        dataIndex: "selling_status",
        render: (text, record) => (
          <span style={{ color: record.selling_status === 'Sold' ? '#FF0000' : (record.selling_status === 'Pending' ? '#FFA500' : '#000000') }}>
            {record.selling_status.toUpperCase()}
          </span>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (text, record) => (
          <span style={{ color: record.status === 'Approved' ? '#008000' : (record.status === 'pending' ? '#FFA500' : '#FF0000') }}>
            {record.status.toUpperCase()}
          </span>
        ),
      },
      {
        title: "Added On",
        dataIndex: "createdAt",
        render: (text, record) => (
          <span style={{ color: '#888' }}>
            {moment(record.createdAt).format("DD-MM-YYYY hh:mm A")}
          </span>
        ),
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
                  style={{ color: "#008000" }} 
                  className="underline cursor-pointer"
                  onClick={() => onStatusUpdate(_id, "Approved")}
                >
                  Approve
                </span>
              )}
              {status === "pending" && (
                <span
                  style={{ color: "#FF0000" }} 
                  className="underline cursor-pointer"
                  onClick={() => onStatusUpdate(_id, "Rejected")}
                >
                  Reject
                </span>
              )}
              {status === "Approved" && (
                <span
                  style={{ color: "#FF0000" }} 
                  className="underline cursor-pointer"
                  onClick={() => onStatusUpdate(_id, "Blocked")}
                >
                  Block
                </span>
              )}
              {status === "Blocked" && (
                <span
                  style={{ color: "#008000" }} 
                  className="underline cursor-pointer"
                  onClick={() => onStatusUpdate(_id, "Approved")}
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
    
      try {
        dispatch(SetLoader(true));
        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch(`/get-all-sell-credit-forms`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        console.log(response);
        dispatch(SetLoader(false));
        if (response.ok) {
          const data = await response.json();
          setSellCreditsForm(data?.forms);
        }
      } catch (error) {
        dispatch(SetLoader(false));
        message.error(error.message);
      }
    };
  
    useEffect(() => {
      getData();
    }, []);
  
    const onStatusUpdate = async (id, status) => {
      try {
        dispatch(SetLoader(true));
        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch(`/update-sell-credits-forms-status/${id}`, {
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
        <Table columns={columns} dataSource={sellCreditsForm} />
      </div>
    );
  }
  
  export default SellCredits;
  