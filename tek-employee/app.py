from flask import Flask, render_template, request
from flask_cors import CORS  # Import the CORS module
from flask import jsonify

import sqlite3

app = Flask(__name__,template_folder = 'C:\\Users\\Asus\\Desktop\\tek-poc\\React-app\\tek-employee\\public')
CORS(app,resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes in the app

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
        data = request.get_json()
        skills = data.get('skills')
        experience = data.get('experience')
        location = data.get('location')
        print("Skills:", skills)
        print("Experience:", experience)
        print("Location:", location)

        # Create your SQLite connection and cursor
        conn = sqlite3.connect('C:\\Users\\Asus\\Desktop\\tek-poc\\tek-react-poc\\Data\\resourceplanner.db')
        cursor = conn.cursor()

        # Build and execute the SQL query based on the provided parameters
        query = "SELECT * FROM competency WHERE Competency_Code=? AND Years_of_Work_Experience=? AND location_Name=? LIMIT 10"
        cursor.execute(query, (skills, experience, location))
        results = cursor.fetchall()
        print("This is reulst",results)

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
