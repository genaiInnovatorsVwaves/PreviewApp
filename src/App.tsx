import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import AppBuilder from "./pages/AppBuilder";
import PreviewApp from "./pages/PreviewApp";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/NSI" element={<Landing platform="nsi" />} />
      <Route path="/nsi" element={<Landing platform="nsi" />} />
      <Route path="/OSI" element={<Landing platform="osi" />} />
      <Route path="/osi" element={<Landing platform="osi" />} />
      <Route path="/ESI" element={<Landing platform="esi" />} />
      <Route path="/esi" element={<Landing platform="esi" />} />
      <Route path="/NSM" element={<Landing platform="nsm" createMode="git" />} />
      <Route path="/nsm" element={<Landing platform="nsm" createMode="git" />} />
      <Route path="/OSM" element={<Landing platform="osm" createMode="git" />} />
      <Route path="/osm" element={<Landing platform="osm" createMode="git" />} />
      <Route path="/ESM" element={<Landing platform="esm" createMode="git" />} />
      <Route path="/esm" element={<Landing platform="esm" createMode="git" />} />
      <Route path="/app/:id" element={<AppBuilder />} />
      <Route path="/preview/:id" element={<PreviewApp />} />
    </Routes>
  );
}
