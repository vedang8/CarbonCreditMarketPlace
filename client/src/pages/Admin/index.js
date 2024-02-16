import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Credits from './Credits';
import Users from './Users';

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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const theme = createTheme();

const StyledTab = (props) => (
  <Tab
    sx={{
      color: props.$isSelected ? 'green' : 'inherit',
      '&.Mui-selected': {
        color: 'green',
      },
    }}
    {...props}
  />
);


export default function Admin() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            TabIndicatorProps={{ style: { backgroundColor: 'green' } }}
          >
            <StyledTab label="Credit Forms" {...a11yProps(0)} $isSelected={value === 0} />
            <StyledTab label="Users" {...a11yProps(1)} $isSelected={value === 1} />
     
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {/* Content for Carbon Credits tab */}
          < Credits />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          < Users />
        </CustomTabPanel>
      </Box>
    </ThemeProvider>
  );
}
