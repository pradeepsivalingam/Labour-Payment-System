import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/dashboard/dashboard';
import Header from './components/header/header';
import ForgotPassword from './components/forgot-password/forgotPassword';
import LogoutPage from './components/header/menuBar/logout';
import DailyWorkUpdate from './components/dashboard/dailyWorkUpdate'; 
import AdvancePayment from './components/dashboard/advancePayment';
import FoodExpenses from './components/dashboard/foodExpenses';
import LabourPayments from './components/dashboard/labourPayments';
import ManagerPayments from './components/dashboard/managerPayment';
import AccountPage from './components/header/menuBar/Account';
import LabourersDetails from './components/header/menuBar/labourersDetails';
import SettingsPage from './components/header/menuBar/setting';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/header" element={<Header />} />
        <Route path="/daily-work-update" element={<DailyWorkUpdate />} />
        <Route path="/advancePayment" element={<AdvancePayment />} />
        <Route path="/foodExpenses" element={<FoodExpenses />} />
        <Route path="/labourPayments" element={<LabourPayments />} />
        <Route path="/managerPayment" element={<ManagerPayments />} />
        <Route path="/Account" element={<AccountPage />} />
        <Route path="/labourersDetails" element={<LabourersDetails />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
