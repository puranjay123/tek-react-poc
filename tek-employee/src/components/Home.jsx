import React, { useState, useEffect } from 'react';
//import {Link} from "react-router-dom/dist";
import axios from 'axios';
import '../App.css';
import * as XLSX from 'xlsx';
import Fuse from 'fuse.js';
import "../CSS/Home.css";



//import Home from "./components/Home";
// import Select from 'react-select';
import Multiselect from 'multiselect-react-dropdown';
export default function Home(){
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');
    const [location, setLocation] = useState([]);
    const [results, setResults] = useState([]);
    const [fuse, setFuse] = useState(null);
    // const [skillset, setSkillset] = useState([]);  // New state for skillset
    const [skillSetDict, setSkillSetDict] = useState({});
  

    // const optionList = [
    //   {value:,label:}
  
    //   {value:,label:}
    // ];
    // const locationOptions = [
    //   {
      
    //       "india": {
            
    //           "ka": "Bangalore",
    //           "ta": "Hyderabad"
    //         }
  
    //         "USA":{
    //           'Texas':'washington'
    //         }
    //     }
    //   }
    // ]
  
    const locationOptions = [
      { label: 'USA', options: [
        { value: '7437 Race Rd.', label: '7437 Race Rd.' },
        { value: 'Atlanta Downtown, GA', label: 'Atlanta Downtown, GA' },
        { value: 'Atlanta North, GA', label: 'Atlanta North, GA' },
        { value: 'Austin, TX', label: 'Austin, TX' },
        { value: 'Baltimore, MD', label: 'Baltimore, MD' },
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
        { value: 'Indianapolis, IN', label: 'Indianapolis, IN' },
        { value: 'Los Angeles, CA', label: 'Los Angeles, CA' },
        { value: 'Louisville, KY', label: 'Louisville, KY' },
        { value: 'Memphis, TN', label: 'Memphis, TN' },
        { value: 'Miami, FL', label: 'Miami, FL' },
        { value: 'Minneapolis. MN', label: 'Minneapolis. MN' },
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
        { value: 'Walnut Creek, CA', label: 'Walnut Creek, CA' },
        { value: 'Wash., DC', label: 'Wash., DC' },
      ]},
      { label: 'India', options: [
        { value: 'Bangalore-EcoWorld', label: 'Bangalore-EcoWorld' },
        { value: 'Hyderabad, India', label: 'Hyderabad, India' },
      ]},
      { label: 'Canada', options: [
        { value: 'Mississauga, ON', label: 'Mississauga, ON' },
        { value: 'Montreal, Canada', label: 'Montreal, Canada' },
      ]},
      
      // Add more countries and locations as needed
    ];
    
  
    // const locationOptions = [
    //   { value: '7437 Race Rd.', label: '7437 Race Rd.' },
    //   { value: 'Atlanta Downtown, GA', label: 'Atlanta Downtown, GA' },
    //   { value: ['Atlanta North, GA', label: 'Atlanta North, GA' },
    //   { value: 'Austin, TX', label: 'Austin, TX' },
    //   { value: 'Baltimore, MD', label: 'Baltimore, MD' },
    //   { value: 'Bangalore-EcoWorld',china, label: 'India'},
    //   { value: 'Charlotte, NC', label: 'Charlotte, NC' },
    //   { value: 'Chicago Apps, IL', label: 'Chicago Apps, IL' },
    //   { value: 'Chicago/Downers Grove, IL', label: 'Chicago/Downers Grove, IL' },
    //   { value: 'Dallas Solution Center #2', label: 'Dallas Solution Center #2' },
    //   { value: 'Dallas, TX', label: 'Dallas, TX' },
    //   { value: 'Denver North, CO', label: 'Denver North, CO' },
    //   { value: 'Denver, CO', label: 'Denver, CO' },
    //   { value: 'East Dallas, TX', label: 'East Dallas, TX' },
    //   { value: 'Ft. Worth, TX', label: 'Ft. Worth, TX' },
    //   { value: 'Houston, TX', label: 'Houston, TX' },
    //   { value: 'Hyderabad, India', label: 'India' },
    //   { value: 'Indianapolis, IN', label: 'Indianapolis, IN' },
    //   { value: 'Los Angeles, CA', label: 'Los Angeles, CA' },
    //   { value: 'Louisville, KY', label: 'Louisville, KY' },
    //   { value: 'Memphis, TN', label: 'Memphis, TN' },
    //   { value: 'Miami, FL', label: 'Miami, FL' },
    //   { value: 'Minneapolis. MN', label: 'Minneapolis. MN' },
    //   { value: 'Mississauga, ON', label: 'Mississauga, ON' },
    //   { value: 'Montreal, Canada', label: 'Montreal, Canada' },
    //   { value: 'Nashville, TN', label: 'Nashville, TN' },
    //   { value: 'New York City, NY - APPS', label: 'New York City, NY - APPS' },
    //   { value: 'Northern VA Apps, VA', label: 'Northern VA Apps, VA' },
    //   { value: 'Northern VA, VA', label: 'Northern VA, VA' },
    //   { value: 'Philadelphia, PA', label: 'Philadelphia, PA' },
    //   { value: 'Pittsburgh, PA', label: 'Pittsburgh, PA' },
    //   { value: 'Portland,OR', label: 'Portland,OR' },
    //   { value: 'Radnor, PA - TGS', label: 'Radnor, PA - TGS' },
    //   { value: 'Raleigh Downtown, NC', label: 'Raleigh Downtown, NC' },
    //   { value: 'Raleigh, NC', label: 'Raleigh, NC' },
    //   { value: 'San Diego, CA', label: 'San Diego, CA' },
    //   { value: 'Santa Clara, CA - FCS', label: 'Santa Clara, CA - FCS' },
    //   { value: 'Seattle South, WA', label: 'Seattle South, WA' },
    //   { value: 'Silicon Valley, CA', label: 'Silicon Valley, CA' },
    //   { value: 'St.Louis, MO', label: 'St.Louis, MO' },
    //   { value: 'Tampa, FL', label: 'Tampa, FL' },
    //   { value: 'Thousand Oaks, CA', label: 'Thousand Oaks, CA' },
    //   { value: 'Toronto, ON', label: 'Toronto, ON' },
    //   { value: 'Walnut Creek, CA', label: 'Walnut Creek, CA' },
    //   { value: 'Wash., DC', label: 'Wash., DC' },
    // ];
    const ratingsort = (data) => {
    data.sort((a,b) =>{
      console.log(a[13].length);
      console.log("this is the lengh of b",b[13].length);
  
    })
  
    }
    const sortAndHighlight = (data,targetExperience) => {
      data.sort((a, b) => {
        // Compare both rating and experience
        // const ratingComparison = b[13] - a[13]; // Assuming rating is at index 14
        const experienceComparison = a[12] - b[12]; // Assuming years of experience is at index 13
        const availabilityComparison = a[15] - b[15]; // Assuming availability percentage is at index 15
   
      // Prioritize entries with experience greater than or equal to the target experience
      if (a[12] >= targetExperience && b[12] < targetExperience) {
        return -1; // Move entry A up
      } else if (a[12] < targetExperience && b[12] >= targetExperience) {
        return 1; // Move entry B up
      }
   
      // if (a[12] >= targetExperience && b[12] >= targetExperience) {
      //   if (availabilityComparison !== 0) {
      //     return availabilityComparison; // Higher availability comes first
      //   }
      // }
   
      // If both have experience greater than or equal to the target experience, compare by rating
      return experienceComparison === 0 ? availabilityComparison : experienceComparison;
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
          skills: skills.toUpperCase(),
          experience,
          location,
        });
        // console.log('Type of Employee ID:', typeof response.data.final_data[0][1]);
        
        console.log('this is my f_data',response.data.new_data)
        if (response.data && Array.isArray(response.data.new_data)) {
          const sortedAndHighlightedResults = sortAndHighlight(response.data.new_data,parseInt(experience, 10));
          const newratingsort = ratingsort(response.data.new_data)
          setResults(sortedAndHighlightedResults);
   
          // setResults(response.data.new_data);
          // setSkillset(response.data.skillset); //remove this line later it doesnot work
          setSkillSetDict(sortedAndHighlightedResults.skillSetDict); // Set skillSetDict in state
        } else {
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
  
    //  Mapping COuntr
  
    // const handleBestFitClick = () => {
    //   if (results.length > 0) {
    //     const sortedAndHighlightedResults = sortAndHighlight(results,parseInt(experience, 10));
    //     setResults(sortedAndHighlightedResults);
    //   } else {
    //     console.warn('No results to sort and highlight.');
    //   }
    // };
  
    const handleDownloadExcel = () => {
      const excelData = results.map((result) => ({
        'load_date': result[0],
        'Employee_ID': result[1],
        'Resource_Name': result[2],
        'Supervisor_Name': result[3],
        'RM_Role': result[4],
        'Pool_Name': result[5],
        'Practice_Name': result[6],
        'Location_Name': result[7],
        'Email': result[8],
        'Competency_Code': result[9],
        // 'Competency_Desciption': result[10],
        'years_acquired': result[10],
        'years_used': result[11],
        'years_of_experience': result[12],
        'Rating': result[13],
        'Interest_Level' :result[14]
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
      console.log("this is my results",results)
    };
    const handleSelect = (selectedList) => {
      if (selectedList && Array.isArray(selectedList)) {
        const selectedLabels = selectedList.flatMap(option => option?.options?.map(opt => opt?.value) || []);
        setLocation([...selectedLabels]);
      }
    };
    const handleRemove = (selectedList) => {
      console.log("Selected List on Remove:", selectedList);
    
      if (selectedList && Array.isArray(selectedList)) {
        const removedLabels = selectedList.flatMap(option => option?.options?.map(opt => opt?.value) || []);
        setLocation(location.filter(label => !removedLabels.includes(label)));
      }
    };
    
  
    return (
      <>
      <body>
        <div className='searchbar'>
      
          </div>
          </body>

      <div className="app-container" style={{backgroundColor:'lightgray'}}>
        <form onSubmit={handleSubmit}>
            <div className='filters'>
            <div className='skills'>
          {/* <label htmlFor="skills"><br />Skills:      </label> */}
          <input
            type="text"
            name="skills"
            id="skills"
            placeholder='skills'
            value={skills}
            onChange={(e) => {
              setSkills(e.target.value);
              handleSkillInputChange(e.target.value);
            }}
            style={{ height:'40px',width:'200px',borderRadius:'5px', borderColor:'Grey',borderWidth:'1px' ,paddingLeft:'10px'}}   
          />
          </div>
        <div className='experience'>
          {/* <label htmlFor="experience"><br />Experience:   </label> */}
          <input
            type="text"
            name="experience"
            id="experience"
            placeholder='experience'
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            style={{ height:'40px',width:'200px',borderRadius:'5px', borderColor:'Grey',borderWidth:'1px', paddingLeft:'10px'}}
          />
          </div>





        <div className='location'>
          {/* <label htmlFor="location"><br />Location:</label> */}
          {/* <div class="multiselectSearchbox"> */}
          {/* </div> */}
          
          <div className="multiselect-wrapper">
          <Multiselect 
        placeholder='location'
        className="custom-multiselect"

        options={locationOptions}
        selectedValues={locationOptions.flatMap(option => option.options.filter(opt => location.includes(opt.label)))}
        onSelect={handleSelect}
        onRemove={handleRemove}
        displayValue="label"
        // limit={5}
        // style={{ height:'20px',width:'200px',borderRadius:'5px', borderColor:'Grey',borderWidth:'1px', paddingLeft:'10px'}}
        />
        </div>
          </div>
          </div>

         
              
        <div class='buttonsOfSearchAndDownload'>
          {/* <div><button type="submit" style={{ marginRight: '1rem', padding:'10px',width:'150px',backgroundColor:'#C5EBAA' ,border:'1', borderRadius:'20px', fontWeight:'550', color:'white' }}>
            Search
          </button>
          </div> */}
          <div className='row'>
            <div className='col-6'>
          <button class="button-19" type="submit" role="button">Search</button>
          </div>
          {/* <button type="button" onClick={handleBestFitClick} style={{ marginRight: '1rem' }}>
            Best Fit
          </button> */}
          <div className='col-6'>
            <button class="button-19" type="button" onClick={handleDownloadExcel}>Download</button>
          
          </div>
          </div>
          </div>
        </form>
        </div>
        {results.length > 0 ? (
          <div className="results-container">
            <h2>Search Results:</h2>
            <div className="results-box">
              <table className="results-table">
                <thead className='headerRow'>
                  <tr>
                    {/* <th>load_date</th> */}
                    <th>EmpID</th>
                    <th>Name</th>
                    <th>Supervisor</th>
                    {/* <th>RM_Role</th> */}
                    {/* <th>Pool_Name</th> */}
                    <th>Practice</th>
                    <th>Location</th>
                    {/* <th>Email</th> */}
                    <th>Competency(rating)</th>
                    {/* <th>Competency Description</th> */}
                    {/* <th>years_acquired</th> */}
                    {/* <th>years_used</th> */}
                    <th>experience</th>
                    {/* <th>Rating</th> */}
                    {/* <th>Interest_Level</th> */}
                    <th>Availibility</th>
                    <th>skillset</th>
  
                  </tr>
                </thead>
  
                <tbody>
                {/* console.log('Results:', results);
                console.log('SkillSetDict:', skillSetDict); */}
                  {results.map((result, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: result.highlight ? 'white' : 'transparent',
                        color: result.highlight ? 'black' : 'inherit',
                      }}
                    >
                      {/* <td>{result[0]}</td> */}
                      <td>{Number(result[1])}</td>
                      {/* {console.log('Employee ID Type:',typeof String(results[1]))} */}
                      {/* {console.log('Employee ID Type:', typeof (result && result[1]))} */}
  
                      <td>{result[2]}</td>
                      
                      
                      
                      <td>{result[3]}</td>
                      {/* <td>{result[4]}</td> */}
                      {/* <td>{result[5]}</td> */}
                      <td>{result[6]}</td>
                      <td>{result[7]}</td>
                      {/* <td>{result[8]}</td> */}
                      {/* TEsting for new column rating and comptenecy code */}
                      {/* <td>{result[9]}</td> */}
                        {/* merge the competency and rating column */}
                      {
                      result[9] && result[13]
                        ?(
                          result[9].includes(',') && result[13].includes(',')
                          ? result[9].split(',').map((skill,skillIndex,array) => {
                            const ratings = result[13].split(',');
                            // This line check if the rating column has an empty string then it will return an empty value
                            const rating = ratings[skillIndex] || '';
                            const isLastkill = skillIndex === array.length -1;
                            const comma =isLastkill ? '': ',';
                            return (
                              <div key ={skillIndex}>
  
                                {`${skill}(${rating})${comma}`}
                              </div>
                            );
                          }
                        )
                          : (
                          <div>
                            {`${result[9]}(${result[13]})`}
                          </div>
                          )
                        )
                        : (
                          <div>
                            {/* Handle cases where either 9th or 13th column is empty */}
                            Invalid data format in rating and competency column
                          </div>
                        )
  
                      }
                      {/* {result[9] && result[13]
                        ? (
                          result[9].includes(',') && result[13].includes(',')
                            ? result[9].split(',').map((skill, skillIndex) => {
                                const ratings = result[13].split(',');
                                const rating = ratings[skillIndex] || ''; // Handle potential index out of bounds
                                return (
                                  <div key={skillIndex}>
                                    {`${skill}(${rating})`}
                                  </div>
                                );
                              })
                            : (
                              <div>
                                {`${result[9]}(${result[13]})`}
                              </div>
                            )
                        )
                        : (
                          <div>
                            {/* Handle cases where either 9th or 13th column is empty */}
                           
  
  
                      {/* <td>{result[10]}</td> */}
                      {/* <td>{result[11]}</td> */}
                      <td>{result[12]}</td>
                      {/* <td>{result[13]}</td> */}
                      {/* <td>{result[14]}</td> */}
                      <td>{(100-(result[15] * 100)).toFixed(2)}%</td>           
                      <td>{result[16]}</td>
                      
                      
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
      
      </>
    )
}