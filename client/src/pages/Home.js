import React, { useContext} from 'react'
import { useSelector } from 'react-redux';
import { LoginContext } from '../components/Context';

const Home = () => {
    const {logindata, setLoginData} = useContext(LoginContext);
    const { user } = useSelector((state) => state.users);
    console.log("home page routed");
    return (
        
    <div>
        <h1>home</h1>
    </div>
  )
}

export default Home