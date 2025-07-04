import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import Logo from "../assets/logo_b.svg?react";

export function Navbar() {
    const { user, loading } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const navRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    // Close menu on link click
    const handleNavClick = () => {
        setMenuOpen(false);
    };

    const buttonClass =
        "px-4 text-center text-zeus font-extrabold text-md w-full hover:border-transparent hover:md:underline bg-transparent focus:outline-none";
    const navItems = (
        <>
            <Link to="/" onClick={handleNavClick}>
                <button className={buttonClass}>Home</button>
            </Link>
            <Link to="/rooms" onClick={handleNavClick}>
                <button className={buttonClass}>Rooms</button>
            </Link>
            <Link to="/about" onClick={handleNavClick}>
                <button className={buttonClass}>About</button>
            </Link>
            <Link to="/past-cards" onClick={handleNavClick}>
                <button className={buttonClass}>Past Cards</button>
            </Link>
            {!loading && !user && (
                <>
                    <Link to="/login" onClick={handleNavClick}>
                        <button className={buttonClass}>Login</button>
                    </Link>
                    <Link to="/signup" onClick={handleNavClick}>
                        <button className={buttonClass}>Sign Up</button>
                    </Link>
                </>
            )}
            {!loading && user && (
                <>
                    <Link to="/profile" onClick={handleNavClick}>
                        <button className={buttonClass}>Profile</button>
                    </Link>
                    <Link to="/create-room" onClick={handleNavClick}>
                        <button className={buttonClass}>Create Room</button>
                    </Link>
                </>
            )}
        </>
    );

    return (
        <nav ref={navRef} className="bg-white w-full relative">
            {/* Desktop Navbar */}
            <div className="hidden md:flex justify-center items-center space-x-4 py-1">
                {navItems}
            </div>

            {/* Mobile Navbar Header */}
            <div className="md:hidden relative flex items-center justify-between px-4 py-3">
                {/* Hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={`text-2xl border-b p-1 rounded-2xl ${
                        menuOpen ? "text-rich_carmine" : ""
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>

                {/* Centered Logo */}
                <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
                    <Logo className="h-40 w-40" />
                </div>

                {/* Spacer to balance layout */}
                <div className="w-6" />
            </div>

            {/* Slide-down mobile overlay */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-white z-40 overflow-hidden transition-all duration-300 ease-in-out ${
                    menuOpen ? "max-h-96 py-2" : "max-h-0"
                }`}
            >
                <div className="flex flex-col px-4 space-y-1 mb-2">
                    {navItems}
                </div>
            </div>
        </nav>
    );
}
