import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Credits from "./CarbonCredits/Credits";
import Carbon_Credits from "./CarbonCredits/CCredits";
import SellCredits from "./CarbonCredits/SellCredits";

function CustomTabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const theme = createTheme();

export default function Profile() {
  const [value, setValue] = useState(0);
  const [rewardCredits, setRewardCredits] = useState(0);

  const fetchRewardCredits = async () => {
    try {
      const token = localStorage.getItem("usersdatatoken");
      const res = await fetch("/get-reward-credits-user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await res.json();
      setRewardCredits(data.reward_credits);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    // Fetch reward credits
    fetchRewardCredits();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="bg-cover bg-center h-screen flex flex-col">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          TabIndicatorProps={{ style: { backgroundColor: "green" } }}
          className="bg-white bg-opacity-50 p-4 rounded-md mt-4"
        >
          <Tab label="My Forms" />
          <Tab label="Credits" />
          <Tab
            label="Seller"
            disabled={rewardCredits < 100}
            title={
              rewardCredits < 100 ? "Insufficient reward credits" : null
            }
          />
          <Tab label="Bids" />
        </Tabs>
        <div className="flex-grow p-4">
          <CustomTabPanel value={value} index={0}>
            <Credits />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Carbon_Credits />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <SellCredits />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            Bids
          </CustomTabPanel>
        </div>
      </div>
    </ThemeProvider>
  );
}
