// import Message from './Message'
// import ListGroup from "./components/ListGroup"
// function App() {
//   return <div><ListGroup /></div>
// }
// export default App;
// App.tsx

// App.tsx

import React from 'react';
import MultiSearch from './components/ListGroup'; // Adjust the path based on your project structure

const App: React.FC = () => {
  const data = [
    { field1: 'Python', field2: '2', field3: 'Banglore', field4: '12/40' },
    
    { field1: 'Informatica', field2: '1', field3: 'Hyderabad', field4: '40/40' },
    { field1: 'AWS deepracer', field2: '3', field3: 'onShore', field4: '10/40' },
    { field1: 'Python', field2: '2', field3: 'onShore', field4: '10/40' },
    // Add more data as needed
  ];

  return (
    <div>
      <h1>Search Employee competency</h1>
      <MultiSearch data={data} />
    </div>
  );
};

export default App;
