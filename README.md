# 🏠 Smart Room Allocation System

## 📌 Overview
The Smart Room Allocation System is a web-based application designed to automate and optimize the process of assigning rooms to students based on predefined preferences and constraints such as budget, location, and room type.

The system minimizes manual intervention, improves fairness, and enhances efficiency in hostel/room allocation.

---

## 🎯 Objectives
- Automate student room allocation
- Match students with suitable rooms based on preferences
- Improve transparency and efficiency

---

## 🚀 Features

### 👤 Student Module
- Register and log in
- Input preferences (location, budget, gender, room type, facilities)
- View allocated room details
- Receive recommendations


### 🤖 Smart Allocation
- Preference-based matching
- Efficient room assignment logic
- (Optional) AI-powered recommendations

---

## 🛠️ Tech Stack

### Frontend
- React Native  with Expo

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL 

### Other Tools
- REST APIs
- Git & GitHub
- Expo CLI
- Machine Learning / Recommendation Engine

---

## 📂 Project Structure

Git
---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/sarah98-bit/smart_hostel-app.git
cd smart_hostel-app

## Backend setup

cd smart-backend
npm install
npm run dev

## Frontend setup(mobile app)
npm install -g expo-cli
cd frontend
npm install
npx expo start /or 
npm start

## Machine learning Service
cd ml_service
source C:/Users/Administrator/OneDrive/Desktop/smart_hostel/ml_service/venv/Scripts/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000