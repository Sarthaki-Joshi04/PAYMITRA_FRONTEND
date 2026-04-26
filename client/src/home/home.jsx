import React from 'react';
import logo from "../assets/icons/logo-ind.png"
import handBg from "../assets/icons/handhero3.png"
import iphone from "../assets/icons/phone.webp";
import decisions from "../assets/icons/decisions.png";

const ExpenseAIPage = () => {
    const NavLink = ({ children, href }) => (
        <a href={href} className="text-gray-600 hover:text-gray-900 transition duration-150 font-medium text-lg">
            {children}
        </a>
    );

    const Header = () => (
        <div className="pt-8 px-4 sm:px-6 lg:px-8 bg-[#f6f5f1]">
            <div className="max-w-6xl mx-auto bg-white rounded-[50px] shadow-sm px-8 py-4">
                <header className="flex justify-between items-center w-full flex-wrap gap-4">
                    <div className="flex items-center space-x-3">

                        <img src={logo} alt="logo" className='w-10' />

                        <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                            Pay <span className="font-semibold">Mitra</span>
                        </span>
                    </div>

                    <nav className="flex items-center space-x-6">
                        <div className="hidden md:flex space-x-8">
                            <NavLink href="#">Benefits</NavLink>
                            <NavLink href="#">Features</NavLink>
                            <NavLink href="#">How it works</NavLink>
                        </div>

                        <a
                            href="/app"
                            className="max-sm:hidden flex items-center space-x-2 bg-black text-white font-semibold py-3 px-6 rounded-full shadow-xl hover:bg-black transition-all  transform hover:scale-95"
                        >
                            <span>Go To App</span>
                        </a>
                    </nav>
                </header>
            </div>
        </div>
    );

    const HeroSection = () => (
        <main className="text-center pt-20 pb-0 px-4 sm:px-6 lg:px-8 bg-[#f6f5f1]">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-worksans font-semibold tracking-tighter text-gray-900 max-w-4xl mx-auto leading-none">
                Smarter Choices, <br /> Stronger Future
            </h1>

            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
                Experience a smarter, more sophisticated approach to personal finance. <br/>
               We empower you with refined insights designed for long-term stability and growth
            </p>

            <div className="mt-10">
                <a
                    href="/app"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-semibold rounded-full shadow-xl text-black bg-yellow-400 hover:bg-yellow-400 transition-all  transform hover:scale-95"
                >
                    Go To App
                </a>
            </div>


            <div className="flex justify-center items-center">

            <img src={handBg} alt="Hero" className='w-2/3'/>
            </div>

        </main>
    );

    /* ---------------------------- DECISION SECTION ---------------------------- */
    const DecisionSection = () => (
        <section className="max-w-[1200px] px-4 sm:px-6 lg:px-24 py-24 mx-auto bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-5xl font-semibold font-worksans text-gray-900 leading-tight">
                        Your Money <br /> Perfectly Organized
                    </h2>
                    <p className="mt-6 text-lg text-gray-600 max-w-md">
                        PayMitra makes managing your money simple and fun, helping you understand your expenses and make smarter financial choices.
                    </p>


                    <a href="/app" className="mt-10 inline-flex items-center bg-black text-white font-semibold py-3 px-6 rounded-full shadow-xl hover:bg-black transition-all  transform hover:scale-95">
                        Go To App
                    </a>
                </div>


                <div className="relative flex justify-center">
                    <div className="max-sm:w-4/5  w-full rounded-[40px] overflow-hidden shadow-xl bg-gray-200">
                        <img src={decisions} className="w-full h-full object-cover" />
                    </div>


                    <div className="absolute bottom-[-30px] lg:-left-20 lg:bottom-[30px] bg-white/90 border shadow-2xl rounded-2xl p-6 w-[300px]">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Products</h4>
                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex justify-between"><span>Cover</span><span>₦13,000.00</span></div>
                            <div className="flex justify-between"><span>French toast</span><span>₦5,200.00</span></div>
                            <div className="flex justify-between"><span>Tea infusion</span><span>₦0.00</span></div>
                            <div className="flex justify-between"><span>Crackers</span><span>₦0.00</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    /* ---------------------------- DARK HERO SECTION ---------------------------- */
    const DarkHero = () => (
        <section className="w-full bg-[#171706] text-white pt-24 px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-5xl  font-worksans lg:text-5xl font-semibold leading-tight">
                        Track smarter <br /> spend with purpose <br /> and stay financially stress-free.
                    </h2>
                    <p className="mt-6 text-lg text-gray-300 max-w-md">
                        See how you spend! Discover the easiest way to track your expenses.
                    </p>


                    <a href="#" className="mt-10 inline-flex items-center bg-yellow-400 text-black font-semibold py-3 px-8 rounded-full shadow-xl hover:bg-yellow-500 transition">
                        Download app
                    </a>
                </div>


                <div className="flex justify-center">
                    <img src={iphone} className="w-2/3" />
                </div>
            </div>
        </section>
    );


    /* -------------------------------- FOOTER -------------------------------- */
    const Footer = () => (
        <footer className="w-full bg-white py-12 px-6 border-t">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
                <div className="flex items-center space-x-3">
                    <img src={logo} alt="logo" className='w-10' />

                    <span className="text-xl font-semibold text-gray-900">PayMitra</span>
                </div>


                <div className="flex flex-wrap justify-center gap-6 text-gray-600 text-lg">
                    <a href="#" className="hover:text-black">Benefits</a>
                    <a href="#" className="hover:text-black">Features</a>
                    <a href="#" className="hover:text-black">Contact us</a>
                    <a href="#" className="hover:text-black">Privacy policy</a>
                    <a href="#" className="hover:text-black">Terms</a>
                </div>


                <div className="flex items-center space-x-6 text-2xl text-black">
                    <span>X</span>
                    <span>in</span>
                </div>
            </div>
        </footer>
    );

    return (
        <div className="min-h-screen  font-sans overflow-x-hidden">
            <Header />

            <HeroSection />
            <DecisionSection />
            <DarkHero />
            <Footer />
        </div>
    );
};

export default ExpenseAIPage;
