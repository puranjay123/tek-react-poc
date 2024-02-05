from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3
import re  # Import the regular expression module
from fuzzywuzzy import process


app = Flask(__name__, template_folder='D:\\POC github\\tek-react-poc\\tek-employee\\public')
CORS(app, resources={r"/*": {"Access-Control-Allow-Origin": "*"}})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST', 'OPTIONS'])
def search():
    if request.method == 'OPTIONS':
        # Handle preflight request check if the defined request can be accessible 
        response = app.make_default_options_response()
    else:
        data = request.get_json()
        skills = data.get('skills')
        experience = data.get('experience')
        location = data.get('location')
        print("Skills:", skills)
        print("Experience:", experience)
        print("Location:", location)

        # skill_list = [skill.strip() for skill in skills.split(',')]

        conn = sqlite3.connect('C:\\Users\\pkwatra\\OneDrive - ALLEGIS GROUP\\RESOURCE PLANNER HELPER\\resourceplanner.db')
        cursor = conn.cursor()

        # Use process.extractOne to find the best match for skills
        query = "SELECT * FROM competency WHERE Years_of_Work_Experience >= ? AND location_Name LIKE ?"
        cursor.execute(query, (experience, f'%{location}%'))
        results = cursor.fetchall()

        # Fuzzy matching for skills
        fuzzy_results = []
        for result in results:
            competency_code = result[9]  # Assuming Competency_Code is the second column
            match, score = process.extractOne(skills, [competency_code])
            # print("This is the match",match)
            print("this is the score",score)
            
            # set threshold whatever kumran sir told later now its 80% high accuracy.
            if score >= 80:
                fuzzy_results.append(result)

        # include this code if we want to match all the skills with the required threshold
        # Fuzzy matching for each skill

        # for result in results:
        #     competency_code = result[9]  # Assuming Competency_Code is the second column
        #     skill_matches = [process.extractOne(skill, [competency_code]) for skill in skill_list]

        #     # Check if all skills have a score above the threshold
        #     if all(score >= 80 for _, score in skill_matches):
        #         fuzzy_results.append(result)
                #*******************************************



                

        print("Fuzzy Search Results:", fuzzy_results)

        conn.close()
        response = jsonify(fuzzy_results)
        print(response)

    # Set CORS headers
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'

    return response

if __name__ == '__main__':
    app.run(debug=True)
