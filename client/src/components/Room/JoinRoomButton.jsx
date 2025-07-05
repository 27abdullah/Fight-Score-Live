export default function JoinRoomButton({ id, sport, handleNavigate }) {
    return (
        <div className="flex items-center gap-4 justify-end">
            <a
                onClick={() => handleNavigate("score-page", id)}
                className="inline-flex hover:cursor-pointer items-center px-3 py-2 text-sm font-medium text-center text-white bg-rich_carmine rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none hover:text-white"
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
            <p className="w-20 text-center px-3 py-2 border-zeus">{sport}</p>
        </div>
    );
}
