import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import "./Index.css";

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className={`main-layout has-sidebar fixed-sidebar fixed-header ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="layout">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="content">
          <div className={`main-content-area ${sidebarCollapsed ? 'sidebar-collapsed-content' : ''}`}>
            <main>{children}</main>
            <ToastContainer position="top-right" autoClose={30} />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;