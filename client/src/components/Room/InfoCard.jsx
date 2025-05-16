import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import JoinRoomButton from "./JoinRoomButton";
import HostRoomButton from "./HostRoomButton";

function InfoCard({
    id,
    eventName,
    fighterA,
    fighterB,
    sport,
    currentRound,
    owner,
}) {
    const navigate = useNavigate();
    const { user, token } = useUser();
    const handleNavigate = (dst, id) => {
        navigate(`/${dst}/${id}`);
    };

    return (
        <div className="max-w-m p-10 bg-highlightBackground border border-headerPurple rounded-lg shadow-sm">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {eventName}
            </h5>
            <p className="mt-2 font-normal text-gray-700 dark:text-gray-400">
                {`Live: ${fighterA} vs ${fighterB}`}
            </p>
            <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
                {`Round: ${currentRound}`}
            </p>

            {user?.id === owner ? (
                <HostRoomButton
                    id={id}
                    token={token}
                    eventName={eventName}
                    handleNavigate={handleNavigate}
                />
            ) : (
                <JoinRoomButton
                    id={id}
                    sport={sport}
                    handleNavigate={handleNavigate}
                />
            )}
        </div>
    );
}

export default InfoCard;
