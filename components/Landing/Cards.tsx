import React from "react";
export const OfferCard = ({
  color,
  title,
  text,
}: {
  color: string;
  title: string;
  text: string;
}) => (
  <div className={`${color} rounded-3xl p-10`}>
    <h4 className="text-xl font-bold mb-4">{title}</h4>
    <p className="mb-6">{text}</p>
    <button className="bg-white text-black px-7 py-2 border-2 border-black rounded-full text-sm font-medium">
      Use apex
    </button>
  </div>
);

export const AudienceCard = ({
  title,
  img,
}: {
  title: string;
  img: string;
}) => (
  <div>
    <img
      src={img}
      alt={title}
      className="rounded-2xl h-64 w-full object-cover object-center mb-4"
    />
    <h4 className="font-semibold text-lg">{title}</h4>
  </div>
);

export const StepCard = ({
  number,
  title,
  icon,
}: {
  number: string;
  title: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-yellow-400 rounded-2xl p-6 text-center">
    <p className="text-sm font-medium mb-2">{number}</p>
    <h4 className="font-semibold">{title}</h4>
    <div className="flex justify-center mb-3">{icon}</div>
  </div>
);
