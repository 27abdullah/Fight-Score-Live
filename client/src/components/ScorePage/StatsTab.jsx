import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";

export default function StatsTab({
    fighterA,
    fighterB,
    totalAVotes,
    totalBVotes,
    up,
    totalMedianDiff,
    socket,
    roomId,
    isMobile,
}) {
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState(null);
    const { user, loading } = useUser();

    useEffect(() => {
        const subscribed = sessionStorage.getItem(`${roomId}/subscribed`);
        if (subscribed) {
            setSubscribed(true);
            return;
        }

        if (loading) return;
        if (user?.email) {
            setEmail(user.email);
        }
    }, [user, loading]);

    function handleClick() {
        socket.current.emit("emailSubscribe", email, roomId);
        sessionStorage.setItem(`${roomId}/subscribed`, true);
        setSubscribed(true);
    }

    return (
        <div className="flex flex-row min-h-full items-stretch justify-between">
            <div>
                {`${fighterA} 📈 ${totalAVotes} votes`}
                <br />
                {`${fighterB} 📈 ${totalBVotes} votes`}
                <br />
                {totalMedianDiff != 0 &&
                    `${up} is up ${Math.abs(totalMedianDiff)} points!`}{" "}
            </div>
            <div>
                {!subscribed && email != null && (
                    <button
                        onClick={handleClick}
                        className={`text-lg p-1 bg-black/60 max-w-fit max-h-fit rounded-lg}`}
                    >
                        🔔
                    </button>
                )}
            </div>
        </div>
    );
}
