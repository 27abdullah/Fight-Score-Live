export default function WinnerStats({ winner }) {
    return (
        <div className="text-lg sm:text-2xl truncate">
            <div className="italic text-xl">Winner</div>
            <div className="text-3xl">{winner}</div>
        </div>
    );
}
