import { createContext, useContext, useState } from "react";
 
export const AuthContext =createContext()
 
export const useAuth=()=> useContext(AuthContext)
 
export default function AuthProvider({children}){
 
    const [isAutenticated,setAutenticated]=useState(false)
 
    const[username,setUserName]=useState(null)
 
    const[updateUserName,setUpdateUserName]=useState(null)
 
    function login(name,password){
        if (name === 'in28minutes' && password === 'dummy') {
            setUserName(name)
            setAutenticated(true)
            return true;
        }
        else {
            setUserName(null)
            setAutenticated(false)
            return false;
        }
    }
    function logout(){
        setAutenticated(false)
    }
    return(
        <AuthContext.Provider value={{isAutenticated,setAutenticated,login,logout,username,updateUserName,setUpdateUserName}}>
            {children}
        </AuthContext.Provider>
    )
}