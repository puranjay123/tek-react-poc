
//import {header} from "../CSS/Header";
import { Link } from "react-router-dom";
import {Route,Routes,Navigate, BrowserRouter} from "react-router-dom/dist";
import Home from "./Home";
import '../CSS/Header.css';
export default function Header(){
    return(
        <div className="container">
           <div class="row g-3 p-3">
                <div class="col-5">
                     <h1 className="header">Resource Mapping</h1>       
                 </div>
                 <div class="col-7">
                 {/* <div class="input-group mb-3 p-2">
                        <input type="text" class="form-control" placeholder="Find the name" aria-label="Recipient's username" aria-describedby="button-addon2"/>
                        <button class="button-17 " type="button" id="button-addon2" >Search</button>
                </div> */}
                 
                </div>
            </div> 
            {/* <Home></Home> */}
         </div>
        
        
    )
}


