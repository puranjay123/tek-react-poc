// // import { Fragment } from "react";
// import { MouseEvent } from "react";
// function ListGroup() {
//   let items = ["New York", "San Fransico", "Tokyo", "London", "Paris"];
//   // items = [];
//   // Event handler
//   const handleClick = (event: MouseEvent) => console.log(event);
//   return (
//     <>
//       <h1>List</h1>
//       {items.length === 0 && <p>No item found</p>}
//       <ul className="list-group">
//         {items.map((item,index) => (
//           <li
//             className="list-group-item"
//             key={item}
//             onClick={handleClick}
//           >
//             {item}
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }
// export default ListGroup;
// SimpleSearch.tsx

// MultiSearch.tsx

// MultiSearch.tsx

import React, { useState, useEffect } from 'react';

interface MultiSearchProps {
  data: { [key: string]: string }[];
}

const MultiSearch: React.FC<MultiSearchProps> = ({ data }) => {
  const [searchQueries, setSearchQueries] = useState({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
  });

  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    // Filter data based on search queries
    const filtered = data.filter(item =>
      Object.entries(searchQueries).every(([key, value]) =>
        item[key].toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [searchQueries, data]);

  const handleSearch = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQueries({
      ...searchQueries,
      [field]: event.target.value,
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Skills"
        className='ListGroup'
        value={searchQueries.field1}
        onChange={handleSearch('field1')}
      />
      <input
        type="text"
        placeholder="Search Experience"
        value={searchQueries.field2}
        onChange={handleSearch('field2')}
      />
      <input
        type="text"
        placeholder="Search Location"
        value={searchQueries.field3}
        onChange={handleSearch('field3')}
      />
      <input
        type="text"
        placeholder="Search Bench capacity"
        value={searchQueries.field4}
        onChange={handleSearch('field4')}
      />
      <ul>
        {filteredData.map((item, index) => (
          <li key={index}>
            {item.field1} | {item.field2} | {item.field3} | {item.field4}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MultiSearch;
