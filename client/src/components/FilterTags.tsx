import React from 'react';

type FilterTagsProps = {
  filters: string[]; // List of all filter options
  activeFilters: string[]; // List of currently active filters
  setActiveFilters: (filters: string[]) => void; // Function to update active filters
};

const FilterTags: React.FC<FilterTagsProps> = ({ filters, activeFilters, setActiveFilters }) => {
  const toggleFilter = (tag: string) => {
    console.log(`Toggling filter: ${tag}`);
    
    const updatedFilters = activeFilters.includes(tag)
      ? activeFilters.filter((filter) => filter !== tag) // Remove the tag if it's already active
      : [...activeFilters, tag]; // Add the tag if not active

      console.log({ updatedFilters });
      

    setActiveFilters(updatedFilters);
  };

  console.log({ filters, activeFilters });
  

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((tag) => (
        <button
          key={tag}
          className={`px-4 py-2 rounded-full border text-sm ${
            activeFilters.includes(tag)
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-gray-100 text-gray-700 border-gray-300'
          } hover:bg-blue-800 hover:text-white transition`}
          onClick={() => toggleFilter(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default FilterTags;
