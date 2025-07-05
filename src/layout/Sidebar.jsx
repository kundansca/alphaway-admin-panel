import React, { useState, useEffect, useRef } from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { sidebarNavigation } from '../data/sidebarNav';
import iconImg from '../assets/img/logo/circleLogo.png'; // Update path as needed
import iconTextImg from '../assets/img/logo/alphaway_logo.png'; // Update path as needed

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const sidebarRef = useRef(null);
  const submenuRef = useRef(null);




  const toggleSubmenu = (menuName) => {
    setOpenSubmenu(prev => (prev === menuName ? null : menuName));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        collapsed && // Only close popover when sidebar is collapsed (desktop popover)
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        (!submenuRef.current || !submenuRef.current.contains(event.target))
      ) {
        setOpenSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [collapsed, openSubmenu]); // isMobile removed from dependencies

  useEffect(() => {
    // Always close any open submenus when the route changes.
    setOpenSubmenu(null);
  }, [location.pathname]);

  return (
    <aside
      id="sidebar"
      className={`sidebar break-point-sm has-bg-image ${collapsed ? 'collapsed' : ''}`}
      ref={sidebarRef}
    >
      {/* Sidebar Collapser / Toggle Button */}
      <Link
        id="btn-collapse"
        className="sidebar-collapser"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={toggleSidebar}
      >
        <i className={`ri-arrow-${collapsed ? 'right' : 'left'}-s-line`}></i>

      </Link>

      <div className="sidebar-layout" >
        <div className="sidebar-header">
          <div className="pro-sidebar-logo">
            <img
              src={iconImg}
              alt="ILB Logo"
              className={`logo-icon ${collapsed ? '' : 'hidden'}`}
            />
            <img
              src={iconTextImg}
              alt="Indian Local Bazar"
              className={`logo-text ${collapsed ? 'hidden' : ''}`}
            />
          </div>
        </div>
        <div className="sidebar-content">
          <nav className="menu open-current-submenu">
            <ul>
              {sidebarNavigation.map((item, index) => (
                item.type === "header" ? (
                  <li key={index} className="menu-header">
                    <span>{item.text}</span>
                  </li>
                ) : item.submenu ? (
                  <li
                    key={index}
                    className={`menu-item sub-menu ${openSubmenu === item.name.toLowerCase() ? 'open' : ''}`}
                    data-title={item.name}
                    title={item.name}
                  >
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSubmenu(item.name.toLowerCase());
                      }}
                      className={openSubmenu === item.name.toLowerCase() ? 'active' : ''}
                    >
                      <span className="menu-icon"><i className={item.icon}></i></span>
                      {!collapsed && <span className="menu-title">{item.name}</span>}
                      {!collapsed && (
                        <i className={`ri-arrow-down-s-line submenu-arrow ${openSubmenu === item.name.toLowerCase() ? 'rotate' : ''}`}></i>
                      )}
                    </Link>

                    {/* Submenu List */}
                    <div
                      className={`sub-menu-list ${openSubmenu === item.name.toLowerCase() ? 'open' : ''}`}
                      ref={collapsed ? submenuRef : null}
                    >
                      <ul>
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex} className="menu-item" title={subItem.name}>
                            <Link to={subItem.path}>{subItem.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={index} className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                    data-title={item.name} title={item.name}
                  >
                    <Link to={item.path}>
                      <i className={`${item.icon} menu-icon`}></i>
                      {!collapsed && <span className="menu-title">{item.name}</span>}
                    </Link>
                  </li>
                )
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
};
export default React.memo(Sidebar);

