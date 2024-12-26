import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
const socket = io.connect("http://localhost:4000");

function sendMessage() {
    console.log("Button clicked");
    socket.emit("send_message", { message: "Hello from client!" });
}

export function ScorePage() {
    useEffect(() => {
        const handleMessage = (data) => {
            console.log(data);
        };

        socket.on("receive_message", handleMessage);

        return () => {
            socket.off("receive_message", handleMessage);
        };
    }, []);

    return (
        <div className="bg-red-500 text-white p-5">
            If this is red, Tailwind is working!
        </div>
    );
}

//     return (
//         <div className="App">
//             <input placeholder="Message" />
//             <button onClick={sendMessage}>Send message</button>
//         </div>
//     );

//     // const [count, setCount] = useState(0);
//     // const [array, setArray] = useState([]);
//     // const fetchAPI = async () => {
//     //     const response = await axios.get("http://localhost:8080/api");
//     //     setArray(response.data.fruits);
//     //     console.log(response.data.fruits);
//     // };
//     // useEffect(() => {
//     //     fetchAPI();
//     // }, []);
//     // return (
//     //     <>
//     //         <h1>Vite + React</h1>
//     //         <div className="card">
//     //             <button onClick={() => setCount((count) => count + 1)}>
//     //                 count is {count}
//     //             </button>
//     //             <p>
//     //                 Edit <code>src/App.jsx</code> and save to test HMR
//     //             </p>
//     //             {array.map((fruit, index) => (
//     //                 <div key={index}>
//     //                     <p>{fruit}</p>
//     //                     <br></br>
//     //                 </div>
//     //             ))}
//     //         </div>
//     //     </>
//     // );
// }

export default ScorePage;
