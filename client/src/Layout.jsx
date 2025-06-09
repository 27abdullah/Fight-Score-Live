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

    const overflow = location.pathname.includes("/score-page") // NOTE score-page is the only page that needs overflow hidden
        ? "overflow-hidden"
        : "";

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <FlashBar
                message={flashMessage?.message}
                type={flashMessage?.type}
            />
            <main
                className={`flex-grow flex flex-col ${overflow} items-center justify-center`}
            >
                <Outlet />
            </main>
        </div>
    );
}
