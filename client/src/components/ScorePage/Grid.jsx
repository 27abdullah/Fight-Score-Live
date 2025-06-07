export default function Grid({ Banner, NameTagA, NameTagB, Rounds }) {
    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">
            {/* Top: Banner and NameTagA */}
            <div className="flex flex-col gap-2 p-2">
                <div className="rounded overflow-hidden">{Banner}</div>
                <div className="rounded overflow-hidden">{NameTagA}</div>
            </div>

            {/* Main content with Rounds + Sidebar */}
            <div className="flex-grow min-h-0 min-w-0 p-2 flex flex-col md:grid md:grid-cols-[2fr_1fr] gap-2">
                {/* Scrollable Rounds Section */}
                <div className="rounded bg-slate-600 overflow-hidden min-h-0 min-w-0 flex flex-col">
                    {/* Mobile-only sidebar below Rounds */}
                    <div className="md:hidden p-4 bg-purple-900 rounded h-32">
                        Mobile Sidebar
                    </div>

                    {/* Rounds */}
                    <div className="flex-1 overflow-x-auto overflow-y-hidden">
                        <div className="flex w-max gap-4 p-4 items-center h-full">
                            {Rounds}
                        </div>
                    </div>
                </div>

                {/* Fixed Sidebar (only visible on md+) */}
                <div className="hidden md:block rounded bg-red-900 overflow-auto p-4 max-h-full">
                    Right Sidebar
                </div>
            </div>

            {/* Bottom: NameTagB pinned to bottom */}
            <div className="p-2 rounded overflow-hidden">{NameTagB}</div>
        </div>
    );
}
