import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import Logo from "../assets/logo.png";

export function Navbar() {
    const { user, loading } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const navRef = useRef(null);
    const navigate = useNavigate();

    const handleLogoClick = () => {
        setMenuOpen(false);
        navigate("/");
    };

    const logo = (
        <button
            onClick={handleLogoClick}
            className="p-0 bg-transparent border-none focus:outline-none hover:border-none focus:border-none focus-ring-0 transition-none"
        >
            <img src={Logo} className="h-16 w-auto pb-2 pt-3" />
        </button>
    );

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
        "font-industry_demi px-2 text-center text-zeus font-extrabold text-lg w-full hover:border-transparent hover:md:underline bg-transparent focus:outline-none";

    const leftItems = (
        <>
            <Link to="/rooms" onClick={handleNavClick}>
                <button className={buttonClass}>Rooms</button>
            </Link>
            <Link to="/about" onClick={handleNavClick}>
                <button className={buttonClass}>About</button>
            </Link>
            <Link to="/past-cards" onClick={handleNavClick}>
                <button className={buttonClass}>Past Cards</button>
            </Link>
        </>
    );

    const rightItems = (
        <>
            <Link to="/athletes" onClick={handleNavClick}>
                <button className={buttonClass}>Athletes</button>
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

            <div className="hidden md:grid grid-cols-5 items-center py-1 w-full mx-auto border-rich_carmine border-b-2">
                <div className="flex justify-end space-x-9 col-span-2">
                    {leftItems}
                </div>

                {/* Center logo */}
                <div className="flex justify-center">{logo}</div>

                {/* Right items (span 2 columns, align left) */}
                <div className="flex justify-start space-x-9 col-span-2">
                    {rightItems}
                </div>
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
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {logo}
                </div>

                {/* Spacer to balance layout */}
                <div className="w-5" />
            </div>

            {/* Slide-down mobile overlay */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-white border-rich_carmine border-b-2 z-40 overflow-hidden transition-all duration-300 ease-in-out ${
                    menuOpen ? "max-h-96 py-2" : "max-h-0"
                }`}
            >
                <div className="flex flex-col px-4 space-y-1 mb-2">
                    {leftItems}
                    {rightItems}
                </div>
            </div>
        </nav>
    );
}
