export function FlashBar({ message, type = "info" }) {
    if (!message) return null;

    const styles = {
        info: "bg-blue-100 text-blue-800 border-blue-300",
        success: "bg-green-100 text-green-800 border-green-300",
        error: "bg-red-100 text-red-800 border-red-300",
    };

    const typeStyle =
        styles[type] || "bg-gray-100 text-gray-800 border-gray-300";

    return (
        <div
            className={`fixed left-1/2 bottom-[80%] transform -translate-x-1/2 w-max rounded-lg shadow-md border-l-4 px-6 py-4 text-md font-medium ${typeStyle} z-[9999]`}
        >
            {message}
        </div>
    );
}
