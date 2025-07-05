export default function Sponsor() {
    const paypal = "https://www.paypal.com/paypalme/FightScoreLive";

    return (
        <div>
            <h2 className="text-2xl font-industry_demi">Sponsored by</h2>
            <a
                href={paypal}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
            >
                Support ❤️ Us
            </a>
        </div>
    );
}
