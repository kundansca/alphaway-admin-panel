import React, { useState, useEffect } from "react";
import { apiRequestGet } from "../../../utils/ApiService";
import Layout from "../../../layout/Index";
import StatCard from "./StatCard ";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Card configuration - single source of truth
  // const cardConfigs = [
  //   {
  //     key: 'admin',
  //     title: 'Total Admins',
  //     icon: 'bi-person-gear',
  //     color: 'primary',
  //     link: '/admin/admins'
  //   },
  //   {
  //     key: 'seller',
  //     title: 'Total Sellers',
  //     icon: 'bi-people',
  //     color: 'warning',
  //     link: '/admin/sellers'
  //   },
  //   {
  //     key: 'customer',
  //     title: 'Total Customers',
  //     icon: 'bi-person',
  //     color: 'success',
  //     link: '/admin/customers'
  //   },
  //   {
  //     key: 'order',
  //     title: 'Total Orders',
  //     icon: 'bi-cart',
  //     color: 'primary',
  //     link: '/admin/orders'
  //   },
  //   {
  //     key: 'product',
  //     title: 'Total product',
  //     icon: 'bi-box',
  //     color: 'success',
  //     link: '/admin/product'
  //   },
  //   {
  //     key: 'pincode',
  //     title: 'Total Pincodes',
  //     icon: 'bi-geo-alt',
  //     color: 'info',
  //     link: '/admin/pincode'
  //   }
  // ];

  const fetchData = async () => {
    try {
      const response = await apiRequestGet(`/dashboard`);
      console.log(response);

      // Check if response exists and has data
      if (response && response.data) {
          setDashboardData(response.data);

        // // The API returns { data: [...] } structure
        // const apiData = response.data || [];
        // // Transform the array into an object with counts
        // const transformedData = {};
        // apiData.forEach(item => {
        //   transformedData[`${item.type}Count`] = item.count;
        // });
        // setDashboardData(transformedData);
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper function to calculate changes
  const getChangeData = (key) => {
    const value = Math.floor(Math.random() * 20) - 5;
    return { value, positive: value >= 0 };
  };

  return (
    <Layout>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Dashboard</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item active">Overview</li>
        </ol>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="row mb-4 g-3">
            {dashboardData.map((cardData) => {
              return (
                <StatCard
                  cardData={cardData}
                  loading={loading}
                />
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;