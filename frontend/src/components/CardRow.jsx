import { ChevronRight } from "lucide-react";
import PremiumCard from "./PremiumCard.jsx";

const CardRow = ({ title, notices }) => {
  if (!notices.length) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
          <div className="mt-2 h-px w-24 bg-gradient-to-r from-violet-400 via-indigo-400 to-transparent" />
        </div>
        <ChevronRight className="text-slate-500" size={24} />
      </div>

      <div className="scroll-smooth overflow-x-auto overflow-y-visible px-4 pb-12 pt-3 [scrollbar-width:none] sm:px-8 lg:px-12 [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-5">
          {notices.map((notice, index) => (
            <PremiumCard key={notice._id} notice={notice} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardRow;
