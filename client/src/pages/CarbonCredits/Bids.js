import React, { useState, useEffect } from "react";
import { Modal, message, Table, Button } from "antd";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import moment from "moment";
import Divider from "../../components/Divider";

function Bids({ showBidsModal, setShowBidsModal, selectedSellCredit }) {
  const [bidsData, setBidsData] = useState([]);
  const dispatch = useDispatch();
  const [clickedBidId, setClickedBidId] = useState(null);
  console.log("Selected ", selectedSellCredit);
  const getData = async () => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      dispatch(SetLoader(true));
      const response = await fetch(`/get-particular-all-bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ selectedSellCredit }),
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

  const assignBidder = async (id) => {
    dispatch(SetLoader(true));
    setClickedBidId(id);
    try {
      // notify buyer for winning bid  
      const notifyUser = {
        title: "Congratulations! 🎉",
        message: `You have Won the Bid`,
        user: id,
        onClick: `/profile`,
        read: false,
      };
      const token = localStorage.getItem("usersdatatoken");
      const notifyResponse = await fetch("/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(notifyUser),
      });
      message.success("Buyer has been notified");

      // buy and sell
      const res = await fetch("/buy-and-sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ selectedSellCredit, id }),
      });
      dispatch(SetLoader(false));
      if(res.ok){
        message.success("Carbon Credits have been sold");
      }
      
      // notify buyer for the credits
      const notify1 = {
        title: "Congratulations! 🎉",
        message: `You have earned ${selectedSellCredit.sellCredits} Carbon Credits from ${selectedSellCredit.user.fname}`,
        user: id,
        onClick: `/profile`,
        read: false,
      };

      const notifyResponse1 = await fetch("/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(notify1),
      });
     
    } catch (error) {
      dispatch(SetLoader(false));
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "buyer",
      render: (buyer) => buyer.fname,
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
    },
    {
      title: "Bid Date",
      dataIndex: "createdAt",
      render: (createdAt) => {
        return moment(createdAt).format("DD-MM-YYYY, h:mm:ss a");
      },
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Contact Details",
      dataIndex: "mobile",
      render: (mobile, record) => {
        return (
          <div>
            <p>Mobile: {mobile}</p>
            <p>Email: {record.buyer.email}</p>
          </div>
        );
      },
    },
    {
      title: "Actions",
      render: (record) => (
        <Button
          onClick={() => assignBidder(record?.buyer?._id)}
          disabled={clickedBidId === record?.buyer?._id}
          style={{ backgroundColor: "green" }}
        >
          {clickedBidId === record?.buyer?._id ? "Assigned" : "Assign"}
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (selectedSellCredit) {
      getData();
    }
  }, [selectedSellCredit]);

  return (
    <Modal
      title=""
      open={showBidsModal}
      onCancel={() => setShowBidsModal(false)}
      centered
      width={1200}
      footer={null}
    >
      <div className="flex gap-3 flex-col">
        <h1 className="text-2xl text-orange-900">Bids</h1>
        <Divider />
        <h1 className="text-xl text-gray-500">
          Carbon Credits: {selectedSellCredit?.sellCredits}
        </h1>
        <Table columns={columns} dataSource={bidsData} />
      </div>
    </Modal>
  );
}

export default Bids;
