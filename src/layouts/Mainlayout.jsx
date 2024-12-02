import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar.jsx';

function Mainlayout(){
  return (
    <>
        <Navbar />
        <Outlet />
    </>
  );
}
export default Mainlayout;
