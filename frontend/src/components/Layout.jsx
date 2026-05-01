import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const Layout = () => {
  const [newCount, setNewCount] = useState(0);
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <Navbar newCount={newCount} search={search} onSearchChange={setSearch} />
      <main>
        <Outlet context={{ setNewCount, search, setSearch }} />
      </main>
    </div>
  );
};

export default Layout;
