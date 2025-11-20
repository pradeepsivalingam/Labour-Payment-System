# Labour-Payment-System

The Labour Payment System is a digital platform designed to simplify and automate the process of managing labour details, daily work updates, attendance tracking, and payment calculations. Many small businesses, construction sites, and labour-based industries still depend on manual registers or Excel sheets to record daily work and wages, which often leads to errors, delays, and confusion. This system provides a structured and efficient way to handle these tasks with accuracy and transparency.

The application allows the admin or supervisor to register labour workers with essential details such as name, contact number, job type, and wage rate. Once registered, the supervisor can record each worker’s daily work updates, including the number of hours or shifts completed, overtime, and leave information. The system then automatically generates weekly or monthly wage calculations based on the stored data. It eliminates the need for manual calculations and ensures that payments are fair, consistent, and error-free.

The platform supports adding work updates for all days, tracking week numbers with start and end dates, and storing them in the database for future reference. Reports can be generated to view the worker’s performance, attendance, and total earnings. This helps both the employer and the labourer maintain clarity over the work done and the payments received.

To make the system easier to use, it includes features like login authentication, forgot password with OTP verification, user type selection, and a clean dashboard interface. The backend is built using Spring Boot with a relational database like MySQL to ensure fast performance, data security, and scalability. The frontend can be developed using React or Flutter for a smooth and user-friendly experience.

Overall, the Labour Payment System reduces manual effort, minimizes errors, and improves transparency in wage management. It is an ideal solution for contractors, site supervisors, and small business owners who want a reliable and efficient method to manage labour payments. By digitalizing the entire workflow—from daily updates to final payment—this system ensures accuracy, saves time, and helps maintain trust between employers and workers.


# Features
# Labour Management

Add, update, and delete labour worker profiles

Store details like name, mobile number, wage rate, and job type

# Daily Work Tracking

Record daily shifts/hours for each worker

Add overtime, leave, and remarks

Automatically generates weekly and monthly summaries

# Payment Calculation

Auto-calculate wages based on daily entries

Includes overtime and deductions (if any)

View payment history for each worker

# Week Number Generator

Backend API generates week numbers with start and end dates (Sunday–Saturday)

Saves all week details in weeks table

Helps in weekly payment cycle

# Authentication

Secure login system

Forgot password feature with OTP verification (mobile/email)

# User Interface

Simple and clean dashboard

Role-based access (Admin, User – optional)

Mobile-friendly UI (React/Flutter)




# Tech Stack
# Backend

Spring Boot

MySQL

Spring Data JPA

REST API Architecture

# Frontend

React or Flutter (based on your implementation)

Axios/Fetch for API calls

# Tools & Environment

Java 17+

Maven

Postman (API testing)

Git & GitHub
