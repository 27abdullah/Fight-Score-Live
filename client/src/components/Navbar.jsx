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

    const navItems = (
        <>
            <Link to="/" onClick={handleNavClick}>
                <button className="px-4 py-2 text-left w-full">Home</button>
            </Link>
            <Link to="/rooms" onClick={handleNavClick}>
                <button className="px-4 py-2 text-left w-full">Rooms</button>
            </Link>
            <Link to="/about" onClick={handleNavClick}>
                <button className="px-4 py-2 text-left w-full">About</button>
            </Link>
            {!loading && !user && (
                <>
                    <Link to="/login" onClick={handleNavClick}>
                        <button className="px-4 py-2 text-left w-full">
                            Login
                        </button>
                    </Link>
                    <Link to="/signup" onClick={handleNavClick}>
                        <button className="px-4 py-2 text-left w-full">
                            Sign Up
                        </button>
                    </Link>
                </>
            )}
            {!loading && user && (
                <>
                    <Link to="/profile" onClick={handleNavClick}>
                        <button className="px-4 py-2 text-left w-full">
                            Profile
                        </button>
                    </Link>
                    <Link to="/create-room" onClick={handleNavClick}>
                        <button className="px-4 py-2 text-left w-full">
                            Create Room
                        </button>
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
            <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-white text-2xl"
                >
                    ☰
                </button>
                <div className="text-lg font-semibold">FSL</div>
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
