import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";

const Header: React.FC = () => {
    return (
        <header className="w-full px-6 py-3 flex items-center justify-between bg-white shadow-md rounded-2xl mb-6">
            {/* Left: Github button */}
            <a
                href="https://github.com/Vincent71399/lutarez_tsender_app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="GitHub"
            >
                <FaGithub size={28} />
            </a>
            {/* Center: Title */}
            <h1 className="text-xl font-bold tracking-wider select-none">Lutarez Token Airdrop</h1>
            {/* Right: RainbowKit connect button */}
            <div>
                <ConnectButton />
            </div>
        </header>
    );
};

export default Header;
