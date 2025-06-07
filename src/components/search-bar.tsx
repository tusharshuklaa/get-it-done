import { type FC, useState, useCallback } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

type SearchBarProps = {
  className?: string;
  placeholder?: string;
  value?: string;
  debounceMs?: number;
  onSearch: (searchTerm: string) => void;
  onSubmit?: (searchTerm: string) => void;
};

export const SearchBar: FC<SearchBarProps> = ({ 
  className, 
  placeholder = "Search...",
  value: controlledValue,
  debounceMs = 300,
  onSearch,
  onSubmit
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue || "");
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  
  const debouncedSearch = useDebounce(onSearch, debounceMs);

  const searchBarClasses = cn(
    "flex items-center w-full bg-gray-900 border border-border rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-ring",
    className
  );

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    
    if (controlledValue === undefined) {
      setInternalValue(searchTerm);
    }

    debouncedSearch(searchTerm);
  }, [controlledValue, debouncedSearch]);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    // Immediate search on form submit
    onSearch(currentValue);
    onSubmit?.(currentValue);
  }, [currentValue, onSearch, onSubmit]);

  const handleSearchClick = useCallback(() => {
    onSearch(currentValue);
    onSubmit?.(currentValue);
  }, [currentValue, onSearch, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className={searchBarClasses} role="search">
      <Input
        type="text"
        placeholder={placeholder}
        value={currentValue}
        onChange={handleInputChange}
        className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-600"
        spellCheck="false"
        aria-label="Search input"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="shrink-0 hover:bg-accent"
        onClick={handleSearchClick}
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
      </Button>
    </form>
  );
};
