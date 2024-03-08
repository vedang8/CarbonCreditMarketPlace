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
        title: "Credits",
        dataIndex: "sellCredits",
      },
      {
        title: "date",
        dataIndex: "sellBeforeDate",
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
              {status === "Pending" && (
                <span
                  className="underline cursor-pointer"
                  onClick={() => onStatusUpdate(_id, "Approved")}
                >
                  Approve
                </span>
              )}
              {status === "Pending" && (
                <span
                  className="underline cursor-pointer"
                  onClick={() => onStatusUpdate(_id, "Rejected")}
                >
                  Reject
                </span>
              )}
              {status === "Approved" && (
                <span
                  className="underline cursor-pointer"
                  onClick={() => onStatusUpdate(_id, "Blocked")}
                >
                  Block
                </span>
              )}
              {status === "Blocked" && (
                <span
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
  