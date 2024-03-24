import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { message, Table } from "antd";
import { SetLoader } from "../../redux/loadersSlice";
import "../mix.css";
import CountdownTimer from "../../components/CountdownTimer";

function Carbon_Credits() {
  const [credits, setCredits] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [rewardCredits, setRewardCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchCredits = async () => {
    try {
      setLoading(true);
      dispatch(SetLoader(true));
      const token = localStorage.getItem("usersdatatoken");
      const creditsResponse = await fetch("/get-credits/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!creditsResponse.ok) {
        throw new Error("Failed to fetch credits");
      }
  
      const creditsData = await creditsResponse.json();
      console.log("Credits :: ", creditsData);
      const updatedCredits = creditsData.credits.map((credit) => {
        const { expiryDate, _id } = credit;
        const { remainingTime } = calculateTimeLeft(expiryDate);
        return { ...credit, remainingTime, _id };
      });
      console.log("UPDATED CREDITS:: ", updatedCredits);
      
      setCredits(updatedCredits);

      const act = updatedCredits.filter(
        (credit) => credit.status === "active" && credit.remainingTime == null
      );
      console.log("acttt", act);
      // changing the status 
      if (act.length > 0) {
        const response_act = await fetch("/update-credits-status", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            credit_id: act.map((credit) => credit._id),
          }),
        });

        creditsData = await response_act.json();
        setCredits(creditsData.credits);
      }
      
      // setting the credits 

      const activeApprovedCredits = updatedCredits.filter(
        (credit) => credit.status === "active" 
      );
      setTotalCredits(
        activeApprovedCredits.reduce(
          (total, credit) => total + credit.amount,
          0
        )
      );

      const rewardCreditsResponse = await fetch("/get-reward-credits-user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!rewardCreditsResponse.ok) {
        throw new Error("Failed to fetch reward credits");
      }

      const rewardCreditsData = await rewardCreditsResponse.json();
      setRewardCredits(rewardCreditsData.reward_credits);
      dispatch(SetLoader(false));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching credits:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
    //updateCredits();
    const interval = setInterval(fetchCredits, 60000);

    return () => clearInterval(interval);
  }, []);

  // const updateCredits = async () => {
  //   try {
  //     const expiredCredits = credits.filter(
  //       (credit) => credit.status === "expired"
  //     );
  //     console.log("Expired Credits", expiredCredits);
  //     if (expiredCredits.length > 0) {
  //       const token = localStorage.getItem("usersdatatoken");
  //       const response = await fetch("/update-credits-status", {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: token,
  //         },
  //         body: JSON.stringify({
  //           credit_id: expiredCredits.map((credit) => credit._id),
  //         }),
  //       });

  //       if (response.ok) {
  //         console.log("Credits status updated");
  //       } else {
  //         throw new Error("Failed to update credits status in the database");
  //       }
  //     }

  //     setCredits((prevCredits) =>
  //       prevCredits.map((credit) => {
  //         const { expiryDate } = credit;
  //         const { status, remainingTime } = calculateTimeLeft(expiryDate);
  //         return { ...credit, status, remainingTime };
  //       })
  //     );
  //   } catch (error) {
  //     console.error("Error updating credits status:", error.message);
  //   }
  // };

  const calculateTimeLeft = (expiryDate) => {
    const expirationDate = new Date(expiryDate);
    const currentTime = new Date();

    if (expirationDate < currentTime) {
      return { remainingTime: null };
    } else {
      return { remainingTime: expirationDate };
    }
  };

  const columns = [
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
      render: (text) => (
        <span
          style={{
            fontSize: "16px",
            color: "#652A0E",
            backgroundColor: "#FFF39A",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Credit Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        record.status
      ),
    },
    {
      title: "Remaining Time",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (expiryDate, record) => <CountdownTimer targetDate={expiryDate} status={record.status} />
    },
  ];

  return (
    <div className="icons">
      <h1>Total Credits Earned: {totalCredits}</h1>
      <h1>Reward Credits Earned: {rewardCredits}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table columns={columns} dataSource={credits} />
      )}
    </div>
  );
}

export default Carbon_Credits;
