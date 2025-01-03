import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ScorePage } from "./pages/ScorePage";
import { Home } from "./pages/Home";
import { Layout } from "./Layout";
import About from "./pages/About";

export function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/score-page" element={<ScorePage />} />
                    <Route path="/about" element={<About />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
