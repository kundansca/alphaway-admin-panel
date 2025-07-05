import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Layout from "../../../layout/Index";
import ProductDetails from "./ProductDetails";
import ProductReviews from "./ProductReviews";
import ProductEdit from "./ProductEdit";
// import { apiRequestGet } from "../../../utils/ApiService"; // 🔁 Replaced with static data
// import config from "../../../config/config";



function ProductTabs() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "details";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const navigate = useNavigate();

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return <ProductDetails id={id} />;
      case "edit":
        return <ProductEdit productId={id} />;
      // return <div>Edit Product Form</div>; // Placeholder for ProductEdit
      case "reviews":
        return <ProductReviews productId={id} />;
      default:
        return null;
    }
  };

  return (
    <Layout hideFooter>
      <div className="container mt-3">
        <div className="d-flex mb-3 align-items-center">
          <button
            className="btn btn-link"
            onClick={() => navigate("/admin/product")}
            style={{
              textDecoration: "none",
              color: "#007bff",
              fontSize: "20px",
              cursor: "pointer",
            }}
            title="Back to Product List"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h4 className="ms-2">Product Tabs (ID: {id})</h4>
        </div>

        <ul className="nav nav-tabs">
          {["details", "edit", "reviews"].map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
        <div className="tab-content border p-10">{renderTabContent()}</div>
      </div>
    </Layout>
  );
}

export default ProductTabs;
