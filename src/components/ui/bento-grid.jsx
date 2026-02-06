import { cn } from "../../lib/utils";

export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-6 md:auto-rows-[16rem] md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}) => {
  return (
    <div
      className={cn(
        "group/bento row-span-1 flex flex-col justify-between space-y-2 rounded-xl border-2 border-gray-200 bg-white p-4 transition duration-200 hover:shadow-xl hover:border-brand-green shadow-md h-64",
        className
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mt-1 mb-1 font-sans font-bold text-gray-900 text-sm">
          {title}
        </div>
        <div className="font-sans text-xs font-normal text-gray-600">
          {description}
        </div>
      </div>
    </div>
  );
};
