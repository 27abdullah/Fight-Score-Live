import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useUser } from "../hooks/useUser";

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
        "px-4 py-2 text-left w-full hover:border-transparent hover:md:border-blue-500";
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
        <nav ref={navRef} className="bg-gray-900 text-white w-full relative">
            {/* Desktop Navbar */}
            <div className="hidden sm:flex justify-center items-center py-4 space-x-4">
                {navItems}
            </div>

            {/* Mobile Navbar Header */}
            <div className="sm:hidden relative flex items-center justify-between px-4 py-3">
                {/* Hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-white text-2xl border-b border-black"
                >
                    ☰
                </button>

                {/* Centered Logo */}
                <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
                    FSL
                </div>

                {/* Spacer to balance layout */}
                <div className="w-6" />
            </div>

            {/* Slide-down mobile overlay */}
            <div
                className={`sm:hidden absolute top-full left-0 w-full bg-gray-900 z-40 overflow-hidden transition-all duration-300 ease-in-out ${
                    menuOpen ? "max-h-96 py-2" : "max-h-0"
                }`}
            >
                <div className="flex flex-col px-4 space-y-1">{navItems}</div>
            </div>
        </nav>
    );
}
