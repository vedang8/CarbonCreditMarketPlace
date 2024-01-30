import React, { useContext, useEffect} from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import { LoginContext } from '../components/Context';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../redux/loadersSlice';
import { SetUser } from '../redux/usersSlice';
import Home from './Home';
import Profile from './Profile';
const Dashboard = () => {
    
    const {logindata, setLoginData} = useContext(LoginContext);
  //  const { user } = useSelector((state)=> state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const DashboardValid = async () => {
        dispatch(SetLoader(true));
        let token = localStorage.getItem("usersdatatoken");
        
        const res = await fetch("/validuser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        const data = await res.json();
        console.log("user data", data)
        dispatch(SetLoader(false));
        if(data.status === 401 || !data){
           navigate("*")
        }else{
           setLoginData(data); 
           dispatch(SetUser(data)); // Dispatch the sey User action
           navigate("/home"); 
        }
    }
    
    const logoutuser = async() => {
        dispatch(SetLoader(true));
        let token = localStorage.getItem("usersdatatoken");
        const res = await fetch("/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                Accept: "application/json"
            },
            credentials: "include"
        });
        
        const data = await res.json();
        dispatch(SetLoader(false));
        if(data.status !== 201){
           dispatch(SetLoader(false)); 
           console.log("error");
           navigate("*");
        }else{
            console.log("user loggout ");
            localStorage.removeItem("usersdatatoken");
            setLoginData(false);
            navigate("/login");
        }
    }
    useEffect(() => {
        DashboardValid();
    }, [])
    return (
            <div>
                <div className="flex justify-between items-center bg-primary p-5">
                    <h1 className="text-2xl text-white">
                        CARBON CREDIT MARKET PLACE
                    </h1>
                    <div className="bg-white py-2 px-5 rounded flex gap-1 items-center">
                        <i className="ri-shield-user-line"></i>
                        <span className="underline cursor-pointer" onClick={()=>navigate("/profile")}>
                        {logindata ? logindata.ValidUserOne.fname.toUpperCase() : ""}
                        </span>
                        <i className="ri-logout-box-r-line ml-10 cursor-pointer"
                           onClick={() => {logoutuser()}}></i>
                    </div>
                </div>
                <Routes>
                    <Route>
                        <Route path="/home" element={<Home />}/>
                        <Route path="/profile" element={<Profile />}/>
                    </Route>
                </Routes>             
            </div>
    );
}

export default Dashboard
