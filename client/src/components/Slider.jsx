import React, { useState } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { Home, FileText, BarChart2, ChevronLeft, ChevronRight, BrainCircuit } from 'lucide-react';


import {
    FaHome,
    FaSearchDollar,
    FaCreditCard,
    FaChartLine,
    FaRobot,
    FaUniversity,
    FaCog,

    FaSignOutAlt,
    FaListUl,
    FaBars,
} from "react-icons/fa";

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    // const navigationItems = [
    //     { path: '/', icon: <Home size={24} />, label: 'Home' },
    //     { path: '/reports', icon: <FileText size={24} />, label: 'Reports' },
    //     { path: '/comparison', icon: <BarChart2 size={24} />, label: 'Comparison' },
    //     { path: '/differentBetweenModels', icon: <BrainCircuit size={24} />, label: 'Compare Model' },
    // ];

    const navItems = [
        { to: "/", label: "Dashboard", icon: <FaHome /> },
        { to: "/recommendation", label: "AI Advisor", icon: <FaRobot /> },
        { to: "/compare", label: "Compare Offers", icon: <FaSearchDollar /> },
        { to: "/cards", label: "Cards & Banks", icon: <FaCreditCard /> },
        { to: "/analytics", label: "Analytics", icon: <FaChartLine /> },
        { to: "/admin", label: "Admin Panel", icon: <FaUniversity /> },
        { to: "/settings", label: "Settings", icon: <FaCog /> },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div
            className={`h-screen bg-gray-800 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'
                }`}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    {!collapsed && <h1 className="text-xl font-bold">Dashboard</h1>}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-2 py-4 space-y-2">
                {navItems.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 mb-2 rounded-md hover:bg-white
                             hover:text-purple-700 transition 
                            ${isActive ? "bg-white dark:bg-[#252628] text-purple-700 font-semibold" : ""}
                             dark:text-white dark:hover:bg-[#2f3033] `
                        }
                    >
                        <span className="flex items-center justify-center">
                        {icon}
                        </span>
                        {!collapsed && <span className="ml-4">{label}</span>}
                    </NavLink>
                ))}
            </nav>

                {/* <nav className="flex-1 px-2 py-4">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${isActive(item.path)
                                    ? 'bg-purple-600 text-white'
                                    : 'hover:bg-gray-700'
                                }`}
                        >
                            <span className="flex items-center justify-center">
                                {item.icon}
                            </span>
                            {!collapsed && (
                                <span className="ml-4 text-sm font-medium">{item.label}</span>
                            )}
                        </Link>
                    ))}
                </nav> */}
            </div>
        </div>
    );
};

export default Sidebar;