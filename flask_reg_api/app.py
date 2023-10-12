from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
import hashlib
from decouple import config

app = Flask(__name__)

app.config['MYSQL_HOST'] = config('MYSQL_HOST')
app.config['MYSQL_USER'] = config('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = config('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = config('MYSQL_DB')

mysql = MySQL(app)

@app.route('/register', methods=['POST'])
def register():
    try:
        # check if table exists
        cur = mysql.connection.cursor()
        cur.execute("SHOW TABLES LIKE 'users'")
        result = cur.fetchone()

        if not result:
            # Create the users table
            cur.execute("""CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL AUTO_INCREMENT,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                PRIMARY KEY (id)
            )""")
            mysql.connection.commit()
            cur.close()

            
        # Get user data from the POST request
        username = request.json['username']
        password = request.json['password']

        # Validate the input (you can add more validation as needed)
        if not username or not password:
            return jsonify({'message': 'Username and password are required'}), 400

        # Hash the password using hashlib
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        # Create a cursor to interact with the database
        cur = mysql.connection.cursor()

        # Check if the username is already in use
        cur.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cur.fetchone()

        if user:
            return jsonify({'message': 'Username already exists'}), 400

        # Insert the new user into the database
        cur.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed_password))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Registration successful'}), 201

    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)

