import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { FlashBar } from "./components/FlashBar";
import { useEffect, useState } from "react";

export function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [flashMessage, setFlashMessage] = useState(null);

    useEffect(() => {
        if (location.state?.flashMessage) {
            setFlashMessage(location.state.flashMessage);

            const timeout = setTimeout(() => {
                setFlashMessage(null);
                navigate(location.pathname, { replace: true, state: {} });
            }, 1800);

            return () => {
                clearTimeout(timeout);
                setFlashMessage(null);
                navigate(location.pathname, { replace: true, state: {} });
            };
        }
    }, [location, navigate]);

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <FlashBar
                message={flashMessage?.message}
                type={flashMessage?.type}
            />
            <main className="flex-grow flex flex-col overflow-hidden items-center justify-center">
                <Outlet />
            </main>
        </div>
    );
}
