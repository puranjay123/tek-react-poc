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

import React, { useState, useEffect } from "react";

interface MultiSearchProps {
  // Assuming your API returns an array of objects with the same structure as your data
  data: { [key: string]: string }[];
}

const MultiSearch: React.FC<MultiSearchProps> = ({ data }) => {
  const [searchQueries, setSearchQueries] = useState({
    field1: "",
    field2: "",
    field3: "",
  });

  const [filteredData, setFilteredData] = useState(data);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Replace the API endpoint with your actual API URL
      const apiUrl = "http://127.0.0.1:5000/search";

      const requestBody = {
        skills: searchQueries.field1,
        experience: searchQueries.field2,
        location: searchQueries.field3,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const apiData = await response.json();

      const filtered = apiData.filter((item) =>
        Object.entries(searchQueries).every(([key, value]) =>
          item[key].toLowerCase().includes(value.toLowerCase())
        )
      );

      setFilteredData(filtered);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQueries]); // Only refetch data when searchQueries change

  const handleSearch = () => {
    fetchData();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Skills"
        value={searchQueries.field1}
        onChange={(event) =>
          setSearchQueries({
            ...searchQueries,
            field1: event.target.value,
          })
        }
      />
      <input
        type="text"
        placeholder="Experience"
        value={searchQueries.field2}
        onChange={(event) =>
          setSearchQueries({
            ...searchQueries,
            field2: event.target.value,
          })
        }
      />
      <input
        type="text"
        placeholder="Location"
        value={searchQueries.field3}
        onChange={(event) =>
          setSearchQueries({
            ...searchQueries,
            field3: event.target.value,
          })
        }
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {loading ? (
          <p>Loading data...</p>
        ) : (
          filteredData.map((item, index) => (
            <li key={index}>
              {item.field1} | {item.field2} | {item.field3}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MultiSearch;


// import React, { useState, useEffect } from "react";

// interface MultiSearchProps {
//   data: { [key: string]: string }[];
// }

// const MultiSearch: React.FC<MultiSearchProps> = ({ data }) => {
//   const [searchQueries, setSearchQueries] = useState({
//     field1: "",
//     field2: "",
//     field3: "",
//     field4: "",
//   });

//   const [filteredData, setFilteredData] = useState(data);
//   // Implemenating conditional loading in list so that before Loading the data we can have a look at search bar
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     // Simulating an asynchronous data fetch
//     const fetchData = async () => {
//       setLoading(true);

//       // Simulate a delay (you should replace this with your actual data fetching logic)
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Filter data based on search queries
//       const filtered = data.filter((item) =>
//         Object.entries(searchQueries).every(([key, value]) =>
//           item[key].toLowerCase().includes(value.toLowerCase())
//         )
//       );

//       setFilteredData(filtered);
//       setLoading(false);
//     };

//     fetchData();
//   }, [searchQueries, data]);

//   const handleSearch =
//     (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
//       setSearchQueries({
//         ...searchQueries,
//         [field]: event.target.value,
//       });
//     };

//   return (
//     <div>
//       {loading ? (
//         <p>Loading data...</p>
//       ) : (
//         <>
//           <input
//             type="text"
//             placeholder="Search Skills"
//             className="ListGroup"
//             value={searchQueries.field1}
//             onChange={handleSearch("field1")}
//           />
//           <input
//             type="text"
//             placeholder="Search Experience"
//             value={searchQueries.field2}
//             onChange={handleSearch("field2")}
//           />
//           <input
//             type="text"
//             placeholder="Search Location"
//             value={searchQueries.field3}
//             onChange={handleSearch("field3")}
//           />
//           <input
//             type="text"
//             placeholder="Search Bench capacity"
//             value={searchQueries.field4}
//             onChange={handleSearch("field4")}
//           />
//           <ul>
//             {filteredData.map((item, index) => (
//               <li key={index}>
//                 {item.field1} | {item.field2} | {item.field3} | {item.field4}
//               </li>
//             ))}
//           </ul>
//         </>
//       )}
//     </div>
//   );
// };

// export default MultiSearch;
