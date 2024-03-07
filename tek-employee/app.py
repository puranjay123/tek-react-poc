from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3
import re  # Import the regular expression module
from fuzzywuzzy import process
import json
import json


app = Flask(__name__, template_folder='D:/New Resource planner/tek-react-poc/tek-employee/public')
CORS(app, resources={r"/*": {"Access-Control-Allow-Origin": "*"}})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['GET','POST', 'OPTIONS'])
@app.route('/search', methods=['GET','POST', 'OPTIONS'])
def search():
    if request.method == 'OPTIONS':
        # Handle preflight request check if the defined request can be accessible 
        response = app.make_default_options_response()
    else:
        data = request.get_json()
        skills = data.get('skills')
        experience = data.get('experience')
        location = data.get('location')
        location = tuple(location)
        print("This is my location",location)
           

        conn = sqlite3.connect('C:\\Users\\tdeepthi\\Downloads\\resourceplanner.db')
        cursor = conn.cursor()

        # Use process.extractOne to find the best match for skills
        query = "SELECT c.*, a.B___C_Utilization____Last_week FROM competency c FULL OUTER JOIN Availability a ON c.Employee_ID == a.Empl_ID WHERE Years_of_Work_Experience >= ? AND location_Name IN ({})".format(','.join(['?' for _ in location]))
        cursor.execute(query, (experience, *location))
        query = "SELECT c.*, a.B___C_Utilization____Last_week FROM competency c FULL OUTER JOIN Availability a ON c.Employee_ID == a.Empl_ID WHERE Years_of_Work_Experience >= ? AND location_Name IN ({})".format(','.join(['?' for _ in location]))
        cursor.execute(query, (experience, *location))
        results = cursor.fetchall()
        results = [list(t) for t in results]
        # print("This is my results",results)
        

        # skill_list = [skill.strip() for skill in skills.split(',')]
        # Fuzzy matching for skills
        fuzzy_results = []

        # include this code if we want to match all the skills with the required threshold
        # Fuzzy matching for each skill
        skill_list = [skill.strip() for skill in skills.split(',')]
        for result in results:
            competency_code = result[9]  # Assuming Competency_Code is the second column
           
            skill_matches = [process.extractOne(skill, [competency_code]) for skill in skill_list]
            
            # Check if all skills have a score above the threshold
            if any(score >= 70 for _, score in skill_matches):
                fuzzy_results.append(result)
        #         #*************************************

        print("Fuzzy Search Results:", fuzzy_results)

        conn.close()
        response = jsonify(fuzzy_results)
        print(response)

    # Set CORS headers
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Content-Type'] = 'application/json'  # Set Content-Type header


    return response

if __name__ == '__main__':
    app.run(debug=True)