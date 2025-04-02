import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  className,
  ...props
}) => {
  return (
    <div className={`relative w-full w-md ${className}`}>
      <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
      <Input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 py-2 text-lg border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
};

export { SearchBar };
