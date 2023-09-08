import { Route, Routes } from "react-router-dom";
import BulletTime from "./pages/Bullet";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bullet" element={<BulletTime />} />
    </Routes>
  );
}

export default App;
