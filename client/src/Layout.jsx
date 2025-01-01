import { Outlet } from "react-router-dom";
import { Navbar } from "./components/navbar";

export function Layout() {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <main className="flex-grow flex items-center justify-center">
                <Outlet />
            </main>
        </div>
    );
}
