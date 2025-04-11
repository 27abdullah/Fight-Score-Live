import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export default function UnauthenticatedRoute({ children }) {
    const { user, loading } = useUser();

    if (loading) return null; // or show a spinner
    if (user) return <Navigate to="/profile" />;

    return children;
}
