// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import { useDispatch, useSelector } from "react-redux";
// import { message, Table } from "antd";
// import { SetLoader } from "../../redux/loadersSlice";
// import "../mix.css";
// import CountdownTimer from "../../components/CountdownTimer";

// function Carbon_Credits() {
//   const [credits, setCredits] = useState([]);
//   const [totalCredits, setTotalCredits] = useState(0);
//   const [rewardCredits, setRewardCredits] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();

//   const fetchCredits = async () => {
//     try { 
//       dispatch(SetLoader(true));
//       const token = localStorage.getItem("usersdatatoken");
//       // Fetch credits
//       const response = await fetch("/get-credits/user", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token,
//         },
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         const updatedCredits = data.credits.map((credit) => {
//           const { expiryDate, _id } = credit;
//           const { status, remainingTime } = calculateTimeLeft(expiryDate);
//           return { ...credit, status, remainingTime, _id };
//         });
//         setCredits(updatedCredits); // Update credits with calculated remaining time
//         const rewardCreditsResponse = await fetch("/get-reward-credits-user", {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: token,
//             },
//           });
//           if (!rewardCreditsResponse.ok) {
//             throw new Error("Failed to fetch reward credits");
//           }
//           const rewardCreditsData = await rewardCreditsResponse.json();
//           setRewardCredits(rewardCreditsData.reward_credits);
//           updateCredits();
//           dispatch(SetLoader(false));
//       } else {
//         throw new Error("Failed to fetch credits");
//       }
//     } catch (error) {
//       console.error("Error fetching credits:", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchCredits();

//     const interval = setInterval(() => {
//       fetchCredits();
//       updateCredits();
//     }, 60000); // Fetch every minute

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     // Calculate the total credits earned by summing up the amount of all credits
//     const total = credits.reduce(
//       (accumulator, credit) => accumulator + credit.amount,
//       0
//     );
//     setTotalCredits(total);
//   }, [credits]);

//   const updateCredits = async () => {
//             // Update credits with updated expiration status and remaining time
//             const updatedCredits = credits.map((credit) => {
//                 const { expiryDate } = credit;
//                 const { status, remainingTime } = calculateTimeLeft(expiryDate);
//                 return { ...credit, status, remainingTime };
//             });
    
//             const expiredCredits = updatedCredits.filter(
//                 (credit) => credit.status === "Expired"
//             );
    
//             if (expiredCredits.length > 0) {
//                 try {
//                     const token = localStorage.getItem("usersdatatoken");
//                     const response = await fetch("/update-credits-status", {
//                         method: "PUT",
//                         headers: {
//                             "Content-Type": "application/json",
//                             Authorization: token,
//                         },
//                         body: JSON.stringify({
//                             credit_id: expiredCredits.map((credit) => credit._id),
//                         }),
//                     });
//                     if (response.ok) {
//                         console.log("Credits status updated in the database");
//                     } else {
//                         throw new Error("Failed to update credits status in the database");
//                     }
//                 } catch (error) {
//                     console.error("Error updating credits status:", error.message);
//                 }
//             }
    
//             setCredits(updatedCredits);
//         };

//   const calculateTimeLeft = (expiryDate) => {
//     const expirationDate = new Date(expiryDate);
//     const currentTime = new Date();

//     let status;
//     let remainingTime;

//     if (expirationDate < currentTime) {
//       status = "Expired";
//       remainingTime = null;
//     } else {
//       status = "Active";
//       remainingTime = expirationDate;
//     }

//     return { status, remainingTime };
//   };

//   const columns = [
//     {
//       title: "Credit Amount",
//       dataIndex: "amount",
//       key: "amount",
//     },
//     {
//       title: "Expiration Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => {
//         return <span>{status}</span>;
//       },
//     },
//     {
//       title: "Remaining Time",
//       dataIndex: "expiryDate",
//       key: "expiryDate",
//       render: (expiryDate, record) => {
//         const { status, remainingTime } = calculateTimeLeft(expiryDate);
//         return status === "Active" ? (
//           <CountdownTimer targetDate={remainingTime} />
//         ) : (
//           <span>{record.status}</span>
//         );
//       },
//     },
//   ];

//   return (
//     <div className="icons">
//       <h1>Total Credits Earned: {totalCredits}</h1>{" "}
//       <h1>Reward Credits Earned: {rewardCredits}</h1>
//       <Table columns={columns} dataSource={credits} />
//     </div>
//   );
// }

// export default Carbon_Credits;


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
      const updatedCredits = creditsData.credits.map((credit) => {
        const { expiryDate, _id } = credit;
        const { status, remainingTime } = calculateTimeLeft(expiryDate);
        return { ...credit, status, remainingTime, _id };
      });

      setCredits(updatedCredits);
      setTotalCredits(updatedCredits.reduce((total, credit) => total + credit.amount, 0));

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

      setLoading(false);
    } catch (error) {
      console.error("Error fetching credits:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();

    const interval = setInterval(fetchCredits, 60000);

    return () => clearInterval(interval);
  }, []);

  const updateCredits = async () => {
    try {
      const expiredCredits = credits.filter((credit) => credit.status === "Expired");

      if (expiredCredits.length > 0) {
        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch("/update-credits-status", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            credit_id: expiredCredits.map((credit) => credit._id),
          }),
        });

        if (response.ok) {
          console.log("Credits status updated in the database");
        } else {
          throw new Error("Failed to update credits status in the database");
        }
      }

      setCredits((prevCredits) =>
        prevCredits.map((credit) => {
          const { expiryDate } = credit;
          const { status, remainingTime } = calculateTimeLeft(expiryDate);
          return { ...credit, status, remainingTime };
        })
      );
    } catch (error) {
      console.error("Error updating credits status:", error.message);
    }
  };

  const calculateTimeLeft = (expiryDate) => {
    const expirationDate = new Date(expiryDate);
    const currentTime = new Date();

    if (expirationDate < currentTime) {
      return { status: "Expired", remainingTime: null };
    } else {
      return { status: "Active", remainingTime: expirationDate };
    }
  };

  const columns = [
    {
      title: "Credit Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Expiration Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <span>{status}</span>,
    },
    {
      title: "Remaining Time",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (expiryDate, record) => {
        const { status, remainingTime } = calculateTimeLeft(expiryDate);
        return status === "Active" ? <CountdownTimer targetDate={remainingTime} /> : <span>{record.status}</span>;
      },
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
