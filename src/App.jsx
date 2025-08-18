import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Use Routes and Route for routing
import Login from './pages/login/Login'; // Assuming Login is in the 'pages' folder
import Dashboard from './components/admin/dashboard/Dashboard'; // Import the Dashboard component
import AuthGuard from './auth/AuthGuard';  // Import the AuthGuard component

import Logout from './components/Logout '; // Include the Logout component
import NotFound from './components/NotFound'; // Include the Logout component
import Bookings from './components/admin/bookings/bookings';
import Enquiry from './components/admin/enquiry/enquiry';
import StudentList from './components/admin/studentList/studentList';
import PartnerList from './components/admin/partners/partnersList';
import BookAViewing from './components/admin/bookaviewing/BookAviewing';
import ActivityTracker from './components/auth/ActivityTracker';
import { useSelector } from 'react-redux';
import Protected from './components/auth/Protected';
import LoginProtected from "./components/auth/LoginProtected"
import EmailSender from './components/admin/email/EmailSender';
import RegisterForm from './components/admin/RegisterForm/RegisterForm';



const App = () => {
  let {userData}=useSelector((state)=>
    {
     
      return state.auth;
    });
 

  return (
    <StrictMode>
      <BrowserRouter>
        {/* Shared ToastContainer */}
        {/* <Toast /> */}


   
          {/* Define routes for both / and /login */}
          
         <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginProtected><Login /></LoginProtected>} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <Protected>
                <BookAViewing />
              </Protected>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          
         
          <Route
            path="/admin/logout"
            element={
              <Protected>
                <Logout />
              </Protected>
            }
          />
          <Route
            path="/admin/bookaviewing"
            element={
              <Protected>
                <BookAViewing />
              </Protected>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <Protected>
                <Bookings />
              </Protected>
            }
          />
          <Route
            path="/admin/enquiry"
            element={
              <Protected>
                <Enquiry />
              </Protected>
            }
          />

           <Route
            path="/add-user"
            element={
              <Protected>
                <RegisterForm />
              </Protected>
            }
          />
             <Route
            path="/email"
            element={
              <Protected>
                <EmailSender />
              </Protected>
            }
          />
          <Route
            path="/admin/students"
            element={
              <Protected>
                <StudentList />
              </Protected>
            }
          />
          <Route
            path="/admin/partners"
            element={
              <Protected>
                <PartnerList />
              </Protected>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Track activity if user is logged in */}
        {userData && <ActivityTracker />}
      
      </BrowserRouter>
    
    </StrictMode>
  );
};

export default App;
