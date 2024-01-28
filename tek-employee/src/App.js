import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/search', {
        skills,
        experience,
        location,
      });

      // Check if the response contains a 'data' property and it's an array
      if (response.data && Array.isArray(response.data)) {
        setResults(response.data);
      } else {
        // Handle the case where the response does not contain an array
        console.error('Invalid response format:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    // Fetch data when component mounts (you can add dependencies if needed)
    handleSubmit({ preventDefault: () => {} }); // Call handleSubmit with a mock event
  }, []); // Empty dependency array means it runs once when the component mounts
  console.log('Results:**************************', results);


  return (
    <div>
      <h1>Search Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="skills">Skills:</label>
        <input
          type="text"
          name="skills"
          id="skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <label htmlFor="experience">Experience:</label>
        <input
          type="text"
          name="experience"
          id="experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <label htmlFor="location">Location:</label>
        <input
          type="text"
          name="location"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      {results.length > 0 && (
        <div>
          <h2>Search Results:</h2>
          <table border="1">
          <thead>
  <tr>
    <th>Employee ID</th>
    <th>Resource Name</th>
    <th>Job Code</th>
    <th>Job Code Description</th>
    <th>Dept</th>
    <th>Department Name</th>
    <th>Supv ID</th>
    <th>Supervisor Name</th>
    <th>RM Role</th>
    <th>Pool Name</th>
    <th>Practice</th>
    <th>Practice Name</th>
    <th>Location</th>
    <th>Location Name</th>
    <th>Personnel Status</th>
    <th>Email</th>
    <th>Hire Date</th>
    <th>Competency Code</th>
    <th>Competency Description</th>
    <th>Year Acquired</th>
    <th>Year Last Used</th>
    <th>Years of Work Experience</th>
    <th>Rating</th>
    <th>Interest Level</th>
  </tr>
</thead>
<tbody>
  {results.map((result) => (
    <tr key={result['Employee ID']}>
      <td>{result['Employee ID']}</td>
      <td>{result['Resource Name']}</td>
      <td>{result['Job Code']}</td>
      <td>{result['Job Code Description']}</td>
      <td>{result['Dept']}</td>
      <td>{result['Department Name']}</td>
      <td>{result['Supv ID']}</td>
      <td>{result['Supervisor Name']}</td>
      <td>{result['RM Role']}</td>
      <td>{result['Pool Name']}</td>
      <td>{result['Practice']}</td>
      <td>{result['Practice Name']}</td>
      <td>{result['Location']}</td>
      <td>{result['Location Name']}</td>
      <td>{result['Personnel Status']}</td>
      <td>{result['Email']}</td>
      <td>{result['Hire Date']}</td>
      <td>{result['Competency Code']}</td>
      <td>{result['Competency Description']}</td>
      <td>{result['Year Acquired']}</td>
      <td>{result['Year Last Used']}</td>
      <td>{result['Years of Work Experience']}</td>
      <td>{result['Rating']}</td>
      <td>{result['Interest Level']}</td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
