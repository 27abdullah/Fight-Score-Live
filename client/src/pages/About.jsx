export function About() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-10 p-5">
            <div className="shadow-lg bg-highlightBackground rounded-lg p-6 w-full max-w-2xl">
                <h1 className="text-headerPurple text-3xl font-bold mb-4">
                    About Us
                </h1>
                <p className="text-xl">
                    Welcome to Fight Score Live! Use this website to score the
                    biggest boxing and mma fights round-by-round, live.
                </p>
            </div>
            <div className="shadow-lg bg-highlightBackground rounded-lg p-6 w-full  max-w-2xl">
                <h1 className="text-headerPurple text-3xl font-bold mb-4">
                    How to Score Fights (Live)
                </h1>
                <p className="text-xl">
                    Boxing and MMA fights are scored on a 10 point system.
                    Typically, the fighter you think won the round gets a 10,
                    while the loser gets a 9. In boxing, for every knockdown,
                    the knocked down figher is deducted a point. In MMA, this is
                    not the case, damage is what you further deduct points for
                    e.g., 10-8 if one fighter completely dominated the other.
                </p>
                <br></br>
                <p className="text-xl">
                    Click the ScorePage button on the top navigation bar to go
                    to the score page. On the ScorePage, each column corresponds
                    to a round and each row corresponds to that fighter's scores
                    that fight. The current round to be scored will be orange to
                    start. This indicates that you haven't input your score yet.
                    To input your score, increment or decrement the orange
                    blocks' scores to reflect your score for the round. After
                    this, the active round should have a green border. Once the
                    round is over, your score will be submitted and the next
                    round will be activated. The overall fan stats for a
                    particular round will be displayed above/below that round's
                    score column. The fighter with the higher bar graph is the
                    won who most scorers on this website thought won.
                </p>
                <br></br>
                <p className="text-xl">
                    Joining midway through a fight is perfectly fine! All the
                    rounds you missed out on scoring will appear blank.
                </p>
            </div>
        </div>
    );
}

export default About;
