import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { Link,useNavigate} from "react-router-dom";
import { userDropdownItems } from '../data/navbarDropdown';
import {useDispatch} from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const dispatch=useDispatch();
  const navigate=useNavigate();


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
  function handleClick(event){
    
      event.preventDefault();
    if(event.target.title==="Logout"){
      dispatch(logout());
      navigate("/login",{replace:true});
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
