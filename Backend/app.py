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
        role ENUM('Seller', 'Buyer', 'Admin'),
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        first_name VARCHAR(255),
        last_name VARCHAR(255)
    )
''')
# Sample_data = {
#     'role': 'Seller',
#     'username': 'BHARAT',
#     'email': 'bARATH@sl.edu',
#     'password': 'password12345',
#     'first_name': 'BHARAT',
#     'last_name': 'User'
# }
# # # creating dummy record to get hash password entry in db
# hashed_password = hashlib.sha256(Sample_data['password'].encode()).hexdigest()
# cursor.execute('''
#     INSERT INTO Users (role,username, email, password, first_name, last_name)
#     VALUES (%s, %s, %s, %s, %s, %s)
# ''', (Sample_data['role'], Sample_data['username'], Sample_data['email'], hashed_password, Sample_data['first_name'], Sample_data['last_name']))
# db.commit()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS Category (
        category_Id INT AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(255)
    )
    AUTO_INCREMENT = 101
''')

# Create the "products" table if it doesn't exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS Products (
        product_id INT AUTO_INCREMENT PRIMARY KEY,
        product_name VARCHAR(255),
        product_desc TEXT,
        price DECIMAL(10, 2),
        image LONGBLOB,
        category_id INT,
        FOREIGN KEY (category_id) REFERENCES Category(category_Id)
    )
''')


# Sample_data1={'category_name': 'Electronics'
# }
# cursor.execute('''
#     INSERT INTO Category (category_name)
#     VALUES (%s)
# ''', (Sample_data1['category_name'],))
# db.commit()

# Sample_product_data = {
#     'product_name': 'Laptop',
#     'product_desc': 'High-performance laptop with the latest specs.',
#     'price': 999.99,
#     'image': b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x01\xf4...',
#     'category_id': 101  # Adjust the category_id to match the category you created
# }

# cursor.execute('''
#     INSERT INTO Products (product_name, product_desc, price, image, category_id)
#     VALUES (%s, %s, %s, %s, %s)
# ''', (Sample_product_data['product_name'], Sample_product_data['product_desc'], Sample_product_data['price'], Sample_product_data['image'], Sample_product_data['category_id']))
# db.commit()



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
@app.route('/fetch-products', methods=['GET'])
def fetch_products():
    # Fetch all products based on category
    category_id = request.args.get('category_id')

    cursor.execute('SELECT * FROM Products WHERE category_id = %s', (category_id,))
    products = cursor.fetchall()

    product_list = []
    for product in products:
        product_dict = {
            'product_id': product[0],
            'product_name': product[1],
            'product_desc': product[2],
            'price': float(product[3]),
            'category_id': product[5],
            'image':'.\lappy.jpg'
        }
        product_list.append(product_dict)

    return jsonify({'products': product_list})
if __name__ == '__main__':
    app.run(debug=True)
