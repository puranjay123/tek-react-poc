from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3
import re  # Import the regular expression module

app = Flask(__name__, template_folder='D:\\POC github\\tek-react-poc\\tek-employee\\public')
CORS(app, resources={r"/*": {"Access-Control-Allow-Origin": "*"}})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST', 'OPTIONS'])
def search():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = app.make_default_options_response()
    else:
        data = request.get_json()
        skills = data.get('skills')
        experience = data.get('experience')
        location = data.get('location')
        print("Skills:", skills)
        print("Experience:", experience)
        print("Location:", location)

        conn = sqlite3.connect('C:\\Users\\pkwatra\\OneDrive - ALLEGIS GROUP\\RESOURCE PLANNER HELPER\\resourceplanner.db')
        cursor = conn.cursor()

        # Build and execute the SQL query with LIKE for fuzzy matching
        query = "SELECT * FROM competency WHERE Competency_Code LIKE ? AND Years_of_Work_Experience >= ? AND location_Name LIKE ?"

        # Use '%' to perform fuzzy matching
        cursor.execute(query, (f'%{skills}%', experience, f'%{location}%'))
        results = cursor.fetchall()
        print("This is result", results)

        conn.close()
        response = jsonify(results)
        print(response)

    # Set CORS headers
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'

    return response

if __name__ == '__main__':
    app.run(debug=True)
