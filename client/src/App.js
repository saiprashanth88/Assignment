import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";

function App() {
    const user = localStorage.getItem("token");
    const navigate = useNavigate();
    if(!user){
        navigate("/login",{replace: true});
    }

    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;
