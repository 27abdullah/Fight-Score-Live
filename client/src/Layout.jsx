import { Outlet } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { FlashBar } from "./components/FlashBar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function Layout() {
    const location = useLocation();
    const [flashMessage, setFlashMessage] = useState(null);

    useEffect(() => {
        if (location.state?.flashMessage) {
            setFlashMessage(location.state.flashMessage);
            const timeout = setTimeout(() => {
                setFlashMessage(null);
            }, 2500);
            return () => {
                clearTimeout(timeout);
                setFlashMessage(null);
            };
        }
    }, [location]);

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <FlashBar
                message={flashMessage?.message}
                type={flashMessage?.type}
            />
            <main className="flex-grow flex items-center justify-center">
                <Outlet />
            </main>
        </div>
    );
}
