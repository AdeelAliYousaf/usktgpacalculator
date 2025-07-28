// src/App.jsx
import { Routes, Route } from "react-router-dom";
import GpaCalculator from "./components/GpaCalculator";
import SuggestPage from "./components/SuggestPage";
import RootLayout from "./layout";
import GradeListing from "./components/Gradelisting";
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop /> {/* ✅ This should be outside Routes */}
      <Routes>
        <Route element={<RootLayout />}> 
          <Route path="/" element={<GpaCalculator />} />
          <Route path="/suggest" element={<SuggestPage />} />
          <Route path="/gradelist" element={<GradeListing />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
