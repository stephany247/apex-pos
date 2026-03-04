import React from "react";
interface Props {
  onGetStarted: () => void;
}

const LandingPage: React.FC<Props> = ({ onGetStarted }) => {
  return (
    <div className="h-screen flex items-center justify-center bg-[#FDF6E9]">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6">Apex POS</h1>
        <button
          onClick={onGetStarted}
          className="px-6 py-3 bg-black text-white rounded-full"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;