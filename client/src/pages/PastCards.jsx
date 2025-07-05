import { useEffect, useState } from "react";
import Card from "../components/PastCards/Card";

export default function PastCards() {
    const [pastCards, setPastCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCardIndex, setOpenCardIndex] = useState(null);

    const colours = ["rich_carmine", "black"];

    useEffect(() => {
        const fetchPastCards = async () => {
            const response = await fetch(
                "http://localhost:4000/api/past-cards"
            );

            if (!response.ok) {
                console.error("Failed to fetch past cards");
                setLoading(true);
                return;
            }

            const json = await response.json();
            const data = json.data || [];
            // sort past cards by createdAt in descending order
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPastCards(data);
            setLoading(false);
        };

        fetchPastCards();
    }, []);

    const toggleAccordion = (index) => {
        setOpenCardIndex(openCardIndex === index ? null : index);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold mb-4">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <h1 className="text-3xl font-bold text-center mb-10 font-industry_demi">
                Past Cards
            </h1>

            <div className="mx-auto space-y-10">
                {pastCards.map((card, index) => (
                    <Card
                        key={card._id}
                        card={card}
                        index={index}
                        openCardIndex={openCardIndex}
                        toggleAccordion={toggleAccordion}
                        colours={colours}
                    />
                ))}
            </div>
        </div>
    );
}
