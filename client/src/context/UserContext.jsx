import { createContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On mount, get the session
        supabase.auth.getUser().then(({ data: { user }, error }) => {
            if (!error) setUser(user);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user || null);
            }
        );

        return () => listener?.subscription.unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
}
