export function About() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-10">
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
                    Typically, the fighter you think won the round gets a 10
                    while the loser gets a 9. In boxing, for every knockdown,
                    the knocked down figher is deducted a point. In MMA, this is
                    not the case, damage is what you further deduct points for
                    e.g., 10-8 if one fighter completely dominated the other.
                </p>
            </div>
        </div>
    );
}

export default About;
