export function About() {
    const tabClass = "shadow-lg bg-white rounded-lg p-8 w-full max-w-2xl"; // white cards
    const headerClass =
        "text-black text-3xl md:text-4xl font-bold border-b pb-2 mb-4";
    const paraClass = "text-md md:text-lg text-black leading-relaxed";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-12 p-9 ">
            <div className={tabClass}>
                <h1 className={headerClass}>
                    <span className="text-rich_carmine">Welcome!</span>
                </h1>
                <p className={paraClass}>
                    Welcome to Fight Score Live! Use this website to score the
                    biggest boxing and MMA fights round-by-round, live.
                </p>
            </div>

            <div className={tabClass}>
                <h1 className={headerClass}>How to Score Fights Live</h1>
                <p className={paraClass}>
                    Boxing and MMA fights are scored on a 10 point system.
                    Typically, the fighter you think won the round gets a 10,
                    while the loser gets a 9. In boxing, for every knockdown,
                    the knocked down fighter is deducted a point. In MMA, this
                    is not the case; damage is what you further deduct points
                    for — e.g., 10-8 if one fighter completely dominated the
                    other.
                </p>

                <div className="my-6" />

                <p className={paraClass}>
                    Click the ScorePage button on the top navigation bar to go
                    to the score page. On the ScorePage, each column corresponds
                    to a round and each row corresponds to that fighter's scores
                    in that fight. The current round to be scored will be
                    highlighted orange to start, indicating you haven't input
                    your score yet. To input your score, increment or decrement
                    the orange block's scores to reflect your score for the
                    round. After this, the active round will have a green
                    border. Once the round is over, your score will be submitted
                    and the next round will be activated. The overall fan stats
                    for a particular round will be displayed above or below that
                    round's score column. The fighter with the higher bar graph
                    is the one most scorers on this website thought won.
                </p>

                <div className="my-6" />

                <p className={paraClass}>
                    Joining midway through a fight is perfectly fine! All the
                    rounds you missed out on scoring will appear blank.
                </p>
            </div>
        </div>
    );
}

export default About;
