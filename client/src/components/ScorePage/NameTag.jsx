export function NameTag({ name, id }) {
    const shadow =
        id === "A"
            ? `drop-shadow-[0_0_4px_rgba(43,127,255,0.3)]`
            : `drop-shadow-[0_0_2px_rgba(255,125,38,0.3)]`;
    const colour = id === "A" ? "dodger" : "cadmium";
    return (
        <div className="flex items-center justify-center w-full h-full">
            <h1
                className={`text-lg sm:text-xl md:text-2xl text-black font-bold py-1 ${shadow}`}
            >
                {name}
            </h1>
        </div>
    );
}

export default NameTag;
