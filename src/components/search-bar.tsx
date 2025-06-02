import { type FC } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchBarProps = {
  className?: string;
};

export const SearchBar: FC<SearchBarProps> = ({ className }) => {
  const searchBarClasses = cn(
    "flex items-center justify-between w-full p-1 pr-2 bg-gray-800 text-white rounded-4xl",
    className
  );

  return (
    <div className={searchBarClasses}>
      <Input
        type="text"
        placeholder="Search..."
        className="w-full px-4 py-2 text-white focus-visible:outline-0 border-0 rounded-4xl mr-2"
        spellCheck="false"
      />
      <Button
        className="p-0 cursor-pointer"
        variant="ghost"
        size="icon"
      >
        <MagnifyingGlassIcon />
      </Button>
    </div>
  );
};
