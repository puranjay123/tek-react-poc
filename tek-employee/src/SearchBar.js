import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

const SearchBar = ({ data, setSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm === '') {
      setSearchResults([]);
      return;
    }

    const fuse = new Fuse(data, {
      keys: ['title', 'description', 'otherField'], // Add the fields you want to search in
      includeScore: true,
      threshold: 0.4, // Adjust the threshold based on your needs
    });

    const results = fuse.search(searchTerm);
    const filteredResults = results.map((result) => result.item);

    setSearchResults(filteredResults);
  }, [searchTerm, data, setSearchResults]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
