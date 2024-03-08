import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Credits from "./CarbonCredits/Credits";
import Carbon_Credits from "./CarbonCredits/CCredits";
import SellCredits from "./CarbonCredits/SellCredits";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const theme = createTheme();

const StyledTab = (props) => (
  <Tab
    sx={{
      color: props.$isSelected ? "green" : "inherit",
      "&.Mui-selected": {
        color: "green",
      },
    }}
    {...props}
  />
);

export default function Profile() {
  const [value, setValue] = React.useState(0);
  const [rewardCredits, setRewardCredits] = React.useState(0);

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

  React.useEffect(() => {
    // fetching rewardcredits
    fetchRewardCredits();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            TabIndicatorProps={{ style: { backgroundColor: "green" } }}
          >
            <StyledTab
              label="My Forms"
              {...a11yProps(0)}
              $isSelected={value === 0}
            />
            <StyledTab
              label="Credits"
              {...a11yProps(1)}
              $isSelected={value === 1}
            />
            <StyledTab
              label="Seller"
              {...a11yProps(2)}
              disabled={rewardCredits < 100}
              title={rewardCredits < 100 ? "Insufficient reward credits" : null}
            />
            <StyledTab
              label="Bids"
              {...a11yProps(3)}
              $isSelected={value === 3}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {/* Content for Carbon Credits tab */}
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
      </Box>
    </ThemeProvider>
  );
}
