import React, { useState, useEffect, useContext} from 'react'
import { useSelector } from 'react-redux';
import { LoginContext } from '../components/Context';
import { SetLoader } from '../redux/loadersSlice';
import { useDispatch } from 'react-redux';
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const {logindata, setLoginData} = useContext(LoginContext);
    const [credits, setCredits] = useState([]); 
    const [forms, setForms] = useState([]);
    const [filters, setFilters] = useState({
      status: "approved",
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.users);
    const getData = async () => {
      try{
        dispatch(SetLoader(true))

        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch(`/get-all-sell-credit-forms`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        dispatch(SetLoader(false))
        const data = await response.json();
        if(response.ok){
          setForms(data.forms);
        }else{
          throw new Error(data.message || 'Failed to fetch data');
        }
      }catch(error){
        dispatch(SetLoader(false))
        message.error(error.message);
      }
    };

    useEffect(() => {
      // Function to fetch data from the backend
      getData()
    }, [])

    return (
      <>
        <div>
          <div className="grid grid-cols-5 gap-2">
            {forms
              .filter((form) => form.status === "approved")
              .map((form) => {
                return (
                  <div className="border border-gray-300 rounded border-solid flex flex-col gap-5 pb-2 cursor-pointer"
                  key={form._id}
                  onClick = {() => navigate(`/sell-credit/${form._id}`)}
                  >
                    <img
                      src={form.images[0]}
                      className="w-full h-40 object-cover"
                    />
                    <div className="px-2 flex flex-col gap-2">
                      <h1 className="text-lg font-semibold">{form.user.fname}</h1>
                      <i className="ri-hand-coin-fill" style={{ color: 'green' }}>
                      <span className="text-xl font-semibold text-green-700">
                       <strong> {form.sellCredits} </strong>
                      </span>
                      </i>
                    {new Date(form.sellBeforeDate).toLocaleDateString()}
                    </div> 
                  </div>
                );
              })}
          </div>
        </div>
      </>
    );
}

export default Home