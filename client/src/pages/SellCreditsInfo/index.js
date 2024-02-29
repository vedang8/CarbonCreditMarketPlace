import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';

import { SetLoader } from '../../redux/loadersSlice';
import { message } from "antd";
import Divider from '../../components/Divider';

function SellCreditsInfo() {
  const [sellCredit, setSellCredit] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const getData = async () => {
    try{
      dispatch(SetLoader(true))

      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(`/get-sell-credit-by-id/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      console.log(response);
      dispatch(SetLoader(false))
      if(response.ok){
        const data = await response.json();
        setSellCredit(data);
      }
    }catch(error){
      dispatch(SetLoader(false))
      message.error(error.message);
    }
  };

  useEffect(() => {
    // Function to fetch data from the backend
    getData()
  }, [])
  if (!sellCredit) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div>
        <div className="grid grid-cols-2 gap-5">
          {/* images */}
          <div className="flex flex-col gap-2">
            {sellCredit && sellCredit.images && sellCredit.images.length > 0 ? (
              <img
                src={sellCredit.images[selectedImageIndex]}
                alt="profile image"
                className="w-20 h-20 rounded-md mt-5"
              />
            ) : (
              <p>No image available</p>
            )}
          </div>

          {/* details */}
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl font-semibold text-brown-500 mt-5">{sellCredit?.data.user?.fname}</h1>
          </div>

          <Divider />
        </div>
      </div>
    </>
  )
}

export default SellCreditsInfo

