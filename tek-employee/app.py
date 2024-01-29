from flask import Flask, render_template, request
from flask_cors import CORS  # Import the CORS module
from flask import jsonify

import sqlite3

app = Flask(__name__,template_folder = 'D:\\POC github\\tek-react-poc\\tek-employee\\public')
CORS(app,resources={r"/*": {"Access-Control-Allow-Origin": "*"}})  # Enable CORS for all routes in the app

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['GET','POST', 'OPTIONS'])
def search():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = app.make_default_options_response()
        print(response)
    else:
        # request.headers["Content-Type"] = "application/json"
        data = request.get_json()
        skills = data.get('skills')
        experience = data.get('experience')
        location = data.get('location')
        print("Skills:", skills)
        print("Experience:", experience)
        print("Location:", location)

        # Create your SQLite connection and cursor
        conn = sqlite3.connect('D:\\POC github\\tek-react-poc\\Data\\resourceplanner.db')
        cursor = conn.cursor()

        # Build and execute the SQL query based on the provided parameters
        query = "SELECT * FROM competency WHERE Competency_Code=? AND Years_of_Work_Experience=? AND location_Name=? LIMIT 10"
        cursor.execute(query, (skills, experience, location))
        results = cursor.fetchall()
        print("This is result",results)

        # query_schema = "select * from resourceplanner.COLUMNS where TABLE_NAME='competency'"
        # cursor.execute(query_schema)
        # results_schema =cursor.fetchall()
        # print("This is the schema",results_schema)

        # Close the connection
        conn.close()
        response = jsonify(results)
        print(response)

        # response = app.make_response(render_template('index.html', results=results))

    # Set CORS headers
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    

    return response

if __name__ == '__main__':
    app.run(debug=True)
