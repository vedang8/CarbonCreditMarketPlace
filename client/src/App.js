import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Error from "./pages/Error";
import Spinner from './components/Spinner';
import {useSelector} from "react-redux";
import {Routes, Route, BrowserRouter} from "react-router-dom"
function App() {
  const {loading} = useSelector(state=>state.loaders);
  return (
    <>
    {loading && <Spinner/>}
    <BrowserRouter> 
    <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/*" element={<Dashboard/>} />
        <Route path="/register" element={<Register/>} />   
        <Route path="*" element={<Error/>} />
      </Routes>
    </BrowserRouter> 
    </>
  );
}

export default App;//
