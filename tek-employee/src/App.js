  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import './App.css';

  function App() {
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');
    const [location, setLocation] = useState('');
    const [results, setResults] = useState([]);

    const sortAndHighlight = (data) => {
      // Sort data based on Rating and Experience
      data.sort((a, b) => {
        // Compare both rating and experience
        const ratingComparison = b[14] - a[14]; // Assuming rating is at index 0
        const experienceComparison = b[13] - a[13]; // Assuming years of experience is at index 1

      // Sort by the sum of rating and experience
        const sumComparison = (b[13] + b[14]) - (a[13] + a[14]);

      // Prioritize entries with a greater sum of rating and experience
        return (sumComparison > 0) ? sumComparison : ((ratingComparison !== 0) ? ratingComparison : experienceComparison);
      });

      const highlightedData = data.map((item,index,array) => ({
        ...item,
        highlight: index<5,
      }));
    
      return highlightedData;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const response = await axios.post('http://localhost:5000/search', {
          skills,
          experience,
          location,
        });
        const headers = {
          'Content-Type': 'application/json',
          
        }


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

    const handleBestFitClick = () => {
      // Check if there are results before sorting and highlighting
      if (results.length > 0) {
        // Sort and highlight the results when the "Best Fit" button is clicked
        console.log('Before sorting:', results);
    
        const sortedAndHighlightedResults = sortAndHighlight(results);
        console.log('After sorting:', sortedAndHighlightedResults);
    
        setResults(sortedAndHighlightedResults);
      } else {
        console.warn('No results to sort and highlight.');
      }
    };
    

    useEffect(() => {
      // Fetch data when component mounts
      handleSubmit({ preventDefault: () => {} });
    }, []);

    return (
      
      <div className="app-container">
        <h1>Resource Planner for Employees</h1>
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
          <button type="button" onClick={handleBestFitClick}>Best Fit</button>
      
        </form>
        
        {results.length > 0 && (
          <div classname = 'results-container'>
            <h2>Search Results:</h2>
            <div className = "results-box">
            <table className="results-table">
              <thead>
              <tr>
                  <th>load_date</th>
                  <th>Employee ID</th>
                  <th>Resource Name</th>
                  <th>Supervisor Name</th>
                  <th>RM Role</th>
                  <th>Pool Name</th>
                  <th>Practice Name</th>
                  <th>Location Name</th>
                  <th>Email</th>
                  <th>Competency Code</th>
                  <th>Competency Desciption</th>
                  <th>years acquired</th>
                  <th>years used</th>
                  <th>years of experience</th>
                  <th>Rating</th>
              </tr>
              </thead>
              <tbody>
                {results.map((result, index,array) => (
                  <tr key={index}
                  style={{ backgroundColor: result.highlight ? 'yellow' : 'transparent', color: result.highlight ? 'black' : 'inherit' }}>
                      <td>{result[0]}</td>
                      <td>{result[1]}</td>
                      <td>{result[2]}</td>
                      <td>{result[3]}</td>
                      <td>{result[4]}</td>
                      <td>{result[5]}</td>
                      <td>{result[6]}</td>
                      <td>{result[7]}</td>
                      <td>{result[8]}</td>
                      <td>{result[9]}</td>
                      <td>{result[10]}</td>
                      <td>{result[11]}</td>
                      <td>{result[12]}</td>
                      <td>{result[13]}</td>
                      <td>{result[14]}</td>
                      <td>{result[15]}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}
      </div>
    );
  }

  export default App;


