import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import CreateProject from "./components/project/CreateProject";
import MyProjects from "./components/project/MyProjects";
import FreelancerProfile from "./components/project/FreelancerProfile";
import AdminPanel from "./components/admin/AdminPanel";
import Navbar from "./components/layout/Navbar";
import Home from "./components/pages/Home";
import Footer from "./components/layout/Footer";
import ProjectList from "./components/project/ProjectList";
import MyBids from "./components/project/MyBids";
import './App.css';

function App() {
  return (
    <div className="">
      <Navbar />
      
      <main className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/my-projects" element={<MyProjects />} />
          <Route path="/freelancer/:id" element={<FreelancerProfile />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/my-bids" element={<MyBids />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
