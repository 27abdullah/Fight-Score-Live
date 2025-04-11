// key={i}
// id={room.id}
// eventName={room.name}
// fighterA={room.fighterA}
// fighterB={room.fighterB}
// sport={room.sport}
// currentRound={room.currentRound}

import { useNavigate } from "react-router-dom";

function InfoCard({ id, eventName, fighterA, fighterB, sport, currentRound }) {
    const navigate = useNavigate();

    const handleNavigate = (id) => {
        navigate(`/score-page/${id}`);
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

            <div className="flex items-center justify-between">
                <a
                    onClick={() => handleNavigate(id)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                <p className="">{sport}</p>
            </div>
        </div>
    );
}

export default InfoCard;
