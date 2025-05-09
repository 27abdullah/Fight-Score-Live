import { useEffect } from "react";

export function Chat() {
    useEffect(() => {
        const script = document.createElement("script");
        script.id = "cid0020000407743287365";
        script.async = true;
        script.setAttribute("data-cfasync", "false");
        script.src = "//st.chatango.com/js/gz/emb.js";
        script.style.width = "250px";
        script.style.height = "350px";

        script.innerHTML = JSON.stringify({
            handle: "fightscorelive",
            arch: "js",
            styles: {
                a: "000000",
                b: 100,
                c: "FFFFFF",
                d: "FFFFFF",
                k: "000000",
                l: "000000",
                m: "000000",
                n: "FFFFFF",
                p: "10",
                q: "000000",
                r: 100,
                t: 0,
                surl: 0,
                allowpm: 0,
                cnrs: "0.35",
                fwtickm: 1,
            },
        });

        const chatContainer = document.getElementById("chat-container");
        chatContainer.appendChild(script);

        return () => {
            // Cleanup: Remove the script and its content
            chatContainer.innerHTML = "";
        };
    }, []);

    return (
        <>
            <div id="chat-container"></div>
        </>
    );
}

export default Home;
