import React, { useState, useEffect } from "react";
import { message, Table} from "antd";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import moment from "moment";

function UserBids() {
  const [bidsData, setBidsData] = useState([]); 
  const dispatch = useDispatch();
 
  const getData = async () => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      dispatch(SetLoader(true));
      const response = await fetch(`/get-all-user-bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      dispatch(SetLoader(false));

      if (response.ok) {
        const data = await response.json();
        console.log("dataaa", data);
        setBidsData(data.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Seller Name",
      dataIndex: "seller",
      render: (seller) => seller.fname,
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Actions",
    },
  ];

  useEffect(() => {
      getData();  
  }, []);

  return (
      <div className="flex gap-3 flex-col">
        <Table columns={columns} dataSource={bidsData} />
      </div>
  );
}

export default UserBids;
