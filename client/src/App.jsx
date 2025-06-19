import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ScorePage } from "./pages/ScorePage";
import { Home } from "./pages/Home";
import { Layout } from "./Layout";
import About from "./pages/About";
import Rooms from "./pages/Rooms";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CreateRoom from "./pages/CreateRoom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import HostRoom from "./pages/HostRoom";
import PastCards from "./pages/PastCards";

export function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/score-page/:id"
                            element={
                                <AuthenticatedRoute>
                                    <ScorePage />
                                </AuthenticatedRoute>
                            }
                        />
                        <Route path="/about" element={<About />} />
                        <Route path="/rooms" element={<Rooms />} />
                        <Route
                            path="/signup"
                            element={
                                <UnauthenticatedRoute>
                                    <SignUp />
                                </UnauthenticatedRoute>
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <UnauthenticatedRoute>
                                    <Login />
                                </UnauthenticatedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <AuthenticatedRoute>
                                    <Profile />
                                </AuthenticatedRoute>
                            }
                        />
                        <Route
                            path="/create-room"
                            element={
                                <AuthenticatedRoute>
                                    <CreateRoom />
                                </AuthenticatedRoute>
                            }
                        />
                        <Route
                            path="/host-room/:id"
                            element={
                                <AuthenticatedRoute>
                                    <HostRoom />
                                </AuthenticatedRoute>
                            }
                        />
                        <Route path="/past-cards/" element={<PastCards />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}

export default App;
