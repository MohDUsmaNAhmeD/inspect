import React from 'react';


const AnimatedFooter = () => {
  return (
    <footer className="bg-gradient-to-br  bg-black/90 text-white">
      <div className="relative w-full pb-32 overflow-hidden">
        {/* Copyright */}
        <div className="container mx-auto px-2 py-6 border-t border-white/5 mb-[-80px]">
          <div className="text-center text-gray-400">
            <p className="text-sm ">&copy;Vehicle Info. All rights reserved.</p>
          </div>
        </div>
      </div>

      <style jsx="true" global="true">{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left var(--speed, 35s) linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right var(--speed, 35s) linear infinite;
        }
        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
    </footer>
  );
};

export default AnimatedFooter;