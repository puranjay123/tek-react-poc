// import Message from './Message'
// import ListGroup from "./components/ListGroup"
// function App() {
//   return <div><ListGroup /></div>
// }
// export default App;
// App.tsx

// App.tsx

import React, { useState, useEffect } from "react";
import MultiSearch from "./components/ListGroup"; // Adjust the path based on your project structure

const App: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Define the API endpoint
    const apiUrl = "http://127.0.0.1:5000/search";
    //example body
    const requestBody = {
      skills: "Python",
      experience: "2",
      location: "Bangalore",
    };

    // fecth data from the API
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((apiData) => setData(apiData))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // const data = [
  //   { field1: 'Python', field2: '2', field3: 'Banglore', field4: '12/40' },

  //   { field1: 'Informatica', field2: '1', field3: 'Hyderabad', field4: '40/40' },
  //   { field1: 'AWS deepracer', field2: '3', field3: 'onShore', field4: '10/40' },
  //   { field1: 'Python', field2: '2', field3: 'onShore', field4: '10/40' },
  //   // Add more data as needed
  // ];

  return (
    <div>
      <h1>Search Employee Competency</h1>
      <MultiSearch data={data} />
      {data.length === 0 && <p>Loading data...</p>}
    </div>
  );
};

export default App;
