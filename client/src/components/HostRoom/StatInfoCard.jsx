// Component does not persist after refresh - no API fetch for stats. Gets set on response button press.
function StatInfoCard({ stats, roomData }) {
    if (!stats || !roomData) {
        return null;
    }

    const { currentRound } = roomData;
    return (
        currentRound &&
        currentRound !== 1 && (
            <div className="flex flex-col space-y-4 p-10 bg-highlightBackground text-white rounded-lg">
                <h2 className="text-2xl">Previous Round Stats</h2>
                <p>
                    {roomData?.fighterA}: {stats.votesA || 0} votes
                </p>
                <p>
                    {roomData?.fighterB}: {stats.votesB || 0} votes
                </p>
            </div>
        )
    );
}

export default StatInfoCard;
