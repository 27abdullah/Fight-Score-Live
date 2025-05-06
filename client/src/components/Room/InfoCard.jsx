import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

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
    const { user } = useUser();
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
                <div className="flex items-center gap-4 justify-end">
                    <a
                        onClick={() => handleNavigate(id)}
                        className="inline-flex hover:text-red-200 items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    >
                        Host room
                        <svg
                            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <circle
                                cx="7"
                                cy="5"
                                r="4"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                        </svg>
                    </a>
                    <p className="w-20 text-right">{sport}</p>
                </div>
            ) : (
                <div className="flex items-center gap-4 justify-end">
                    <a
                        onClick={() => handleNavigate("score-page", id)}
                        className="inline-flex hover:text-blue-200 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Join room
                        <svg
                            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>
                    </a>
                    <p className="w-20 text-right">{sport}</p>
                </div>
            )}
        </div>
    );
}

export default InfoCard;
