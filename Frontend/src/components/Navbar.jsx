import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          SecureShare
        </Link>

        <a
          href="https://github.com/Syeon-Dev-Arch/Secure_File_Sharing_Service"
          target="_blank"
          className="text-gray-600 hover:text-blue-600"
        >
          GitHub
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
