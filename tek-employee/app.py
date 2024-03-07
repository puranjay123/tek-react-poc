from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3
import re  # Import the regular expression module
from fuzzywuzzy import process
import json


app = Flask(__name__, template_folder='D:/New Resource planner/tek-react-poc/tek-employee/public')
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
        print("before location",location)
        location = tuple(location)
        print("This is my location",location)
           

        conn = sqlite3.connect('C:\\Users\\tdeepthi\\Downloads\\resourceplanner.db')
        cursor = conn.cursor()

        # Use process.extractOne to find the best match for skills
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

        # Code for multiple competency code
        # based on user input skills mappend with emplyee id
        competency_dict = {}
        threshold =70
        # skill_list = [skill.strip() for skill in skills.split(',')]
        for x in fuzzy_results:
            if x[1] in competency_dict:
                new_cur_list = competency_dict[x[1]]
                skill_matches = [process.extractOne(skill,[x[9]]) for skill in skill_list]
                if any(score >= threshold for _, score in skill_matches):
                # if any(skill.lower() in x[9].lower() for skill in skill_list):  # Check if any skill partially matches x[9]
                   if x[9] not in new_cur_list:
                        new_cur_list.append(x[9])
                        competency_dict[x[1]] = new_cur_list

            else:
                competency_new_list = []
                skill_matches = [process.extractOne(skill, [x[9]]) for skill in skill_list]
                if any(score >= threshold for _, score in skill_matches):
                # if any(skill.lower() in x[9].lower() for skill in skill_list):
                    competency_new_list.append(x[9])
                competency_dict[x[1]] = competency_new_list
        # print("my new list", competency_dict)



       

        # code for multiple ratings for the skill
        rating_dict={}
        
        for x in fuzzy_results:
            if x[1] in rating_dict:
                curr_dict=rating_dict[x[1]]
                # print(curr_dict)
                if x[9] not in curr_dict.keys():
                    curr_dict[x[9]]=x[13]
                    rating_dict[x[1]]=curr_dict
                else:
                    continue
            else:
                new_dict={}
                new_dict[x[9]]=x[13]
                # print("this is my new dict",new_dict)
                rating_dict[x[1]]=new_dict
                # print("this is rating dict",rating_dict)
                
        
                
        


        print("Fuzzy Search Results:",fuzzy_results)
                
        # create a empty dictionary map it with employye ID and match with employee ID; skills
        
        #  this is returning the 
        skillSet_dict ={}
        # curr_list=[]
        for employee_data in results:
            if employee_data[1] in skillSet_dict:
                curr_list=skillSet_dict[employee_data[1]]
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
        # print("This is my final results",final_data)
        for sublist in final_data:
            employee_id= sublist[1]
            # sublist.extend([','.join(skillSet_dict.)])
            skill_set_list=skillSet_dict.get(employee_id, [])
            # print("this is my skill_set_list",skill_set_list)
            sublist.extend([','.join(skill_set_list)])
        # compenetncy code appeding
        for sublist in final_data:
            employee_id= sublist[1]
            # sublist.extend([','.join(skillSet_dict.)])
            skill_set_list=competency_dict.get(employee_id, [])
            # print("this is my skill_set_list",skill_set_list)
            sublist[9] = ','.join(skill_set_list)
        print("this is my sublist",sublist)
        print("This if my sublist_final_data",final_data)

        # rating appending
        for sublist in final_data:
            employee_id = sublist[1]
            rating_data = rating_dict.get(employee_id, {})
            # Assuming you want to concatenate the ratings for all skills
            rating_values = [f" {rating}" for skill, rating in rating_data.items()]
            sublist[13] = ','.join(rating_values)

            

            # sublist[-1] = skillSet_dict
        # print("This is my final_data",json.dumps(final_data,indent=4))
        conn.close()

        # print(curr_list)
        response_data = {
            # 'fuzzy_results':fuzzy_results,
            'new_data' :final_data,
            # 'skillset': [record[9] for record in final_data] ,
            'skillSet_dict': skillSet_dict  
            # 'final_data': final_data
            # Include skillSet_dict in the response
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