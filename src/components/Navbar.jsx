import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import Search from './Search';
import { useSelector } from "react-redux";

function Navbar() {
    const user = JSON.parse(localStorage.getItem('users'));
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart);
    const logout = () => {
        localStorage.removeItem('users'); // Correctly removing the user data
        navigate("/login");
    };

    const navList = (
        <ul className="flex space-x-3 text-white font-medium text-md px-5">
            {/* Home */}
            <li>
                <Link to="/">Home</Link>
            </li>
            {/* All Products */}
            <li>
                <Link to="/allproduct">All Products</Link>
            </li>
            {/* Signup */}
            {!user && (
                <li>
                    <Link to="/signup">Signup</Link>
                </li>
            )}
            {/* Login */}
            {!user && (
                <li>
                    <Link to="/login">Login</Link>
                </li>
            )}
            {/* User Dashboard */}
            {user?.role === "user" && (
                <li>
                    <Link to="/user-dashboard">{user?.name}</Link>
                </li>
            )}
            {/* Admin Dashboard */}
            {user?.role === "admin" && (
                <li>
                    <Link to="/admin-dashboard">{user?.name}</Link>
                </li>
            )}
            {/* Logout */}
            {user && (
                <li className="cursor-pointer" onClick={logout}>
                    Logout
                </li>
            )}
            {/* Cart */}
            <li>
            <Link to={'/cart'}>
                    Cart({cartItems.length})
                </Link>
            </li>
        </ul>
    );

    return (
        <nav className="bg-pink-600 sticky top-0">
            <div className="lg:flex lg:justify-between items-center py-3 lg:px-3">
                {/* Left side - Logo */}
                <div className='left py-3 lg:py-0'>
                    <Link to="/">
                        <h2 className='font-bold text-white text-2xl text-center'>E-Bharat</h2>
                    </Link>
                </div>

                {/* Right side - Navigation Links */}
                <div className="right flex justify-center mb-4 lg:mb-0">
                    {navList}
                </div>

                {/* Search Component */}
                <div className="lg:flex lg:justify-center">
                    <Search />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
