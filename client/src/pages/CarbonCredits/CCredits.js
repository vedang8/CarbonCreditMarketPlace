import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { message, Table } from "antd";
import { SetLoader } from "../../redux/loadersSlice";
import "../mix.css"
import CountdownTimer from "../../components/CountdownTimer";

function Carbon_Credits() {
    const [credits, setCredits] = useState([]);
    const [totalCredits, setTotalCredits] = useState(0);
    const dispatch = useDispatch();
    const fetchCredits = async () => {
        try {
            dispatch(SetLoader(true))
            const token = localStorage.getItem("usersdatatoken");
            const response = await fetch("/get-credits/user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });
            dispatch(SetLoader(false))
            if (response.ok) {
                const data = await response.json();
                const updatedCredits = data.credits.map((credit) => {
                    const { expiryDate } = credit;
                    const { status, remainingTime } = calculateTimeLeft(expiryDate);
                    return { ...credit, status, remainingTime };
                });
                setCredits(updatedCredits); // Update credits with calculated remaining time
            } else {
                throw new Error("Failed to fetch credits");
            }
        } catch(error) {
            console.error("Error fetching credits:", error.message);
        }
    };
    
    useEffect(() => {
        fetchCredits();

        const interval = setInterval(() => {
            fetchCredits(); 
            updateCredits();
        }, 60000); // Fetch every minute

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Calculate the total credits earned by summing up the amount of all credits
        const total = credits.reduce((accumulator, credit) => accumulator + credit.amount, 0);
        setTotalCredits(total);
    }, [credits]);

    const updateCredits = () => {
        // Update credits with updated expiration status and remaining time
        const updatedCredits = credits.map((credit) => {
          const { expiryDate } = credit;
          const { status, remainingTime } = calculateTimeLeft(expiryDate);
          return { ...credit, status, remainingTime };
        });
    
        setCredits(updatedCredits);
    };

    const calculateTimeLeft = (expiryDate) => {
        const expirationDate = new Date(expiryDate);
        const currentTime = new Date();
        
        let status;
        let remainingTime;
    
        if (expirationDate < currentTime) {
            status = 'Expired';
            remainingTime = null;
        } else {
            status = 'Active';
            remainingTime = expirationDate;
        }
    
        return { status, remainingTime };
    };
    
    const columns = [
        {
            title: 'Credit Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Expiration Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                return <span>{status}</span>;
            }
        },
        {
            title: 'Remaining Time',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
            render: (expiryDate, record) => {
                const { status, remainingTime } = calculateTimeLeft(expiryDate);
                return status === 'Active' ? (
                    <CountdownTimer targetDate={remainingTime} />
                ) : (
                    <span>{record.status}</span>
                );
            }
        },
    ];

    return (
        <div className="icons">
            <i class="fa-duotone fa-coins" ></i>
            <h1>Total Credits Earned: {totalCredits}</h1>
            <Table columns={columns} dataSource={credits} />
        </div>
    );
}

export default Carbon_Credits;


