// src/pages/seller/SellerTabs.jsx
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Layout from "../../../layout/Index";
import SellerDetails from "./SellerDetails";
import SellerTransactions from "./SellerTransactions";
import SellerWallet from "./SellerWallet";
import SellerOrders from "./SellerOrders";
import SellerReview from "./SellerReview";
import SellerEdit from "./SellerEdit";
import SellerProducts from "./SellerProducts";
import { useNavigate } from "react-router-dom";



function SellerTabs() {
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
        return <SellerDetails id={id} />;
      case "transactions":
        return <SellerTransactions sellerId={id} />;
      case "wallets":
        return <SellerWallet sellerId={id} />;
      case "orders":
        return <SellerOrders sellerId={id} />;
      case "Reviews":
        return <SellerReview sellerId={id} />;
      case "Edit":
        return <SellerEdit sellerId={id} />;
      case "Products":
        return <SellerProducts sellerId={id} />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mt-4  col-12" >
        <div className="d-flex  mb-2  col-12 justify-content-start align-items-center">
          <div className=" justify-content-end align-items-center " style={{ border: "" }}>
            <button className="btn btn-link " onClick={() => navigate("/admin/sellers")}
              style={{
                // textDecoration: "none",
                // color: "#007bff",
                display: "flex",
                alignItems: "center",
                // justifyContent: "center",
                width: "50px",
                height: "50px",
                fontWeight: "800",
                fontSize: "25px",
                background: "none",
                border: "none",
              }}
              title="Back to Seller List"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>
          <h4 className="ms-4 m-2">Seller Tabs (ID: {id})</h4>
        </div>
        <ul className="nav nav-tabs">
          {["details", "Edit", "transactions", "wallets", "orders", "Reviews", "Products"].map((tab) => (
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
      {/* <button
        className="btn btn-primary rounded- shadow position-fixed"
        style={{
          bottom: "45px", right: "20px", width: "50px", height: "50px", zIndex: 1000, display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => navigate("/admin/sellers")}
        title="Back to Seller List"
      >
        <i className="fas fa-arrow-left"></i>
      </button> */}

    </Layout>
  );
}

export default SellerTabs;
