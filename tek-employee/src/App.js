import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import * as XLSX from 'xlsx';
import Fuse from 'fuse.js';
import Select from 'react-select';

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

  //   {value:,label:}
  // ];
  const locationOptions = [
    { value: '7437 Race Rd.', label: '7437 Race Rd.' },
    { value: 'Atlanta Downtown, GA', label: 'Atlanta Downtown, GA' },
    { value: 'Atlanta North, GA', label: 'Atlanta North, GA' },
    { value: 'Austin, TX', label: 'Austin, TX' },
    { value: 'Baltimore, MD', label: 'Baltimore, MD' },
    { value: 'Bangalore-EcoWorld', label: 'Bangalore-EcoWorld' },
    { value: 'Charlotte, NC', label: 'Charlotte, NC' },
    { value: 'Chicago Apps, IL', label: 'Chicago Apps, IL' },
    { value: 'Chicago/Downers Grove, IL', label: 'Chicago/Downers Grove, IL' },
    { value: 'Dallas Solution Center #2', label: 'Dallas Solution Center #2' },
    { value: 'Dallas, TX', label: 'Dallas, TX' },
    { value: 'Denver North, CO', label: 'Denver North, CO' },
    { value: 'Denver, CO', label: 'Denver, CO' },
    { value: 'East Dallas, TX', label: 'East Dallas, TX' },
    { value: 'Ft. Worth, TX', label: 'Ft. Worth, TX' },
    { value: 'Houston, TX', label: 'Houston, TX' },
    { value: 'Hyderabad, India', label: 'Hyderabad, India' },
    { value: 'Indianapolis, IN', label: 'Indianapolis, IN' },
    { value: 'Los Angeles, CA', label: 'Los Angeles, CA' },
    { value: 'Louisville, KY', label: 'Louisville, KY' },
    { value: 'Memphis, TN', label: 'Memphis, TN' },
    { value: 'Miami, FL', label: 'Miami, FL' },
    { value: 'Minneapolis. MN', label: 'Minneapolis. MN' },
    { value: 'Mississauga, ON', label: 'Mississauga, ON' },
    { value: 'Montreal, Canada', label: 'Montreal, Canada' },
    { value: 'Nashville, TN', label: 'Nashville, TN' },
    { value: 'New York City, NY - APPS', label: 'New York City, NY - APPS' },
    { value: 'Northern VA Apps, VA', label: 'Northern VA Apps, VA' },
    { value: 'Northern VA, VA', label: 'Northern VA, VA' },
    { value: 'Philadelphia, PA', label: 'Philadelphia, PA' },
    { value: 'Pittsburgh, PA', label: 'Pittsburgh, PA' },
    { value: 'Portland,OR', label: 'Portland,OR' },
    { value: 'Radnor, PA - TGS', label: 'Radnor, PA - TGS' },
    { value: 'Raleigh Downtown, NC', label: 'Raleigh Downtown, NC' },
    { value: 'Raleigh, NC', label: 'Raleigh, NC' },
    { value: 'San Diego, CA', label: 'San Diego, CA' },
    { value: 'Santa Clara, CA - FCS', label: 'Santa Clara, CA - FCS' },
    { value: 'Seattle South, WA', label: 'Seattle South, WA' },
    { value: 'Silicon Valley, CA', label: 'Silicon Valley, CA' },
    { value: 'St.Louis, MO', label: 'St.Louis, MO' },
    { value: 'Tampa, FL', label: 'Tampa, FL' },
    { value: 'Thousand Oaks, CA', label: 'Thousand Oaks, CA' },
    { value: 'Toronto, ON', label: 'Toronto, ON' },
    { value: 'Walnut Creek, CA', label: 'Walnut Creek, CA' },
    { value: 'Wash., DC', label: 'Wash., DC' },
  ];
  
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
        <label htmlFor="skills"><br />Skills:      </label>
        <input
          type="text"
          name="skills"
          id="skills"
          value={skills}
          onChange={(e) => {
            setSkills(e.target.value);
            handleSkillInputChange(e.target.value);
          }}
          style={{ marginLeft: '40px' }} 
        />
  
        <label htmlFor="experience"><br />Experience:   </label>
        <input
          type="text"
          name="experience"
          id="experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
  
        <label htmlFor="location"><br />Location:</label>
        <Select
          options={locationOptions}
          value={locationOptions.find((option) => option.value === location)}
          onChange={(selectedOption) => setLocation(selectedOption.value)}
          styles={{ control: (provided) => ({ ...provided, width: '190px' }) }}
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
  
      {results.length > 0 ? (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="no-results-message">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
  }

export default App;
