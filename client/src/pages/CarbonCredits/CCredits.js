import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { message, Table } from "antd";
import { SetLoader } from "../../redux/loadersSlice";

function Carbon_Credits() {
    const [credits, setCredits] = useState([]);
    const [totalCredits, setTotalCredits] = useState(0);
    const dispatch = useDispatch();
    const fetchCredits = async () => {
        try {
            const token = localStorage.getItem("usersdatatoken");
            const response = await fetch("/get-credits/user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            });
    
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
        const expirationTime = new Date(expiryDate).getTime();
        console.log("expiration time::: ", expirationTime);
        const currentTime = new Date().getTime();
        const timeDifference = expirationTime - currentTime;
    
        if (timeDifference <= 0) {
            // Credit has expired
            return { status: 'Expired', remainingTime: '' };
        }
    
        // Calculate remaining time in days, hours, minutes, and seconds
        const duration = moment.duration(timeDifference);
        const remainingTime = duration.humanize();
    
        return { status: 'Active', remainingTime };
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
        },
        {
            title: 'Remaining Time',
            dataIndex: 'remainingTime',
            key: 'remainingTime',
        },
    ];

    return (
        <div>
            <h1>Credit Table</h1>
            <p>Total Credits Earned: {totalCredits}</p>
            <Table columns={columns} dataSource={credits} />
        </div>
    );
}

export default Carbon_Credits;


