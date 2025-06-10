import { createContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (!error && session) {
                setUser(session.user);
                setToken(session.access_token);
            }
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user || null);
                setToken(session?.access_token || null);
            }
        );

        return () => listener?.subscription.unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, token }}>
            {children}
        </UserContext.Provider>
    );
}
