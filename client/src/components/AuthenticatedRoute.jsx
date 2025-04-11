import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export default function AuthenticatedRoute({ children }) {
    const { user, loading } = useUser();

    if (loading) return null; // or show a spinner
    if (!user) return <Navigate to="/login" />;

    return children;
}
