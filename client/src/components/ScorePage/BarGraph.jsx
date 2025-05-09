//direction true iff top block
export function BarGraph({ votesA, votesB, direction }) {
    const stats = direction ? votesA : votesB;
    return votesA + votesB == 0 || stats <= 0 ? (
        <></>
    ) : (
        <div
            className={"bg-blue-500 w-24 mx-7"}
            style={{
                height: 140 * (stats / (votesA + votesB)),
            }}
        ></div>
    );
}

export default BarGraph;
