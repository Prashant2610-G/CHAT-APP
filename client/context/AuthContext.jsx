import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children })=>{
 
   const [token, setToken] = useState(localStorage.getItem("token"));
   const [authUser, setAuthUser] = useState(null);
   const [onlineUsers, setOnlineUsers] = useState([]);
   const [socket, setSocket] = useState(null);

   // Check if the user is authenticated and if so, set data and connect the socket

   const checkAuth = async () => {
    try {
       const { data } = await axios.get("/api/auth/check");
       if (data.success) {
         setAuthUser(data.user)
          connectSocket(data.user);
         }
    } catch (error) {
        toast.error(error.message)
    }
   }

   // Login function to handle user authentication and socket connection
    const login = async (state, Credentials) => {
      try {
        console.log("Logging in with state:", state, "and credentials:", Credentials);
        
           const { data } = await axios.post(`/api/auth/${state}`, Credentials);
           console.log("Login response:", data);

           if (data.success) {
            setAuthUser(data.userData);
            console.log("User data received:", data.userData);
            connectSocket(data.userData);

            axios.defaults.headers.common["token"] = data.token;

            console.log("Token in axios headers:", data.token); 
            setToken(data.token);

            console.log("Token in state:", token);

            localStorage.setItem("token", data.token);
            console.log("Token stored in localStorage:", localStorage.getItem("token"));
            toast.success(data.message);
           }else{
            console.log("Login failed:", data.message);
            toast.error(data.message);
           }
      } catch (error) {
        console.error("Error during login:", error);
        toast.error(error.message);
      }
    }

    // Logout function to handle user logout and socket disconnection 
      const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully");
        socket.disconnect();
      }

     // Update profile function to handle user profile updates

    const updateProfile = async (body)=>{
      try {
         const { data } = await axios.put("/api/auth/update-profile", body);
         if (data.success) {
          setAuthUser(data.user);
          toast.success("Profile updated successfully");
          return true;
         }
      } catch (error) {
          toast.error(error.message)
      }
    }
   // Connect socket function to handle socket connection and online updateds
   const connectSocket = (userData) => {
      if (!userData || socket?.connected)
        {
          console.warn("Socket already connected or user data is not available");
          return;
        } 

          const newSocket = io(backendUrl, {
        query: {
          userId: userData._id,
        }
      });
      newSocket.connect();
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (userIds)=>{
          setOnlineUsers(userIds);
      })
   }


   useEffect(()=> {
    if (token){
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
   },[])

  const value = {
     axios,
     authUser,
     onlineUsers,
     socket,
     login,
     logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
    {children}
    </AuthContext.Provider>
  )

}