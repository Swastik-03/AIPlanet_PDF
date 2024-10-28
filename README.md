# PDF Question Answering System

This project is a PDF Question Answering System that allows users to upload PDF files and ask questions about their content. The system is built using FastAPI for the backend and React for the frontend.

## Table of Contents
* Features
* Technologies Used
* Setup Instructions
  * Backend Setup
  * Frontend Setup
* Usage
* License

## Features
* Upload PDF files to extract text content.
* Ask questions about the uploaded PDF content and receive answers.

## Technologies Used
* **Backend:** FastAPI, SQLAlchemy, PyMuPDF, LangChain
* **Frontend:** React, Fetch API
* **Database:** SQLite (or other databases configured via environment variables)

## Setup Instructions
1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
### Backend Setup -- https://github.com/Swastik-03/AIPlanet_PDF_Backend
1. **Navigate to the Backend Directory:**
   ```bash
   cd Backend
2. **Create a Python Virtual Environment:**
   ```bash
   python -m venv venv
   source venv/bin activate  
   # On Windows use 
   venv\Scripts\activate
3. **Install Required Packages:**   

    ```bash
    pip install -r requirements.txt
4. **Set Environment Variables:**
   Create a .env file in the root of the backend directory and add the following variables:   
   ```bash
    DATABASE_URL=sqlite:///./pdfs.db  # Adjust if using a different database
    AI21_API_KEY=your_ai21_api_key  # Replace with your actual AI21 API key
5. **Run the Backend Server:**
   Create a .env file in the root of the backend directory and add the following variables:   
   ```bash
    uvicorn app.main:app --reload
The backend server will be running at http://127.0.0.1:8000.

### Frontend Setup -- https://github.com/Swastik-03/AIPlanet_PDF_Frontend

1. **Navigate to the Frontend Directory:**
   ```bash
    cd frontend
2. **Install Node.js and npm:**
    Ensure that Node.js and npm are installed on your system. You can check by running:
   ```bash
   node -v
   npm -v
3. **Install Frontend Dependencies:**
   ```bash
   npm install
4. **Set Environment Variables:**
    Create a .env file in the root of the frontend directory and add the following variable:
   ```bash
   REACT_APP_API_URL=http://localhost:8000  # Backend API URL
5. **Run the Frontend Development Server:**
   ```bash
   npm start
The frontend application will be running at http://localhost:3000.

## Usage
* Open the frontend application in your web browser.
* Upload a PDF file using the provided interface.
* Ask questions related to the content of the uploaded PDF.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
