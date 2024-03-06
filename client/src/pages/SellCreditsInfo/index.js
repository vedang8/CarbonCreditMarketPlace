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
      <div className="flex flex-col col-4 justify-center items-center">
        <div>
          {/* images */}
          {/* <div className="flex flex-col gap-2">
            {sellCredit && sellCredit.images && sellCredit.images.length > 0 ? (
              <img
                src={sellCredit.images[selectedImageIndex]}
                alt="profile image"
                className="w-20 h-20 rounded-md mt-5"
              />
            ) : (
              <p>No image available</p>
            )}
          </div> */}

          {/* details */}

          <div className="flex flex-col">
            <div>
              <h1 className="text-2xl font-semibold text-orange-900 mt-2">
                Seller Details
              </h1>
            </div>
            <div className="flex justify-between mt-2 text-xl">
              <span>Name</span>
              <span className="uppercase" style={{ color: "white", backgroundColor: "#7b3f00" }}>{sellCredit?.data?.user?.fname}</span>
            </div>
            <div className="flex justify-between mt-2 text-xl">
              <span>Email</span>
              <span>{sellCredit?.data?.user?.email}</span>
            </div>
            <div className="flex justify-between mt-2 text-xl">
              <span>Carbon Credits</span>
              <span style={{ backgroundColor: "yellow" }}>🪙 {sellCredit?.data?.sellCredits}</span>
            </div>
            <div className="flex justify-between mt-2 text-xl">
              <span>Sell Before Date</span>
              <span>{sellCredit?.data?.sellBeforeDate}</span>
            </div>
            <Divider />
            <div className="flex flex-col">
              <div className="flex justify-between mt-2">
                <h1 className="text-2xl font-semibold text-orange-900">Bids</h1>
                <Button
                  onClick={() => setShowAddNewBid(!showAddNewBid)}
                  //disabled={sellCredit?.data?.user?._id === userId}
                >
                  New Bid
                </Button>
              </div>
            </div>
            {  sellCredit.bids && 
                sellCredit.bids.map((bid) => {
                  return (
                    <div className="border border-gray-300 border-solid p-3 rounded mt-5">
                      <div className="flex justify-between text-gray-700">
                        <span>Name</span>
                        <span> {bid.buyer.fname}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Bid Amount</span>
                        <span> 🪙 {bid.bidAmount}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Bid Placed On</span>
                        <span>
                          {" "}
                          {moment(bid.createdAt).format("MMM D , YYYY hh:mm A")}
                        </span>
                      </div>
                    </div>
                  );
                })}
            {showAddNewBid && (
              <BidModel
                sellCredit={sellCredit}
                reloadData={getData}
                showBidModal={showAddNewBid}
                setShowBidModal={setShowAddNewBid}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SellCreditsInfo;
