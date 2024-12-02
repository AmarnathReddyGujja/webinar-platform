import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Mainlayout from './layouts/Mainlayout.jsx';
import HomePage from './Pages/HomePage.jsx';
import AddWebinar from './Components/AddWebinar.jsx';
import Webinars from './Components/Webinars.jsx';
import ContactUSPage from './Pages/ContactUSPage.jsx';
import Login from './Components/Login.jsx';
import Signup from './Components/Signup.jsx';
import Dashboard from './Components/Dashboard.jsx'; 
import { WebinarProvider } from './Components/WebinarContext.jsx';
import { AuthProvider } from './Components/AuthContext.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Mainlayout />}>
      <Route index element={<HomePage />} />
      <Route path='/AddWebinar' element={<AddWebinar />} />
      <Route path='/Webinars' element={<Webinars />} />
      <Route path='/ContactUS' element={<ContactUSPage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Route>
  )
);

const App = () => {
  return (
    <AuthProvider>
      <WebinarProvider>
        <RouterProvider router={router} />
      </WebinarProvider>
    </AuthProvider>
  );
};

export default App;
