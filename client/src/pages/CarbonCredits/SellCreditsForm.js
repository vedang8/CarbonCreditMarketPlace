import React, { useState, useRef, useEffect } from "react";
import { Tabs, Tab, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { message } from "antd";
import { format } from "date-fns";
import Images from "./Images";

// Tab Panel
const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} role="tabpanel">
    {value === index && <div>{children}</div>}
  </div>
);

const SellCreditsForm = ({
  setShowSellCreditsForm,
  selectedSellCredit,
  getData,
  editMode,
  handleDeleteClick,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.users);

  const [imageTabEnabled, setImageTabEnabled] = useState(false);

  const [formData, setFormData] = useState({
    sellCredits: "",
    sellBeforeDate: "",
    user: "",
    images: [],
    status: "pending",
  });

  const setfVal = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      handleDeleteClick(selectedSellCredit);
      setShowSellCreditsForm(false);
    } catch (error) {
      console.error("Error deleting credit form", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Dispatch action to set loading state to true
      dispatch(SetLoader(true));
      // Validation of form fields
      if (!formData.sellCredits || !formData.sellBeforeDate) {
        message.error("Please fill all the fields of the form");
        return;
      }
      // Get the authorization token from the request headers
      const token = localStorage.getItem("usersdatatoken"); // Assuming you store the token in local storage
      
      const formDataWithUser = {
        ...formData,
        user: JSON.parse(atob(token.split(".")[1])).id,
      };
      console.log("Selected Crdeit: ", selectedSellCredit);
      if (selectedSellCredit) {
        console.log("Sending fetch request", formDataWithUser);
        const res = await fetch(
          `/edit-sell-credit-forms/${selectedSellCredit._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify(formDataWithUser),
          }
        );
        dispatch(SetLoader(false));
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          message.success(data.message);
          getData(); // Update the data after successful edit
          setShowSellCreditsForm(false);
        } else {
          console.error("Error updating the form");
          message.error("Error updating the form. Please try again.");
        }
      } else {
        // Send a POST request to the backend
        const res = await fetch("/sell-credit-forms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(formDataWithUser),
        });

        dispatch(SetLoader(false));

        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setFormData({
            ...formData,
            sellCredits: "",
            sellBeforeDate: "",
            status: "",
            images: [],
          });
          await getData();
          message.success(data.message);
          message.success("🪙25 Credits are rewarded! 🎊")
          setShowSellCreditsForm(false);
        } else {
          message.error("Error submitting the form. Please try again.");
        }
      }
    } catch (error) {
      dispatch(SetLoader(false));
      console.error("Error:", error);
      message.error(error.message);
    } finally {
      // Dispatch action to set loading state to false in the finally block
      dispatch(SetLoader(false));
    }
  };

  const handleCloseClick = () => {
    setFormData({
      ...formData,
      sellCredits: "",
      sellBeforeDate: "",
      status: "",
      images: [],
    });
    setShowSellCreditsForm(false);
  };

  useEffect(() => {
    console.log("SelectedSellCredit: ", selectedSellCredit);
    if (selectedSellCredit) {
      console.log("Setting form data with selectedCredit", selectedSellCredit);
      setFormData((prevData) => ({
        ...prevData,
        ...selectedSellCredit,
      }));
      setActiveTab(0);
      setImageTabEnabled(true); // Enable the image tab when in edit mode
    }
  }, [selectedSellCredit, editMode]);

  return (
    <div>
      <div className="form-overlay">
        <div className="form-container">
          <div className="form_data">
            <h1 className="text-primary text-2xl text-center fontsemibold uppercase">
              {selectedSellCredit ? "Edit Form" : "Sell Carbon Credits"}
            </h1>
            <span className="close-symbol" onClick={handleCloseClick}>
              &#10006; {/* Close symbol (X) */}
            </span>
            <form>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
              >
                <Tab label="Selling Info" />
                {imageTabEnabled && <Tab label="Images" />}
              </Tabs>
              <TabPanel value={activeTab} index={0}>
                {/* Content for Project Information tab */}
                <div className="form_input">
                  <label htmlFor="sellCredits">Credits to be Sold</label>
                  <input
                    type="text"
                    onChange={setfVal}
                    value={formData.sellCredits}
                    name="sellCredits"
                    id="sellCredits"
                    required
                  />
                </div>      
                <div className="form_input">
                  <label htmlFor="sellBeforeDate">Date</label>
                  <input
                    type="date"
                    onChange={setfVal}
                    value={
                      formData.sellBeforeDate
                        ? format(new Date(formData.sellBeforeDate), "yyyy-MM-dd")
                        : ""
                    }
                    name="sellBeforeDate"
                    id="sellBeforeDate"
                    required
                  />
                </div>
                <Button onClick={handleSubmit}>Submit</Button>
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                <Images
                  selectedSellCredit={selectedSellCredit}
                  getData={getData}
                  setShowSellCreditsForm={setShowSellCreditsForm}
                />
              </TabPanel>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCreditsForm;