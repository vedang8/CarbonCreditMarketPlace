import React, { useState, useRef , useEffect} from 'react';
import { Tabs, Tab, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from "../../redux/loadersSlice";
import { message } from "antd";
import { format, toDate } from 'date-fns';
import Images from "./Images"
// Tab Panel
const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} role="tabpanel">
    {value === index && <div>{children}</div>}
  </div>
);

const CreditsForm = ({ setShowCreditsForm, selectedCredit, getData, editMode, handleDeleteClick }) => {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();

  const { user} = useSelector((state) => state.users);
  const handlePrev = () => {
    setActiveTab((prevTab) => prevTab - 1);
  };
  const [imageTabEnabled, setIamgeTabEnabled] = useState(false);

  const [formData, setFormData] = useState({
      projectName: "", 
      projectType: "", 
      description: "", 
      startDate: "", 
      endDate: "",
      baselineEmissionAmount: "", 
      projectEmissionAmount: "" ,
      numOfTrees: "", 
      numOfSolarPanels: "", 
      electricity: "" ,
      images: [],
      user: "",
      status: "pending",
  });
  
  
  const setfVal = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
    const handleNext = () => {
      if (activeTab === 0) {
        if (
          !formData.description ||
          !formData.endDate ||
          !formData.projectName ||
          !formData.startDate
        ) {
          alert("Please fill all the fields");
          return;
        }
      } else if (activeTab === 1) {
        if (
          !formData.baselineEmissionAmount ||
          !formData.projectEmissionAmount
        ) {
          alert("Please fill all the fields");
          return;
        }
      } else if (activeTab === 2) {
        if (!formData.tree || !formData.solarPanel || !formData.electricity) {
          alert("Please fill all the fields");
          return;
        }
      }

      setActiveTab((prevTab) => prevTab + 1);
    }; 
    
    const handleDelete = async () => {
      try{
        handleDeleteClick(selectedCredit);
        setShowCreditsForm(false);
      }catch(error){
        console.error("Error deleting credit form", error);
      }
    }
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      const curr = new Date();
      try {
        // Dispatch action to set loading state to true
        dispatch(SetLoader(true));
        // Validation of form fields
        if (
          !formData.description ||
          !formData.endDate ||
          !formData.projectName ||
          !formData.projectType ||
          !formData.startDate ||
          !formData.baselineEmissionAmount ||
          !formData.projectEmissionAmount ||
          !formData.numOfTrees ||
          !formData.numOfSolarPanels ||
          !formData.electricity
        ) {
          message.error("Please fill all the fields of the form");
          return;
        }else if(formData.startDate > formData.endDate && formData.startDate > curr && formData.endDate > curr){
          message.error("Please mention the proper Start Date and End Date");
          return;
        }
        
        
        // Get the authorization token from the request headers
        const token = localStorage.getItem("usersdatatoken"); // Assuming you store the token in local storage

        const formDataWithUser = {
          ...formData,
          user: JSON.parse(atob(token.split('.')[1])).id,
        };
        
        console.log("Selected Crdeit: ", selectedCredit);
        if(selectedCredit){
           // Edit Form
           console.log("Sending fetch request", formDataWithUser);
           const res = await fetch(`/edit-credit-forms/${selectedCredit._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token,
            },
            body: JSON.stringify(formDataWithUser),
           });
           dispatch(SetLoader(false));
           if(res.ok) {
            const data = await res.json();
          //console.log(data);
            message.success(data.message);
            getData(); // Update the data after successful edit
            setShowCreditsForm(false);
           }else{
            console.error('Error updating the form');
            message.error('Error updating the form. Please try again.');
           }  
        }else{
          // Add new form
          const res = await fetch("/credit-forms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            },
            body: JSON.stringify(formDataWithUser),
          });
          dispatch(SetLoader(false));
          
          if(res.ok){
            const data = await res.json();
            console.log(data); 
            setFormData({...formData, description: "", startDate: "", endDate: "", projectName: "", projectType: "", projectEmissionAmount: "",
                          baselineEmissionAmount: "", numOfTrees: "", numOfSolarPanels: "", electricity: "", status: "", images: []});
            await getData();
            message.success(data.message);
            message.success("🪙50 points are rewarded! 🎊")
            setShowCreditsForm(false);
          } else {
            message.error('Error submitting the form. Please try again.');
            }
        }  
      } catch (error) {
        dispatch(SetLoader(false));
        console.error('Error:', error);
        message.error(error.message);
      } finally {
        // Dispatch action to set loading state to false in the finally block
        dispatch(SetLoader(false));
      }
    };
  
    const handleCloseClick = () => {
      setFormData({...formData, description: "", startDate: "", endDate: "", projectName: "", projectType: "", projectEmissionAmount: "",
                        baselineEmissionAmount: "", numOfTrees: "", numOfSolarPanels: "", electricity: "", status: "", images: []});
      setShowCreditsForm(false);
    };
   // const formRef = useRef(null);

   useEffect(() => {
    console.log("SelectedCredit: ", selectedCredit);
    if (selectedCredit) {
      console.log('Setting form data with selectedCredit', selectedCredit)
      setFormData(prevData => ({
        ...prevData,
        ...selectedCredit
      }));
      setActiveTab(0);
    }
  }, [selectedCredit, editMode]);
  return (
    <div>
        <div className="form-overlay">
      <div className="form-container">
        <div className="form_data">
        
        <h1 className="text-primary text-2xl text-center fontsemibold uppercase">
          {selectedCredit ? "Edit Form" : "Add Carbon Credits"}
        </h1>
        <span className="close-symbol" onClick={handleCloseClick}>
          &#10006; {/* Close symbol (X) */}
        </span>
        <form>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Project Information" />
          <Tab label="Emission Information" />
          <Tab label="Trees and Solar Panels" />
          {imageTabEnabled &&  <Tab label="Images" /> }
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          {/* Content for Project Information tab */}
          <div className="form_input">
              <label htmlFor="projectName">Project Name</label>
              <input type="text" onChange={setfVal} value={formData.projectName} name="projectName" id="projectName" required />
          </div>
          <div className="form_input">
              <label htmlFor="projectType">Project Type</label>
              <input type="text" onChange={setfVal} value={formData.projectType} name="projectType" id="projectType" required />
          </div>
          <div className="form_input">
              <label htmlFor="description">Description</label>
              <input type="text" onChange={setfVal} value={formData.description} name="description" id="description" required />
          </div>
          <div className="form_input">
              <label htmlFor="start">Start Date</label>
              <input type="date" onChange={setfVal} value={formData.startDate ? format(new Date(formData.startDate), 'yyyy-MM-dd') : ''} name="startDate" id="startDate" required />
          </div>
          <div className="form_input">
              <label htmlFor="end">End Date</label>
              <input type="date" onChange={setfVal}  value={formData.endDate ? format(new Date(formData.endDate), 'yyyy-MM-dd') : ''} name="endDate" id="endDate" required />
          </div>
          <Button onClick={handleNext}>Next</Button>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          {/* Content for Emission Information tab */}
          <div className="form_input">
              <label htmlFor="baselineEmissionAmount">Baseline Emission Amount</label>
              <input type="number" onChange={setfVal} value={formData.baselineEmissionAmount} name="baselineEmissionAmount" id="baselineEmissionAmount" required />
          </div>
          <div className="form_input">
              <label htmlFor="projectEmissionAmount">Project Emission Amount</label>
              <input type="number" onChange={setfVal} value={formData.projectEmissionAmount} name="projectEmissionAmount" id="projectEmissionAmount" required />
          </div>
          <Button onClick={handlePrev}>Prev</Button>
          <Button onClick={handleNext}>Next</Button>
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          {/* Content for Trees and Solar Panels tab */}
          <div className="form_input">
              <label htmlFor="numOfTrees">Number of Trees</label>
              <input type="number" onChange={setfVal} value={formData.numOfTrees} name="numOfTrees" id="numOfTrees" required />
          </div>
          <div className="form_input">
              <label htmlFor="numOfSolarPanels">Number of Solar Panels</label>
              <input type="number" onChange={setfVal} value={formData.numOfSolarPanels} name="numOfSolarPanels" id="numOfSolarPanels" required />
          </div>
          <div className="form_input">
              <label htmlFor="electricity">Electricity generated by Solar Panels (in killo-watt hours)</label>
              <input type="number" onChange={setfVal} value={formData.electricity} name="electricity" id="electricity" required />
          </div>
          <Button onClick={handlePrev}>Prev</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
           <Images selectedCredit={selectedCredit} getData={getData} setShowCreditsForm={setShowCreditsForm} />
        </TabPanel>
        </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CreditsForm;


