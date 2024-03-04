import React, { useState, useEffect } from 'react'
import { Modal, message, Table } from "antd";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import moment from "moment";
import Divider from "../../components/Divider";

function Bids({
    showBidsModal,
    setShowBidsModal,
    selectedSellCredit,
}) {

  const [bidsData, setBidsData] = useState([]);
  const dispatch = useDispatch();
  
  const getData = async () => {
    try {
        const token = localStorage.getItem("usersdatatoken");
        dispatch(SetLoader(true));
        const response = await fetch(`/get-all-bids`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({ selectedSellCredit}),
        });
        dispatch(SetLoader(false));
        console.log("rreee", response)
        if (response.ok) {
            const data = await response.json();
            console.log("dataaa", data);
            message.success("🪙5 Credits are rewarded! 🎊")
            setBidsData(data.data);
        }
    } catch (error) {
        dispatch(SetLoader(false));
        message.error(error.message);
    }
  };

  const columns = [
    {
        title: "Name",
        dataIndex: "buyer",
        render: (buyer) => buyer.fname
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
        }
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
                )
            
        }
    }
  ];

  useEffect(()=>{
    if(selectedSellCredit){
        getData();
    }
  }, [selectedSellCredit])

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
            <h1 className="text-2xl text-orange-900">
                Bids
            </h1>
            <Divider />
            <h1 className="text-xl text-gray-500">
                Carbon Credits: {selectedSellCredit?.sellCredits}
            </h1>
            <Table columns={columns} dataSource={bidsData} />
        </div> 
    </Modal>
    
  )
}

export default Bids