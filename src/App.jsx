import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Use Routes and Route for routing
// import Toast from './components/shared/Toast';
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import Login from './pages/Login'; // Assuming Login is in the 'pages' folder
import Dashboard from './components/admin/dashboard/Dashboard'; // Import the Dashboard component
import AuthGuard from './auth/AuthGuard';  // Import the AuthGuard component

import Pincode from './components/admin/pincode/Pincode';  // Import the Pincode component


import Product from './components/admin/product/Product';  // Import the Product component
// import CreateProduct from './components/admin/product/CreateProduct';  // Import the Product component

import Admin from './components/admin/admin/Admin';  // Import the Admin component


import Seller from './components/admin/seller/Seller';  // Import the Seller component
import SellerTabs from "./components/admin/seller/SellerTabs";
import SellerAdd from './components/admin/seller/SellerAdd';

import Category from './components/admin/category/Category';  // Import the Category component


import Customer from './components/admin/customer/Customer';  // Import the Customer component
import CustomerTabs from "./components/admin/customer/CustomerTabs";
// import CustomerEdit from "./components/admin/customer/CustomerEdit";

import Order from './components/admin/order/Order';  // Import the Order component

import Brand from './components/admin/brand/Brand';  // Import the Brand component

import Attribute from './components/admin/attribute/ProductAttribute';  // Import the attribute component

import Offer from './components/admin/offer/Offer';  // Import the Offer component

import Profile from './components/admin/profile/Profile';  // Import the Profile component

import Logout from './components/Logout '; // Include the Logout component
import NotFound from './components/NotFound'; // Include the Logout component
import ProductTabs from './components/admin/product/ProductTabs';
// import BookViewing from './components/admin/bookaviewing/bookAviewing';
import Bookings from './components/admin/bookings/bookings';
import Enquiry from './components/admin/enquiry/enquiry';
import StudentList from './components/admin/studentList/studentList';
import PartnerList from './components/admin/partners/partnersList';
import EnquiryViewDetails from './components/admin/enquiry/EnquiryViewDetails';
import BookAViewing from './components/admin/bookaviewing/BookAviewing';

const App = () => {

  return (
    <StrictMode>
      <BrowserRouter>
        {/* Shared ToastContainer */}
        {/* <Toast /> */}


        <Routes>
          {/* Define routes for both / and /login */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route element={<AuthGuard />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/admins" element={<Admin />} />


            <Route path="/admin/category" element={<Category />} />
            <Route path="/admin/bookaviewing" element={<BookAViewing />} />
            <Route path="/admin/bookings" element={<Bookings />} />
            <Route path="/admin/enquiry" element={<Enquiry />} />
             <Route path="/admin/enquiry/:id" element={<EnquiryViewDetails />} />
            <Route path="/admin/students" element={<StudentList />} />
            <Route path="/admin/partners" element={<PartnerList />} />
            <Route path="/admin/sellers" element={<Seller />} />
            <Route path="/seller/:id" element={<SellerTabs />}  />
            <Route path="/admin/sellers/add" element={<SellerAdd />} />


            <Route path="/admin/customers" element={<Customer />} />
            <Route path="/customer/:id" element={<CustomerTabs />} />


            <Route path="/admin/orders" element={<Order />} />
            <Route path="/admin/sellerOrder" element={<Order />} />
            <Route path="/admin/customerOrder" element={<Order />} />

            <Route path="/admin/pincode" element={<Pincode />} />


            <Route path="/admin/product" element={<Product />} />
            {/* <Route path="/admin/product/createproduct" element={<CreateProduct />} /> */}
            <Route path="/product/:id" element={<ProductTabs />} />

            <Route path="/admin/brand" element={<Brand />} />

            <Route path="/admin/attribute" element={<Attribute />} />

            <Route path="/admin/offer" element={<Offer />} />



            <Route path="/admin/profile" element={<Profile />} />

            <Route path="/admin/logout" element={<Logout />} />
          </Route>

          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
};

export default App;
