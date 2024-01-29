from flask import Blueprint, jsonify, request
import jwt
from datetime import datetime, timedelta
from db import create_db_connection
login_bp = Blueprint('/api', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    db = create_db_connection()
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    remember = data.get('remember')
    cursor = db.cursor()

    query = "SELECT * FROM tbl_login WHERE username = %s AND password = %s"
    cursor.execute(query, (username, password))
    user = cursor.fetchone()

    cursor.close()

    if user:
        user_data = {
            "user_id": user[0],  
            "username": user[1],  
        }

        token_payload = {
            "user_id": user_data["user_id"],
            "username": user_data["username"],
            "access_type": "Bearer"
        }
        if remember:
            token_payload["exp"] = datetime.utcnow() + timedelta(hours=24)
        else:
            token_payload["exp"] = datetime.utcnow() + timedelta(hours=1)

        secret_key = "face_recognition"

        token = jwt.encode(token_payload, secret_key, algorithm="HS256")

        token = 'Bearer ' + token

        return jsonify({"message": "Login successful", "title": "success", "username": user_data['username'], "token": token})
    else:
        return jsonify({"message": "Invalid credentials", "title": "Error"}), 401
