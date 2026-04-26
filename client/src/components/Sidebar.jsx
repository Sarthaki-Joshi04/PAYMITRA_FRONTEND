// src/components/Sidebar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, BarChart2, ChevronLeft, ChevronRight, BrainCircuit, Users, GitCompare, BarChart3, Lightbulb, Settings } from 'lucide-react';


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
    FaBalanceScale
} from "react-icons/fa";





const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    
    // const navItems = [
    //     { to: "/", label: "Dashboard", icon: <FaHome /> },
    //     { to: "/cards", label: "Configuration", icon: <FaCog /> },
    //     { to: "/compare", label: "Compare", icon: <FaBalanceScale /> },
    //     { to: "/analytics", label: "Analytics", icon: <FaChartLine /> },
    //     // { to: "/recommendation", label: "Compare", icon: <FaRobot /> },
    //     { to: "/keyinsights", label: "Key Insights", icon: <FaUniversity /> },
    //     { to: "/settings", label: "Settings", icon: <FaCog /> },
    // ];

    const navItems = [
        { to: "/app", label: "Dashboard", icon: <Home size={20} /> },

        { to: "/advisor", label: "AI Advisor", icon: <GitCompare size={20} /> },
        { to: "/upload", label: "Spending Tracker", icon: <BarChart3 size={20} /> },

        { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
    ];

    const isActive = (path) => location.pathname === path;


    const navigationItems = [
        { path: '/', icon: <Home size={24} />, label: 'Home' },
        { path: '/reports', icon: <FileText size={24} />, label: 'Reports' },
        { path: '/comparison', icon: <BarChart2 size={24} />, label: 'Comparison' },
        { path: '/differentBetweenModels', icon: <BrainCircuit size={24} />, label: 'Compare Model' },
    ];



    return (
        // <div className={`h-screen transition-all duration-300 ${collapsed ? "w-20" : "w-64 max-sm:w-screen"} bg-[#101322] text-white flex flex-col dark:bg-[#0c0d0f] `}>
        <div className={` h-screen transition-all duration-300 ${collapsed ? "w-20" : "w-60 max-sm:w-screen"} bg-[#080a13] text-white flex flex-col dark:bg-[#0c0d0f] `}>
            {/* <div className={`h-screen transition-all duration-300 ${collapsed ? "w-20" : "w-64"} bg-gradient-to-b from-purple-700 to-pink-500 text-white flex flex-col`}> */}

            {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    {!collapsed && <h1 className="text-xl font-bold">Dashboard</h1>}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-2">
                {navItems.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 mb-2 rounded-md 

                            ${isActive ? "bg-white/90 dark:bg-[#252628] text-black font-semibold" : "hover:bg-white/15"}
                             dark:text-white dark:hover:bg-[#2f3033] `
                        }
                    >
                        <span className="flex items-center justify-center">
                        {icon}
                        </span>
                        {!collapsed && <span className="ml-2">{label}</span>}
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
                            <span className="ml-4 text-sm font-medium ">{item.label}</span>
                        )}
                    </Link>
                ))}
            </nav> */}

            {/* Logout */}
            <div className="p-4 border-t border-white/20">
                <button className="flex items-center gap-3 p-3 rounded-md w-full hover:bg-white hover:text-purple-700 transition">
                    <FaSignOutAlt />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
