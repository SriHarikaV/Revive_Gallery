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
                email VARCHAR(255) NOT NULL,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                PRIMARY KEY (id)
            )""")
            mysql.connection.commit()
            cur.close()

        # Get user data from the POST request
        email = request.json['email']
        first_name = request.json['first_name']
        last_name = request.json['last_name']
        password = request.json['password']

        # Validate the input (you can add more validation as needed)
        if not email or not first_name or not last_name or not password:
            return jsonify({'message': 'All fields are required'}), 400
        
        # Hash the password
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        # Create a cursor to interact with the database
        cur = mysql.connection.cursor()

        # Insert the new user into the database
        cur.execute("INSERT INTO users (email, first_name, last_name, password) VALUES (%s, %s, %s, %s)", (email, first_name, last_name, hashed_password))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'User created successfully'}), 201
    
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

# category
@app.route('/category/categories', methods=['POST'])
def create_category():
    try:
        # check if table exists
        cur = mysql.connection.cursor()
        cur.execute("SHOW TABLES LIKE 'categories'")
        result = cur.fetchone()

        if not result:
            # Create the categories table
            cur.execute("""CREATE TABLE IF NOT EXISTS categories (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                PRIMARY KEY (id)
            )""")
            mysql.connection.commit()
            cur.close()

        # Get category data from the POST request
        name = request.json['name']

        # Validate the input (you can add more validation as needed)
        if not name:
            return jsonify({'message': 'Name is required'}), 400

        # Create a cursor to interact with the database
        cur = mysql.connection.cursor()

        # Insert the new category into the database
        cur.execute("INSERT INTO categories (name) VALUES (%s)", (name,))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Category created successfully'}), 201

    except Exception as e:
        return jsonify({'message': str(e)}), 500
    

@app.route('/category/categories', methods=['GET'])
def categories():
    try:
        # Create a cursor to interact with the database
        cur = mysql.connection.cursor()

        # Get all categories from the database
        cur.execute("SELECT * FROM categories")
        categories = cur.fetchall()
        cur.close()

        return jsonify(categories), 200

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
                category_id INT NOT NULL,
                price FLOAT NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (category_id) REFERENCES categories(id)
            )""")
            mysql.connection.commit()
            cur.close()

    
        # Get product data from the POST request
        name = request.json['name']
        category = request.json['category']
        price = request.json['price']

        # Validate the input (you can add more validation as needed)
        if not name or not category or not price:
            return jsonify({'message': 'All fields are required'}), 400
        
        # Create a cursor to interact with the database
        cur = mysql.connection.cursor()

        # Insert the new product into the database
        cur.execute("INSERT INTO products (name, category_id, price) VALUES (%s, %s, %s)", (name, category, price))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Product created successfully'}), 201
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)

