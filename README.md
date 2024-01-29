Libraries to install:
1. Flask
2. react
3. Python
4. flask_cors

## Running the Server

To run the server, follow these commands:

1. For Node.js server:
   ```bash
   npm start
   ```

2. For Flask server:
   ```bash
   python app.py
   ```

## Features

### Completed Tasks

1. **Search Bar Priority:** The search bar now loads on the home screen if no data is present. ✅
2. **Search Button Addition:** Added a search button near the search bar. ✅
3. **Multiple Words Functionality:** This feature is pending. ⛔
4. **Best Fit Option (Todo):** To be implemented.
5. **Download Button (Todo):** To be implemented.
6. **Suggestion in Search Bar (Todo):** To be implemented.
7. **Database Display:** Data is shown in a tabular format. ✅

### Error/Bug Fixes and Suggestions

1. **API Data Visibility Issue:**
   - Data is being fetched from the API but is not visible in the UI. Only half of the fields are displayed in a random order, making it difficult to understand the structure of the tables.
   ![image](https://github.com/puranjay123/tek-react-poc/assets/55429956/8655dc6f-9f69-4370-a57a-39400347daa3)

2. **React Components for Table Rendering:**
   - Consider leveraging React components for rendering tables. This can simplify the process and ensure a consistent tabular format without manual interventions.

3. **Handling Multiple Words:**
   - Multiple words functionality might not be necessary, as separate rows for distinct skills can be displayed for a particular employee.

4. **Predefined Suggestions:**
   - Suggestions in the search bar could be predefined or retrieved from the database for easier implementation.













