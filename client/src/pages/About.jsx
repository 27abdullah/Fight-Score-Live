export function About() {
    const tabClass = "shadow-lg rounded-2xl w-full max-w-3xl overflow-hidden";
    const headerClass =
        "bg-white border-b-2 border-black pt-6 pb-3 px-6 md:pt-8 md:pb-4 md:px-8";
    const headerText =
        "text-2xl md:text-3xl font-bold text-black font-industry_demi";
    const bodyClass = "bg-dune p-6 md:p-8";
    const paraClass = "text-white text-base md:text-lg leading-relaxed";

    return (
        <div className="flex flex-col items-center justify-center bg-zeus p-16 md:p-20 space-y-12">
            <div className={tabClass}>
                <div className={headerClass}>
                    <h1 className={headerText}>
                        <span className="text-rich_carmine">Welcome</span>
                    </h1>
                </div>
                <div className={bodyClass}>
                    <p className={paraClass}>
                        Welcome to Fight Score Live! Use this website to score
                        the biggest combat sports fights round-by-round, live.
                    </p>
                    <div className="my-4" />
                    <p className={paraClass}>
                        FSL is a passion project of mine so please let me know
                        if you have any feedback or suggestions. You can reach
                        me at contact@fightscore.live.
                    </p>
                </div>
            </div>

            <div className={tabClass}>
                <div className={headerClass}>
                    <h1 className={headerText}>How To</h1>
                </div>
                <div className={bodyClass}>
                    <p className={paraClass}>
                        FSL works by allowing a user, the Host, to create a room
                        for a particular fight or fights. Other users can join
                        this room and score the fights. The Host controls the
                        room: when a fight starts, stops, what the outcome is
                        and when to switch to the next fight.
                    </p>
                    <div className="my-4" />
                    <p className={paraClass}>
                        To create a room, click the Create Room button on the
                        top navigation bar. This will take you to the CreateRoom
                        page. Here, you can enter the fight details. Creating a
                        room costs a room token. Your total is available in your
                        profile page. Every week all users are given 5 free room
                        tokens. If you run out but want to create more rooms
                        please contact me.
                    </p>
                </div>
            </div>

            <div className={tabClass}>
                <div className={headerClass}>
                    <h1 className={headerText}>Scoring</h1>
                </div>
                <div className={bodyClass}>
                    <p className={paraClass}>
                        Boxing and MMA fights are scored on a 10-point system.
                        Typically, the fighter you think won the round gets a
                        10, while the loser gets a 9. In boxing, for every
                        knockdown, the knocked down fighter is deducted a point.
                        In MMA, this is not the case; damage is what you further
                        deduct points for e.g., 10-8 if one fighter completely
                        dominated the other.
                    </p>

                    <div className="my-4" />

                    <p className={paraClass}>
                        Click the Rounds button on the top navigation bar to go
                        to the score page. On the ScorePage, each column
                        corresponds to a round and each row corresponds to that
                        fighter's scores in that fight. The current round to be
                        scored will be highlighted red to start, indicating you
                        haven't input your score yet. To input your score,
                        increment or decrement the orange block's scores to
                        reflect your score for the round. After this, the active
                        round will have a green border . Once the round is over,
                        your score will be submitted and the next round will be
                        activated. The overall fan stats for a particular round
                        will be displayed above or below that round's score
                        column. The fighter with the higher bar graph is the one
                        most scorers on this website thought won.
                    </p>

                    <div className="my-4" />

                    <p className={paraClass}>
                        Joining midway through a fight is perfectly fine! All
                        the rounds you missed out on scoring will appear blank.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;
