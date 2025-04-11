import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export function Navbar() {
    const { user, loading } = useUser();

    return (
        <nav className="flex items-center justify-center px-4 pt-4 pb-10">
            <div className="flex space-x-4">
                <Link to="/">
                    <button className="px-4 pt-2">Home</button>
                </Link>
                <Link to="/rooms">
                    <button className="px-4 pt-2">Rooms</button>
                </Link>
                <Link to="/about">
                    <button className="px-4 pt-2">About</button>
                </Link>

                {!loading && !user && (
                    <>
                        <Link to="/login">
                            <button className="px-4 pt-2">Login</button>
                        </Link>
                        <Link to="/signup">
                            <button className="px-4 pt-2">Sign Up</button>
                        </Link>
                    </>
                )}

                {!loading && user && (
                    <Link to="/profile">
                        <button className="px-4 pt-2">Profile</button>
                    </Link>
                )}
            </div>
        </nav>
    );
}
