import logo from './logo.svg';
import './App.css';
import React, { useContext, useEffect, useState, } from 'react';
import { AuthContext } from './utils/auth';
import { useAuth } from './utils/auth';
import { Routes, Route, Router, Navigate, Link  } from "react-router-dom";
import Login from './components/login/Login';
import Profile from './components/profile/Profile';
import OthersProfile from './components/profile/OthersProfile';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

export default function App() {
  const { isAuthenticated, refresh, couldBeAuthenticated } = useAuth();
  
 
  useEffect(() => {
    refresh()
  }, [true])

  if (isAuthenticated()) {
    return (
      <div className="App">
        <header className="App-header">
          <Routes >
            <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:username" element={<OthersProfile/>} />
          </Routes> 
        </header>
      </div>
    )
  }
  else if (couldBeAuthenticated()) {
    return (
      <div className="App">
        <header className="App-header">
          <div >
          couldBeAuthenticated
          </div>
        </header>
      </div>
    )
  }
  else {
    return (
      <div className="App">
         
          <div >
          <div className="auth-wrapper">
          <div className="auth-inner">
          <Routes >
            <Route exact path="/login" element={<Login />} />
            <Route path="*" element={<Navigate replace to="/login" />} />
          </Routes>
          </div>
          </div>
          </div>
       
      </div>
    )
  }
}

