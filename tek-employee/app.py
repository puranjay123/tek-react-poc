from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3
import re  # Import the regular expression module
from fuzzywuzzy import process
import json


app = Flask(__name__, template_folder='D:\\POC github\\tek-react-poc\\tek-employee\\public')
CORS(app, resources={r"/*": {"Access-Control-Allow-Origin": "*"}})

@app.route('/')
def index():
    return render_template('index.html')

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
           

        conn = sqlite3.connect('C:\\Users\\pkwatra\\OneDrive - ALLEGIS GROUP\\RESOURCE PLANNER HELPER\\resourceplanner.db')
        cursor = conn.cursor()

        # Use process.extractOne to find the best match for skills
        query = "select c.*,a.B___C_Utilization____Last_week from competency c full outer join Availability a on c.Employee_ID==a.Empl_ID WHERE Years_of_Work_Experience >= ? AND location_Name LIKE ?"
        cursor.execute(query, (experience, f'%{location}%'))
        results = cursor.fetchall()
        results = [list(t) for t in results]
        print("This is my results",results)
        

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

        # print("Fuzzy Search Results:",fuzzy_results)
        
        
        skillSet_dict ={}
        curr_list=[]
        for employee_data in fuzzy_results:
            if employee_data[1] in skillSet_dict:
                
                if employee_data[9] not in curr_list:
                    curr_list =skillSet_dict[employee_data[1]]
                    curr_list.append(employee_data[9])
                    skillSet_dict[employee_data[1]] =curr_list
                else:
                    continue
                    # print("this is my curr_list",json.dumps(skillSet_dict,indent=4))
                # print("this is my skill set dict",skillSet_dict)
            else:
                new_list = [employee_data[9]]
                skillSet_dict[employee_data[1]]=new_list # Maps
            #    Optimizing the final data
                #  listing  the unique employee ID
        # print("this is my skill set dict",skillSet_dict) 
        def newdiff(fuzzy_results):
            unique_emp_ids = set()
            new_data = []
            for record in fuzzy_results:
                emp_id = str(record[1])
                if emp_id not in unique_emp_ids:
                    unique_emp_ids.add(emp_id)
                    new_data.append(record)

            # print("This is my new_data",new_data)
            return new_data
        
        # adding skillset column to the new_data directly without API 
        ## make a API for this later for future optimizations
        final_data=newdiff(fuzzy_results)
        for sublist in final_data:
            employee_id= sublist[1]
            sublist.append(skillSet_dict.get(employee_id,None))
            # sublist[-1] = skillSet_dict
        print("This is my final_data",final_data)
        conn.close()

        # print(curr_list)
        response_data = {
            # 'fuzzy_results':fuzzy_results,
            'new_data' :final_data,
            # 'skillset': [record[9] for record in final_data] ,
            'skillSet_dict': skillSet_dict  # Include skillSet_dict in the response
# Extracting skillset from final_data

            # 'curr_list':skill
        }


        response = jsonify(response_data)
        print(response)

    # Set CORS headers
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Content-Type'] = 'application/json'  # Set Content-Type header


    return response

if __name__ == '__main__':
    app.run(debug=True)
