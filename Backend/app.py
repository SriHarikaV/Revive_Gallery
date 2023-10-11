#Step1: db Connection
#step2: table creation if that doepip install flasksn't exists
#step3: password hasing
#step4: logic to verify the details db hashed passord and db hashed password

import mysql.connector
from flask import Flask, request, jsonify
import hashlib

app = Flask(__name__)

#database connection creation
db = mysql.connector.connect(
    host='localhost',
    user='root',
    password='HarikaB@1998',
    database='Revive_Gallery'
)
cursor = db.cursor()

# Creating the table if doesn't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Users (
        Id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        first_name VARCHAR(255),
        last_name VARCHAR(255)
    )
''')
# Sample_data = {
#     'username': 'BHARAT',
#     'email': 'bARATH@sl.edu',
#     'password': 'password12345',
#     'first_name': 'BHARAT',
#     'last_name': 'User'
# }
# # creating dummy record to get hash password entry in db
# hashed_password = hashlib.sha256(Sample_data['password'].encode()).hexdigest()
# cursor.execute('''
#     INSERT INTO Users (username, email, password, first_name, last_name)
#     VALUES (%s, %s, %s, %s, %s)
# ''', (Sample_data['username'], Sample_data['email'], hashed_password, Sample_data['first_name'], Sample_data['last_name']))
db.commit()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Hash the password
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    # Check if the username and hashed password match in the database
    cursor.execute('SELECT * FROM Users WHERE username = %s AND password = %s', (username, hashed_password))
    user = cursor.fetchone()

    if user:
        return jsonify({'message': 'Login successfullly'})
    else:
        return jsonify({'message': 'Invalid credentials are given'}), 401

if __name__ == '__main__':
    app.run(debug=True)
