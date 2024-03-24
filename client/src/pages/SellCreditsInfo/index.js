import React, { useState, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import { SetLoader } from "../../redux/loadersSlice";
import { message, Button } from "antd";
import Divider from "../../components/Divider";
import BidModel from "./BidModel";
import { LoginContext } from "../../components/Context";

function SellCreditsInfo({selectedSellCredit}) {
  const { logindata, setLoginData } = useContext(LoginContext);
  const [showAddNewBid, setShowAddNewBid] = useState(false);
  const [sellCredit, setSellCredit] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
    
      const token = localStorage.getItem("usersdatatoken");
      console.log("hhhhh", selectedSellCredit)
      // Fetch sell credit details
      const sellCreditResponse = await fetch(`/get-sell-credit-by-id/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      dispatch(SetLoader(false));
      if (!sellCreditResponse.ok) {
        throw new Error("Failed to fetch sell credit details");
      }
      const sellCreditData = await sellCreditResponse.json();
      
      console.log("selllll", sellCreditData);
      // Fetch all bids related to the selected sell credit
      const bidsResponse = await fetch(`/get-all-bids-for-all-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ selectedSellCredit: sellCreditData }), // Pass sell credit data as body
      });
      if (!bidsResponse.ok) {
        throw new Error("Failed to fetch bids");
      }
      const bidsData = await bidsResponse.json();
      // Combine sell credit data with bids data
      const updatedSellCredit = {
        ...sellCreditData,
        bids: bidsData.data, // Assuming bids are returned in the data field
      };
      // Update state with combined data
      setSellCredit(updatedSellCredit);
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    // Function to fetch data from the backend
    getData();
  }, [selectedSellCredit]);
  if (!sellCredit) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold text-orange-900 mb-4">Seller Details</h1>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Name:</span>
                <span className="bg-orange-900 text-white py-1 px-2 rounded">{sellCredit?.data?.user?.fname}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Email:</span>
                <span>{sellCredit?.data?.user?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Carbon Credits:</span>
                <span className="bg-yellow-500 text-white py-1 px-2 rounded">🪙 {sellCredit?.data?.sellCredits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Sell Before Date:</span>
                <span>{sellCredit?.data?.sellBeforeDate}</span>
              </div>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-orange-900">Bids</h1>
              <Button onClick={() => setShowAddNewBid(!showAddNewBid)}>New Bid</Button>
            </div>
            {sellCredit.bids && 
              sellCredit.bids.map((bid) => (
                <div key={bid._id} className="bg-gray-100 p-4 rounded-lg mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Name:</span>
                    <span>{bid.buyer.fname}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Bid Amount:</span>
                    <span>🪙 {bid.bidAmount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Bid Placed On:</span>
                    <span>{moment(bid.createdAt).format("MMM D, YYYY hh:mm A")}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {showAddNewBid && (
        <BidModel
          sellCredit={sellCredit}
          reloadData={getData}
          showBidModal={showAddNewBid}
          setShowBidModal={setShowAddNewBid}
        />
      )}
    </>
  );
}

export default SellCreditsInfo;
