import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Use Routes and Route for routing
import Login from './pages/Login'; // Assuming Login is in the 'pages' folder
import Dashboard from './components/admin/dashboard/Dashboard'; // Import the Dashboard component
import AuthGuard from './auth/AuthGuard';  // Import the AuthGuard component

import Logout from './components/Logout '; // Include the Logout component
import NotFound from './components/NotFound'; // Include the Logout component
import Bookings from './components/admin/bookings/bookings';
import Enquiry from './components/admin/enquiry/enquiry';
import StudentList from './components/admin/studentList/studentList';
import PartnerList from './components/admin/partners/partnersList';
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
            <Route path="/admin/logout" element={<Logout />} />
            <Route path="/admin/bookaviewing" element={<BookAViewing />} />
            <Route path="/admin/bookings" element={<Bookings />} />
            <Route path="/admin/enquiry" element={<Enquiry />} />
            <Route path="/admin/students" element={<StudentList />} />
            <Route path="/admin/partners" element={<PartnerList />} />
          </Route>

          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
};

export default App;
