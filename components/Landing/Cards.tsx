import { motion, useTransform } from "framer-motion";
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
  <motion.div whileHover={{ y: -8 }}>
    <img
      src={img}
      alt={title}
      className="rounded-2xl h-64 w-full object-cover object-center mb-4"
    />
    <h4 className="font-semibold text-lg text-center md:text-left">{title}</h4>
  </motion.div>
);

export const StepCard = ({
  number,
  title,
  icon,
  description,
}: {
  number: string;
  title: string;
  icon: string;
  description: string;
}) => (
  <div className="bg-[#FFCC3D] rounded-2xl p-6 text-center">
    <p className="text-sm font-medium mb-2">{number}</p>
    <h4 className="font-extrabold text-xl">{title}</h4>
    <div className="flex justify-center my-4">
      <img src={icon} alt={title} className="w-12 h-12 object-contain" />
    </div>
    <p className="text-sm">{description}</p>
  </div>
);

export const StackCard = ({
  children,
  index,
  scroll,
}: {
  children: React.ReactNode;
  index: number;
  scroll: any;
}) => {
  const scale = useTransform(scroll, [0, 1], [1 - index * 0.05, 1]);
  const y = useTransform(scroll, [0, 1], [index * 40, 0]);

  return (
    <motion.div style={{ scale, y }} className="sticky top-32 mb-10">
      {children}
    </motion.div>
  );
};
