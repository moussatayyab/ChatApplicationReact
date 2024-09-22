import React from 'react';
import Header from "./pages/header/Header";
import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/auth/components/signup/Signup";
import SignIn from "./pages/auth/components/signin/Signin";

import ChatComponent from './pages/customer/components/chat/ChatComponent';
import Users from './pages/customer/components/view-users/Users';

function App() {

  return (
    <>
      <Header />
      <Routes>
        {/* auth */}
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        
        <Route path="/user/dashboard" element={<Users />} />

        <Route path="/user/chat" element={<ChatComponent />} />

      </Routes>
    </>
  );
}

export default App;
