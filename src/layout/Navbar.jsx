import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { Link,useNavigate} from "react-router-dom";
import { userDropdownItems } from '../data/navbarDropdown';
import {useDispatch, useSelector} from "react-redux";
import { logout } from "../features/auth/authSlice";
import Swal from "sweetalert2";
import axios from "axios";


const Navbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const BASEURL = import.meta.env.VITE_APP_BASE_API_URL;
  const authData = useSelector((state) => state.auth);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
 async function sendLogoutRequest() {
  try {
    const response = await axios.post(
      `${BASEURL}/auth/logout`,
       {},
      {
        headers: {
         Authorization: `Bearer ${authData.userData.accessToken}`,
        },
      }
    );
   

    if (response.status === 200) {
      return true; 
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Logout failed! Please try again.",
        showConfirmButton: false,
        timer: 3000,
      });
      return false;
    }
  } catch (error) {

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "Something went wrong!",
      showConfirmButton: false,
      timer: 3000,
    });
    return false;
  }
}
  async function handleClick(event){
    
      event.preventDefault();
    if(event.target.title==="Logout"){
      let islogout= await sendLogoutRequest();
       if(islogout===true){
      dispatch(logout());
      navigate("/login",{replace:true});
       }
     }

  }

  return (
    <header className="top-navbar">
      <div className="navbar-container">
        <Link
          id="btn-toggle"
          className="sidebar-toggler break-point-sm"
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
        >
          <i className="ri-menu-line ri-xl"></i>
        </Link>
      </div>

      {/* <div className="navbar-center">
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <button className="search-button" aria-label="Search">
            <i className="ri-search-line"></i>
          </button>
        </div>
      </div> */}

      {/* <div className="navbar-center">
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <button className="search-button" aria-label="Search">
            <i className="ri-search-line"></i>
          </button>
        </div>
      </div> */}

      <div className="navbar-right">
        <div className="user-dropdown" ref={dropdownRef}>
          <Link
            className="user-button"
            aria-label="User menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Profile"
          >
            <i className="ri-user-fill"></i>
          </Link>
          <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
            {userDropdownItems.map((item, index) => (
              <Link key={index} to={item.path} className="dropdown-item" title={item.name} onClick={handleClick}>
                <i className={item.icon}></i> {item.name}
              </Link>
            ))}
          
          </div>
        </div>
    
      </div>
      
    </header>
  );
};

export default React.memo(Navbar);
