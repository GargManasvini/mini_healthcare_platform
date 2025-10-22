# Dr.ViKi Mini Healthcare Platform

A simple MERN-stack web application that simulates a healthcare platform with health tracking, analysis, and recommendations.



## Features

*   User **Signup / Login** with JWT authentication
    
*   **Health Input Form** with fields: sleep, appetite, stress, activity
    
*   **Real-time Health Result** with Ayurvedic-inspired mock AI logic
    
*   **Latest Result Dashboard** with pie chart visualization
    
*   **Health History** with all past submissions and averages
    

* * *

## Tech Stack

*   **Frontend:** React, React Router, Tailwind CSS, Recharts
    
*   **Backend:** Node.js, Express
    
*   **Database:** MongoDB
    
*   **Authentication:** JWT, cookies
    
*   **HTTP Requests:** Axios
    

* * *

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/GargManasvini/mini_healthcare_platform.git
    cd Mini_healthcare_platform
    ```

2.  **Backend setup:**
    * Navigate to the backend directory and install dependencies:
        ```bash
        cd backend
        npm install
        ```
    * Create a `.env` file in the backend folder with the following content:
        ```env
        MONGO_URI=<your_mongodb_connection_string>
        JWT_SECRET=<your_secret_key>
        PORT=5000
        ```
    * Start the backend server:
        ```bash
        npm run dev
        ```

3.  **Frontend setup:**
    * Navigate to the frontend directory (from the root) and install dependencies:
        ```bash
        cd ../frontend
        npm install
        ```
    * Start the frontend development server:
        ```bash
        npm run dev
        ```

4.  Open `http://localhost:5173` in your browser.
    

* * *

## Usage

*   Sign up as a new user or login
    
*   Fill out the **Health Input Form**
    
*   Submit to see **latest health result** and recommendation
    
*   Navigate to **History** to view all past submissions and average metrics
    

* * *

## Dosha Result Logic (Mock AI)

The system uses a simple **Ayurvedic-inspired scoring system**:

*   **Vata Imbalance:** Low sleep or high stress
    
*   **Pitta Imbalance:** Extreme appetite or stress
    
*   **Kapha Imbalance:** Low physical activity
    
*   **Balanced:** None of the above dominate
    

Each submission is scored, and the dominant imbalance is displayed with a recommendation.

* * *

## Screenshots 


*   **Signup:**
![Signup Screenshot](./screenshots/Signup.png)


*   **Login:**
![Login Screenshot](./screenshots/Login.png)


*   **Dashboard:**
![Dashboard Screenshot](./screenshots/Dashboard.png)


    
*   **Health History:**
![History Screenshot](./screenshots/History.png)
    
    

* * *

## Author

Manasvini Garg