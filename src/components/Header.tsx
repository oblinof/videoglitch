
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-light-bg p-4 shadow-lg border-b-2 border-cyber-pink sticky top-0 z-10">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-cyber-cyan tracking-widest uppercase">
                Glitch Video Editor
            </h1>
        </header>
    );
};

export default Header;
