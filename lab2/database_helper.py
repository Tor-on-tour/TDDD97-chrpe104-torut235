#This file will contain all the functions that access and control the database and shall contain some SQL
#scripts. This file will be used by the server to access the database. This file shall NOT contain any
#domain functions like signin or signup and shall only contain data-centric functionality like
#find_user(), remove_user(), create_post() and . E.g. Implementing sign_in() in server.py shall
#involve a call to find_user() implemented in database_helper.py .
import sqlite3
from flask import g

#Kommunicerar med databasen - hamtar och lagger data. snackar inte med js-filer

DATABASE = 'database.db'


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

def create_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row          # "annars far man ut en tuple, nu far man en dictionary" - Olle anno 2017
    cursor = conn.cursor()
    return cursor

def add_user(user_obj):
    cursor = create_connection()
    SQL_perform = 'INSERT INTO users VALUES(:token, :email, :password, :firstname, :familyname, :gender, :city, :country)'
    cursor.execute(SQL_perform, user_obj)
    cursor.connection.commit()

def remove_user(user_email):
    cursor = create_connection()
    cursor.execute('DELETE FROM users WHERE email=?',user_email)
    cursor.connection.commit()

#find user BY email
def find_user(user_email):
    cursor = create_connection()
    cursor.execute('SELECT email FROM users WHERE email = ?', (user_email,))
    if cursor.fetchone() == None:
        return False
    else:
        return True

def change_password_db(user_email, user_new_password):
    cursor = create_connection()
    cursor.execute('UPDATE users SET password = ? WHERE email = ?', (user_new_password, user_email))
    cursor.connection.commit()

def get_user_data_by_email_db(user_email):
    cursor = create_connection()
    cursor.execute('SELECT * FROM users WHERE email = ?', (user_email,))
    return dict(cursor.fetchone() or{})

def change_token_db(user_token, user_email):
    cursor = create_connection()
    cursor.execute('UPDATE users SET token = ? WHERE email = ?', (user_token, user_email))
    cursor.connection.commit()

def add_user_message_db(msg_obj):
    cursor = create_connection()
    SQL_perform = 'INSERT INTO messages VALUES(:msg_id, :from_email, :to_email, :content, :msg_timestamp)'
    cursor.execute(SQL_perform, msg_obj)
    cursor.connection.commit()

def get_user_messages_by_email_db(user_email):
    cursor = create_connection()
    cursor.execute('SELECT * FROM messages WHERE to_email = ?', (user_email,))
    return cursor.fetchall()
