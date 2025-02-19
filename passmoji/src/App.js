import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmojiPasswordCreator from "./screens/EmojiPasswordCreator";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<EmojiPasswordCreator />} />
                <Route path="/EmojiPassword" element={<EmojiPasswordCreator />} />
            </Routes>
        </Router>
    );
};

export default App;