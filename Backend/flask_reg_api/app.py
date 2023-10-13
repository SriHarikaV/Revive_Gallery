from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
import hashlib
import os

app = Flask(__name__)

app.config['MYSQL_HOST'] = "localhost"
app.config['MYSQL_USER'] = "root"
app.config['MYSQL_PASSWORD'] = "12345678"
app.config['MYSQL_DB'] = "bkd_db"

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


@app.route('/products', methods=['GET'])
def products():
    try:
        # Create a cursor to interact with the database
        cur = mysql.connection.cursor()

        # Get all products from the database
        cur.execute("SELECT * FROM products")
        products = cur.fetchall()
        cur.close()

        return jsonify(products), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/products/create', methods=['POST'])
def create_product():
    try:
        # checking if table exists
        cur = mysql.connection.cursor()
        cur.execute("SHOW TABLES LIKE 'products'")
        result = cur.fetchone()

        if not result:
            # Create the products table
            cur.execute("""CREATE TABLE IF NOT EXISTS products (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                price FLOAT NOT NULL,
                PRIMARY KEY (id)
            )""")
            mysql.connection.commit()
            cur.close()

    
        # Get product data from the POST request
        name = request.json['name']
        price = request.json['price']

        # Validate the input (you can add more validation as needed)
        if not name or not price:
            return jsonify({'message': 'Name and price are required'}), 400

        # Create a cursor to interact with the database
        cur = mysql.connection.cursor()

        # Insert the new product into the database
        cur.execute("INSERT INTO products (name, price) VALUES (%s, %s)", (name, price))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Product created successfully'}), 201

    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
    
if __name__ == '__main__':
    app.run(debug=True)

