import {Route,Routes,Navigate, BrowserRouter} from "react-router-dom";
import Home from "./Home";
import Header from "./Header";
import AuthProvider from "../security/AuthContext";
export default function Navbar(){
    return(
        <div className="Navbar">
            <AuthProvider>
            <BrowserRouter>
            <Header/>
            {/* <Routes>
                 <Route path='/home' element={<Home/>}></Route> 
                 <Route path='/home' element={<Header/>}></Route> 
            </Routes> */}
            <Home></Home>
            </BrowserRouter>
            </AuthProvider>
        </div>
    )
}