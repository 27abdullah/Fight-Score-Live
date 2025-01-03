import { Link } from "react-router-dom";

export function Navbar() {
    return (
        <nav className="flex items-center justify-center px-4 pt-4">
            <div className="flex space-x-4">
                <Link to="/">
                    <button className="px-4 pt-2 ">Home</button>
                </Link>
                <Link to="/score-page">
                    <button className="px-4 pt-2 ">ScorePage</button>
                </Link>
                <Link to="/about">
                    <button className="px-4 pt-2">About</button>
                </Link>
            </div>
        </nav>
    );
}
