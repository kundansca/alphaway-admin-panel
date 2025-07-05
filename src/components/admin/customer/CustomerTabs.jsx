// src/pages/customer/CustomerTabs.jsx

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Layout from "../../../layout/Index";
import CustomerEdit from "./CustomerEdit";
import CustomerDetails from "./CustomerDetails";
import CustomerOrders from "./CustomerOrders";
import CustomerTransactions from "./CustomerTransactions";
import CustomerWallet from "./CustomerWallet";
import CustomerWishlist from "./CustomerWishlist";
import { useNavigate } from "react-router-dom";
// import CustomerProducts from "./CustomerProducts";


function CustomerTabs() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "details";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab]);
  const navigate = useNavigate();
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return <CustomerDetails id={id} />;
      case "transactions":
        return <CustomerTransactions customerId={id} />;
      case "wallets":
        return <CustomerWallet customerId={id} />;
      case "orders":
        return <CustomerOrders customerId={id} />;
      case "edit":
        return <CustomerEdit id={id} />;
      case "wishlist":
        return <CustomerWishlist id={id} />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <div className="d-flex  mb-2  col-12 justify-content-start align-items-center" >
          <div className="justify-content-end align-items-center " style={{ border: " " }}>
            <button className="btn btn-link " onClick={() => navigate("/admin/customers")}
              style={{
                textDecoration: "none",
                color: "#007bff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "50px",
                // height: "50px",
                // fontWeight: "800",
                fontSize: "25px",
                // background: "none",
                // border: "none",
                cursor: "pointer",
              }}
              title="Back to Customer List"
            >
              <span className="visually-hidden">Back</span>
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>
          <h4 className="">Customer Tabs (ID: {id})</h4>
        </div>
        <ul className="nav nav-tabs">
          {["details", "edit","transactions", "wallets", "orders", "wishlist"].map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content border p-3">{renderTabContent()}</div>
      </div>
    </Layout>
  );
};

export default CustomerTabs;
