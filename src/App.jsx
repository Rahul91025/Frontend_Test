import React from 'react'

import Home from './Pages/Home'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Collection from './Pages/Collection'
import Product from './Pages/Product'
import Cart from './Pages/Cart'
import Login from './Pages/Login'
import PlaceOrder from './Pages/PlaceOrder'
import Order from './Pages/Order'
import { Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import SearchBar from './Components/SearchBar';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Verify from './Pages/Verify';
import AccountPage from './Pages/Profile'
import AddressList from './Pages/AddressPage'

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/profile" element={<AccountPage />} />
        <Route path='/address' element={<AddressList/> } />
      </Routes>
      <Footer />
    </div>
  );
}

export default App
