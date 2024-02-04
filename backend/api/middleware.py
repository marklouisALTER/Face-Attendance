from flask import request, jsonify
import jwt
import os
from db import create_db_connection

SECRET_KEY = 'asfswugihaeuri'

def verify_token():
    token = request.headers.get('Authorization')

    if token is None or not token.startswith('Bearer '):
        return jsonify({"message": "Invalid token"}), 401

    token = token.split('Bearer ')[1]

    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        request.current_user = decoded_token

        # Fetch user details from the database based on the information in the token
        user_id = decoded_token.get('user_id')
        db = create_db_connection()
        cursor = db.cursor()

        query = "SELECT * FROM tbl_login WHERE user_id = %s"
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()

        cursor.close()
        db.close()

        if user:
            user_data = {
                "user_id": user[0],
                "username": user[1],
                # Add other user details as needed
            }
            request.current_user.update(user_data)  # Update current_user with user details
        else:
            return jsonify({"message": "User not found in the database"}), 401

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401
