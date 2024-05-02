import React, {useEffect, useState} from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { message, Table } from "antd";
import { SetLoader } from "../../redux/loadersSlice";

function Credits() {
  const [creditsForm, setCreditsForm] = useState([]);
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Sender's Name",
      dataIndex: "senderName",
      render: (_, record) => (
        <span style={{ color: '#203545' }}>
          {record.user ? record.user.fname : ""}
        </span>
      ),
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
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
      title: "Start Date",
      dataIndex: "startDate",
      render: (record) => {
        return (
          <span style={{ color: "blueviolet" }}>{new Date(record).toLocaleDateString()}</span>
        );
      }
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (record) => {
        return (
          <span style={{ color: "red" }}>{new Date(record).toLocaleDateString()}</span>
        );
      }
    },
    {
      title: "Baseline Emission Amt",
      dataIndex: "baselineEmissionAmount",
    },
    {
      title: "Project Emission Amt",
      dataIndex: "projectEmissionAmount",
    },
    {
      title: "Trees",
      dataIndex: "numOfTrees",
      render: (record) => {
        return (
          <span style={{ color: "darkgreen" }}>{record}</span>
        );
      }
    },
    {
      title: "Solar Panels",
      dataIndex: "numOfSolarPanels",
      render: (record) => {
        return (
          <span style={{ color: "darkgreen" }}>{record}</span>
        );
      }
    },
    {
      title: "Electricity Consumption",
      dataIndex: "electricity",
      render: (record) => {
        return (
          <span style={{ color: "darkgreen" }}>{record} kWh</span>
        );
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <span style={{ color: record.status === 'approved' ? '#008000' : (record.status === 'pending' ? '#FFA500' : '#FF0000') }}>
          {record.status.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Added On",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span style={{ color: '#888' }}>
          {moment(record.createdAt).format("DD-MM-YYYY hh:mm A")}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const { status, _id } = record;
        return (
          <div className="flex gap-5">
            {status === "pending" && (
              <span
                style={{ color: "#008000" }}
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Approve
              </span>
            )}
            {status === "pending" && (
              <span
                style={{ color: "#FF0000" }} 
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "rejected")}
              >
                Reject
              </span>
            )}
            {status === "approved" && (
              <span
                style={{ color: "#FF0000" }}
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "blocked")}
              >
                Block
              </span>
            )}
            {status === "blocked" && (
              <span
                style={{ color: "#008000" }}
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Unblock
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const getData = async () => {
    console.log("get data fun called");
    try {
      dispatch(SetLoader(true));
      const response = await fetch(`/get-credit-forms`);
      console.log(response);
      dispatch(SetLoader(false));
      if (response.ok) {
        const data = await response.json();
        console.log("my data is:", data);
        setCreditsForm(data?.forms);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const onStatusUpdate = async (id, status) => {
    try {
      dispatch(SetLoader(true));
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(`/update-credits-forms-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ status }),
      });
      dispatch(SetLoader(false));
      if (response.ok) {
        const data = await response.json();
        message.success(data.message);
        getData();
        if (status === "approved") {
          generateAndAssignCredits(id);
          const res = await fetch(`/generate-certificate/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          });
          if(res.ok){
            const data1 = await res.json();
            message.success(data1.message);
          }
        }
      } else {
        throw new Error("Error updating form status");
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const generateAndAssignCredits = async (formId) => {
    try {
      // fetching the approved form data
      const response = await fetch(`/get-credit-forms/${formId}`);
    
      if (response.ok) {
        const formData = await response.json();
        const approvedForm = formData.data;

        const credits = calculateCredits(approvedForm);

        message.success("Carbon Credits are generated");
        
        const ed = approvedForm.endDate;
        const projectName = approvedForm.projectName;

        assignCreditsToUser(approvedForm.user, projectName, credits, ed);

      } else {
        message.error("Internal server error");
      }
    } catch (error) {
      console.error(error.message);
      // Handle the error here, for example, update UI
      message.error(error.message);
    }
  };

  // calculating the carbon credits
  function calculateCredits(approvedForm) {
    const bea = approvedForm.baselineEmissionAmount;
    const pea = approvedForm.projectEmissionAmount;
    const sd = approvedForm.startDate;
    const ed = approvedForm.endDate;
    const nt = approvedForm.numOfTrees;
    const sp = approvedForm.numOfSolarPanels;
    const eg = approvedForm.electricity;

    const edDate = new Date(ed);
    const sdDate = new Date(sd);
    // calculating emission reductions
    const er = bea - pea;
    console.log("Emission Reductions:", er);

    // calculating total electricity generated during the project period
    const cp = 300; // capacity per panel
    const ef = 0.15; // efficiency
    const sunlight = 8; // total sunlight hours per day
    const oneDay = 24 * 60 * 60 * 1000;
    const timeDifference = edDate.getTime() - sdDate.getTime();
    const daysDifference = Math.round(Math.abs(timeDifference / oneDay));

    const teg = sp * cp * ef * sunlight * eg * daysDifference;

    // calculating total emissions avoided due to electricity generated by solar panels
    const tea_solar = teg * 0.1; // 0.1 metric tons of CO2 i.e. CIFsolar
    console.log("Total Emissions Avoided (Solar):", tea_solar);

    // calculating the total carbon sequestered by trees
    const tc = 0.01 * nt * daysDifference; // 0.01 metric tons of CO2 is the carbon sequestration Rate
    console.log("Total Carbon Sequestered:", tc);

    // calculating the total emissions avoided
    const tea = tea_solar + tc;
    console.log("Total Emissions Avoided:", tea);

    // converting emissions avoided to carbon credits
    const carbon_credits = tea * (0.001).toFixed(4);; // 0.001 is the conversion factor
    console.log("Carbon Credits:", carbon_credits);

    return carbon_credits;
  }

  const assignCreditsToUser = async (user, projectName, credits, ed) => {
    try{
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch(`/update-user-credits/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ credits }),
      });
      const data = await response.json();
      if(response.ok){
        message.success(data.message);
      }else{
        throw new Error(data.message);
      }

      const res2 = await fetch(`/assign-credits/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({projectName, credits, ed}),
      });
      const data2 = await res2.json();
      if(res2.ok){
        message.success(data2.message);
      }else{
        throw new Error(data2.message);
      }
    }catch(error){
      console.error("Error assigning credits to user:", error.message);
    }
  }
  return (
    <div>
      <Table columns={columns} dataSource={creditsForm} />
    </div>
  );
}

export default Credits;
