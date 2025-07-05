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
        <div className="max-w-md rounded-xl overflow-hidden shadow bg-white">
            {/* Header */}
            <div className="bg-white p-4 border-b border-b-black">
                <h5 className="text-xl font-semibold text-center text-gray-800 tracking-tight">
                    {eventName}
                </h5>
            </div>

            {/* Body */}
            <div className="bg-dune p-7 text-white text-md">
                <p className="mb-2">{`Round: ${currentRound}`}</p>
                <p className="mb-4">
                    <span className="text-rich_carmine">Live:</span>
                    {` ${fighterA} vs ${fighterB}`}
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
        </div>
    );
}

export default InfoCard;
