//direction true iff top block
export function BarGraph({ statsA, statsB, direction }) {
    const stats = direction ? statsA : statsB;
    return statsA + statsB == 0 || stats <= 0 ? (
        <></>
    ) : (
        <div
            className={"bg-blue-500 w-28 mx-7"}
            style={{
                height: 100 * (stats / (statsA + statsB)),
            }}
        ></div>
    );
}

export default BarGraph;
