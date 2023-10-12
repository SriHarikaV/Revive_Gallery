from decouple import config
from flask_mysqldb import MySQL

from flask import Flask

app = Flask(__name__)

mysql = MySQL(app)

class Database:
    def __init__(self):
        self.connection = mysql.connect(
            host=config('MYSQL_HOST'),
            user=config('MYSQL_USER'),
            password=config('MYSQL_PASSWORD'),
            database=config('MYSQL_DB')
        )

    def create_table(self):
        cursor = self.connection.cursor()

        # Create the users table
        cursor.execute("""CREATE TABLE IF NOT EXISTS users (
            id INT NOT NULL AUTO_INCREMENT,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            PRIMARY KEY (id)
        )""")

        self.connection.commit()
        cursor.close()

if __name__ == '__main__':
    database = Database()
    database.create_table()