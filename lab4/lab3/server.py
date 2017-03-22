#This file shall contain all the server side remote procedures, implemented using Python and Flask.
from flask import Flask, render_template, request, jsonify
from database_helper import *
import json
import uuid
import time
import datetime
import os
from geventwebsocket.handler import WebSocketHandler
from gevent.pywsgi import WSGIServer
from werkzeug.debug import DebuggedApplication
from flask_sockets import Sockets
from flask_bcrypt import Bcrypt

#Kommunicerar med Js-filer som hanterar frontend

logged_in_users = {}
socket_connections = {}
private_key = 'asdf'

app = Flask(__name__)
sockets = Sockets(app)
bcrypt = Bcrypt(app)

@app.route("/")
def index():
    return render_template("client.html")

#Webbsocket
@sockets.route('/get_sign_in_socket')
def get_sign_in_socket(ws):
    while True:
        token = ws.receive()
        print("\ntoken: " + str(token))
        if token == None:
            print("token = NONE \n")
            print(socket_connections)
            break
        email = logged_in_users.get(token)
        print("Socket connections below is before if")
        print(socket_connections)
        if email in socket_connections.keys(): # and socket_connections[email] is not ws:
            socket_connections[email].close()
        socket_connections[email] = ws
        print("Socket connections below is after if")
        print(socket_connections)


@app.route("/get_sign_out", methods=['POST'])
def get_sign_out():
    user_token = request.form.get('user_token')
    return sign_out(user_token)

#socket_connections[email].send(json.dumps({"message":"shutdown"}))
#del logged_in_users[token]
#del socket_connections[email]
def sign_out(user_token):
    if not logged_in_users == {}:
        for user in logged_in_users.keys(): #loopa alla tokens i logged_in_users
            if user == user_token:   #om token ar lika med var token
                email = logged_in_users.get(str(user_token))
                del logged_in_users[user]    #ta bort den inloggningen med hjalp av token
                change_token_db('',email)
                if email in socket_connections.keys() and not email in logged_in_users.values():
                    socket_connections[email].close()
                    del socket_connections[email]
                return jsonify({"success": True, "message": "User successfully signed out."})
    return jsonify({"success": False, "message": "User is not signed in."})


@app.route("/get_sign_in", methods=['POST'])
def get_sign_in():
    user_email = request.form.get('user_email')
    user_password = request.form.get('user_password')
    return sign_in(user_email, user_password)




def sign_in(user_email, user_password):
    hashed = get_user_data_by_email_db(user_email)['hash']
    salt = get_user_data_by_email_db(user_email)['salt']
    if find_user(user_email) and bcrypt.check_password_hash(hashed, user_password+salt):
        token = str(uuid.uuid4())[:3]
        logged_in_users[token] = user_email
        change_token_db(token, user_email)
        return jsonify({"success": True, "message": "Successfully signed in.", "data": token})
    else:
        return jsonify({"success": False, "message": "Wrong username or password."})

'''Hash + salt of password'''
#Used for sign_up or change_password
def hashAndSalt(pw):
    salt = str(uuid.uuid4())[:16]
    #print("\n\nsalt: " + salt + '\n\n')
    hashed = str(bcrypt.generate_password_hash(pw + salt).decode('utf-8'))
    hashSalt = []
    hashSalt.append(salt)
    print(hashSalt)
    hashSalt.append(hashed)
    return hashSalt

@app.route("/get_sign_up", methods=['POST'])
def get_sign_up():
    user_token = ""
    user_email = request.form.get('user_email')
    user_password = request.form.get('user_password')
    user_firstname = request.form.get('user_firstname')
    user_familyname = request.form.get('user_familyname')
    user_gender = request.form.get('user_gender')
    user_city = request.form.get('user_city')
    user_country = request.form.get('user_country')
    return sign_up(user_token,user_email, user_password, user_firstname, user_familyname, user_gender, user_city, user_country)

def sign_up(user_token, user_email, user_password, user_firstname, user_familyname, user_gender, user_city, user_country):
    hashSalt = hashAndSalt(user_password)
    salt = hashSalt[0]
    #print("salt fran signup :" + salt)
    hashed = hashSalt[1]
    if not find_user(user_email):
        user_obj = {'token' : user_token, 'email' : user_email, 'salt' : salt, 'hash' : hashed, 'firstname' : user_firstname, 'familyname' : user_familyname, 'gender' : user_gender, 'city' : user_city, 'country' : user_country}
        add_user(user_obj)
        return jsonify({"success": True, "message": "User successfully signed up."})
    else:
        return jsonify({"success": False, "message": "User already exists."})


@app.route("/get_change_password", methods=['POST'])
def get_change_password():
    user_token = request.form.get('user_token')
    user_old_password = request.form.get('user_old_password')
    user_new_password = request.form.get('user_new_password')

    return change_password(user_token, user_old_password, user_new_password)

def change_password(user_token, user_old_password, user_new_password):
    user_email = logged_in_users.get(user_token)
    hashed = get_user_data_by_email_db(user_email)['hash']
    salt = get_user_data_by_email_db(user_email)['salt']
    if bcrypt.check_password_hash(hashed, user_old_password+salt):
        hashSalt = hashAndSalt(user_new_password)
        new_salt = hashSalt[0]
        new_hashed = hashSalt[1]
        change_password_db(user_email, new_salt, new_hashed)
        return jsonify({"success": True, "message": "Password has been changed"})
    else:
        return jsonify({"success": False, "message": "Passwords doesn't match"})


@app.route("/get_get_user_data_by_token", methods=['POST'])
def get_get_user_data_by_token():
    user_token = request.form.get('user_token')
    if not logged_in_users == {}:
        return get_user_data_by_token(user_token)
    return jsonify({"success": False, "message": "User is not signed in."})

def get_user_data_by_token(user_token):

    user_object = get_user_data_by_email_db(logged_in_users.get(user_token))
    user_object_str = {"token" : user_token, "email" : user_object['email'], "firstname" : user_object['firstname'], "familyname" : user_object['familyname'], "gender" : user_object['gender'], "city" : user_object['city'], "country" : user_object['country']}
    return jsonify({"success" : True, "message" : "User data by token", "data" : user_object_str})


@app.route("/get_get_user_data_by_email", methods=['POST'])
def get_get_user_data_by_email():
    user_email = request.form.get('user_email')
    user_object = get_user_data_by_email_db(user_email)
    user_email = user_object['email']
    return get_user_data_by_email(user_email)

def get_user_data_by_email(user_email):
    user_object = get_user_data_by_email_db(user_email)
    user_token = request.form.get('user_token')
    user_object_str = {"email" : user_object['email'], "firstname" : user_object['firstname'], "familyname" : user_object['familyname'], "gender" : user_object['gender'], "city" : user_object['city'], "country" : user_object['country']}
    return jsonify({"success": True, "message": "User data by email", "data" : user_object_str})


@app.route("/get_post_message", methods=['POST'])
def get_post_message():
    user_token = request.form.get('user_token')
    user_message = request.form.get('user_message')
    user_email = request.form.get('user_email')
    return post_message(user_token, user_message, user_email)

def post_message(user_token, user_message, to_email):
    if find_user(to_email):
        msg_id = str(uuid.uuid4())[:15]
        from_email = logged_in_users.get(str(user_token))
        ts = time.time()
        msg_timestamp = str(datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S'))
        user_token = user_token
        user_message = user_message
        to_email = to_email
        msg_obj = {'msg_id' : msg_id, 'from_email' : from_email, 'to_email' : to_email, 'content' : user_message, 'msg_timestamp' : msg_timestamp}
        add_user_message_db(msg_obj)
        return jsonify({"success": True, "message": "Message retrieved."})
    else:
        return jsonify({"success": False, "message": "No user with that email."})


@app.route("/get_get_user_messages_by_token", methods=['POST'])
def get_get_user_messages_by_token():
    user_token = request.form.get('user_token')
    if not logged_in_users == {}:
        return get_user_messages_by_token(user_token)
    return jsonify({"success": False, "message": "User is not signed in."})

def get_user_messages_by_token(user_token):
    user_email = logged_in_users.get(str(user_token))
    user_messages = get_user_messages_by_email_db(user_email)
    user_messages_obj = {}
    for messages in user_messages:
        message_obj = {}
        msg_id = str(messages["msg_id"])
        message_obj["content"] = messages["content"]
        message_obj["msg_timestamp"] = messages["msg_timestamp"]
        message_obj["from_email"] = messages["from_email"]
        user_messages_obj[msg_id] = message_obj
    return jsonify({"success": True, "message" : "User messages by token: ", "data" : user_messages_obj})


@app.route("/get_get_user_messages_by_email", methods=['POST'])
def get_get_user_messages_by_email():
    user_token = request.form.get('user_token')
    user_email = request.form.get('user_email')
    return get_user_messages_by_email(user_token, user_email)


def get_user_messages_by_email(user_token, user_email):
    if not logged_in_users.get(str(user_token)):
        return jsonify({"success": False, "message": "User is not signed in."})
    else:
        user_messages = get_user_messages_by_email_db(user_email)
        user_messages_obj = {}
        for messages in user_messages:
            message_obj = {}
            msg_id = str(messages["msg_id"])
            message_obj["content"] = messages["content"]
            message_obj["msg_timestamp"] = messages["msg_timestamp"]
            message_obj["from_email"] = messages["from_email"]
            user_messages_obj[msg_id] = message_obj
        return jsonify({"success": True, "message" : "User messages by email: ", "data" : user_messages_obj})

if __name__ == "__main__":
    # app.run(port = 8000, debug=True)
    app.debug = True
    http_server = WSGIServer(('',8003),app, handler_class=WebSocketHandler)
    http_server.serve_forever()
