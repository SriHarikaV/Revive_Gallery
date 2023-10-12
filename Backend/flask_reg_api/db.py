from flask import Flask, jsonify
from flask_mysqldb import MySQL
from decouple import config

app = Flask(__name__)

app.config['MYSQL_HOST'] = config('MYSQL_HOST')
app.config['MYSQL_USER'] = config('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = config('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = config('MYSQL_DB')

mysql = MySQL(app)


def create_user_table():
    try:
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
        return jsonify({
            "message":"User Table Created"
        })
    except Exception as e:
        return jsonify({'message': str(e)})



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
        return jsonify({'message': 'Product Table successfully'})

    except Exception as e:
        return jsonify({'message': str(e)})
    