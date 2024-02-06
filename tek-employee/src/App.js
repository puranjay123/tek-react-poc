import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import * as XLSX from 'xlsx';
import Fuse from 'fuse.js';
// import Select from "react-select";
// import SearchBar from '.';
 
function App() {
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [fuse, setFuse] = useState(null);
 
  // const optionList = [
  //   {value:,label:}
  // ];
 
  const sortAndHighlight = (data) => {
    data.sort((a, b) => {
      const ratingComparison = b[14] - a[14];
      const experienceComparison = b[13] - a[13];
      const sumComparison = (b[13] + b[14]) - (a[13] + a[14]);
      return sumComparison > 0 ? sumComparison : ratingComparison !== 0 ? ratingComparison : experienceComparison;
    });
 
    const highlightedData = data.map((item, index, array) => ({
      ...item,
      highlight: index < 5,
    }));
 
    return highlightedData;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const response = await axios.post('http://localhost:5000/search', {
        skills: skills.toUpperCase(),
        experience,
        location,
      });
 
      if (response.data && Array.isArray(response.data)) {
        setResults(response.data);
 
        // Initialize Fuse with the updated skill data
        // const options = {
        //   keys: ['skills'],
        //   includeScore: true,
        // };
        // const fuseInstance = new Fuse(response.data, options);
        // setFuse(fuseInstance);
      } else {
        console.error('Invalid response format:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
 
  const handleBestFitClick = () => {
    if (results.length > 0) {
      const sortedAndHighlightedResults = sortAndHighlight(results);
      setResults(sortedAndHighlightedResults);
    } else {
      console.warn('No results to sort and highlight.');
    }
  };
 
  const handleDownloadExcel = () => {
    const excelData = results.map((result) => ({
      'load_date': result[0],
      'Employee ID': result[1],
      'Resource Name': result[2],
      'Supervisor Name': result[3],
      'RM Role': result[4],
      'Pool Name': result[5],
      'Practice Name': result[6],
      'Location Name': result[7],
      'Email': result[8],
      'Competency Code': result[9],
      'Competency Desciption': result[10],
      'years acquired': result[11],
      'years used': result[12],
      'years of experience': result[13],
      'Rating': result[14]
    }));
 
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'exported_data.xlsx');
  };
 
  useEffect(() => {
    const options = {
      keys: ['Competency_Code'],
      includeScore: true,
    };
    const fuseInstance = new Fuse(results, options);
    setFuse(fuseInstance);
    console.log("I am in the use effect loop")
 
  }, [results]);
 
 
  const handleSkillInputChange = (input) => {
    if (fuse) {
      const skillSearchResults = fuse.search(input);
      // console.log("This is my skill search results",skill)
      const filteredResults = skillSearchResults.map((result) => result.item);
      console.log("This is my filtered results",filteredResults)
      setResults(filteredResults);
    }
  };
 
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
          onChange={(e) => {
            setSkills(e.target.value);
            handleSkillInputChange(e.target.value);
          }}
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
 
        <button type="submit" style={{ marginRight: '1rem' }}>
          Search
        </button>
        <button type="button" onClick={handleBestFitClick} style={{ marginRight: '1 rem' }}>
          Best Fit
        </button>
        <button type="button" onClick={handleDownloadExcel}>
          Download
        </button>
      </form>
 
      {results.length > 0 && (
        <div className="results-container">
          <h2>Search Results:</h2>
          <div className="results-box">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Resource Name</th>
 
                  <th>years of experience</th>
                  <th>Rating</th>
                  <th>load_date</th>
                 
                 
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
                 
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: result.highlight ? 'white' : 'transparent',
                      color: result.highlight ? 'black' : 'inherit',
                    }}
                  >
 
                    <td>{result[1]}</td>
                    <td>{result[2]}</td>
                    <td>{result[13]}</td>
                    <td>{result[14]}</td>
                    <td>{result[0]}</td>
                   
                   
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
                   
                    {/* <td>{result[15]}</td> */}
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