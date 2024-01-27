from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    skills = request.form.get('skills')
    Experience = request.form.get('experience')
    location = request.form.get('location')

    # Create your SQLite connection and cursor
    conn = sqlite3.connect('C:\Users\pkwatra\OneDrive - ALLEGIS GROUP/RESOURCE PLANNER HELPER/resourceplanner.db')
    cursor = conn.cursor()

    # Build and execute the SQL query based on the provided parameters
    # query = "SELECT * FROM competency WHERE Competency_Code=" + skills + " AND Years_of_Work_Experience="+experience+" AND location_Name="+location
    # cursor.execute(query)
    query = "SELECT * FROM competency WHERE Competency_Code=? AND Years_of_Work_Experience=? AND location_Name=?"
    cursor.execute(query, (skills, Experience, location))
    results = cursor.fetchall()
    print(results)
    #Bangalore-EcoWorld
    # Close the connection
    conn.close()

    return render_template('index.html', results=results)

if __name__ == '__main__':
    app.run(debug=True)
