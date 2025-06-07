//direction true iff top block
export function BarGraph({ votesA, votesB, direction }) {
    const stats = direction ? votesA : votesB;
    return votesA + votesB == 0 || stats <= 0 ? (
        <></>
    ) : (
        // TODO: wdith size
        <div
            className={"bg-blue-500 w-16 sm:w-18 md:w-24 mx-7"}
            style={{
                height: 140 * (stats / (votesA + votesB)),
            }}
        ></div>
    );
}

export default BarGraph;
