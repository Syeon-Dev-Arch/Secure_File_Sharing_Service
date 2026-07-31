import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Download from "./pages/Download";
import Upload from "./pages/Upload";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/upload" element={<Upload />} />

      <Route path="/download/:shareId" element={<Download />} />

      <Route path="/success" element={<Success />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
