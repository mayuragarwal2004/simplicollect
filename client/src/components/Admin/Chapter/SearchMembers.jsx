import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

const SearchMembers = ({ chapterId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Debounce time of 500ms

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setResults([]);
      return;
    }
    
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/admin/chapter-member-list/searchmembersforchapter", {
          params: { searchQuery: debouncedQuery, chapterId }
        });
        setResults(response.data.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [debouncedQuery, chapterId]);

  return (
    <div className="relative w-full max-w-md ">
      <Input
        placeholder="Search members..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-2"
      />
      {searchQuery && (
        <ScrollArea className="absolute top-full left-0 w-full bg-white border rounded shadow-md max-h-60 overflow-auto z-10">
          {loading ? (
            <p className="text-center p-2">Loading...</p>
          ) : results.length > 0 ? (
            results.map((member) => (
              <div key={member.id} className="p-2 border-b hover:bg-gray-100">
                {member.name} - {member.email}
              </div>
            ))
          ) : (
            <p className="text-center p-2 text-gray-500">No results found</p>
          )}
        </ScrollArea>
      )}
    </div>
  );
};

export default SearchMembers;