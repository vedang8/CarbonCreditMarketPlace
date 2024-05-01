import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { message, Table } from "antd";
import { SetLoader } from "../../redux/loadersSlice";

function Users() {
  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Name",
      dataIndex: "fname",
      align: "center",
      style: { color: "#203545" }, 
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      style: { color: "#000000" }, // Black text color
    },
    {
      title: "Role",
      dataIndex: "role",
      align: "center",
      render: (text, record) => (
        <span style={{ color: record.role === 'admin' ? '#FFFFFF' : '#000000', backgroundColor: record.role === 'admin' ? '#6B8EFA' : '#F2F2F2', padding: '4px 8px', borderRadius: '4px' }}>
          {record.role.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      align: "center",
      render: (createdAt) => (
        <span style={{ color: "#888" }}>{moment(createdAt).format("DD-MM-YYYY hh:mm A")}</span> // Dark gray text color
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (text, record) => (
        <span style={{ color: record.status === 'active' ? '#008000' : '#FF0000' }}>{record.status.toUpperCase()}</span> // Green for active, red for blocked
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (text, record) => {
        const { status, _id } = record;
        return (
          <div className="flex gap-3 justify-center">
            {status === "active" && (
              <span
                className="underline cursor-pointer"
                style={{ color: "#FF0000" }} 
                onClick={() => onStatusUpdate(_id, "blocked")}
              >
                Block
              </span>
            )}
            {status === "blocked" && (
              <span
                className="underline cursor-pointer"
                style={{ color: "#008000" }} 
                onClick={() => onStatusUpdate(_id, "active")}
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
      const response = await fetch("/get-users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      dispatch(SetLoader(false));
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
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
      const response = await fetch(`/update-user-status/${id}`, {
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
      <Table columns={columns} dataSource={users} />
    </div>
  );
}

export default Users;
