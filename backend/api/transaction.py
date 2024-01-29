from flask import Blueprint, request, jsonify
from db import create_db_connection
from datetime import datetime

transac_bp = Blueprint('/transaction', __name__)

@transac_bp.route('/history', methods=['GET'])
def all_transaction():
    try:
        db = create_db_connection() 
        cursor = db.cursor()

        query = "SELECT * FROM tbl_transac"
        cursor.execute(query)
        result = cursor.fetchall()

        data = [
            {
                "id": row[0],
                "transaction_id": row[1],
                "employee_id": row[2],
                "face_image": row[3],
                "eyebrows_perc": row[4],
                "leyes_perc": row[5],
                "reyes_perc": row[6],
                "nose_perc": row[7],
                "mouth_perc": row[8],
                "created_at": datetime.strftime(row[9], "%Y-%m-%d %H:%M:%S"),
                "overall_perc": row[10]
            }
            for row in result
        ]
        
        return jsonify({
            "title": "Success",
            "message": "Fetched data from transaction",
            "data": data
        })
    except Exception as e:
        return jsonify({
            "title": "Error",
            "message": "Error fetching the data: " + str(e)
        }), 500
    finally:
        if 'db' in locals(): 
            cursor.close()
            db.close() # 

@transac_bp.route('/get-user-transaction/<int:employee_id>', methods=['GET'])
def get_user_transaction(employee_id):
    try:
        db = create_db_connection() 
        cursor = db.cursor()

        query = "SELECT * FROM tbl_transac WHERE employee_id = %s"
        cursor.execute(query, (employee_id,)) 
        result = cursor.fetchall()

        data = [
            {
                "id": row[0],
                "transaction_id": row[1],
                "employee_id": row[2],
                "face_image": row[3],
                "eyebrows_perc": row[4],
                "leyes_perc": row[5],
                "reyes_perc": row[6],
                "nose_perc": row[7],
                "mouth_perc": row[8],
                "created_at": datetime.strftime(row[9], "%Y-%m-%d %H:%M:%S"),
                "overall_perc": row[10]
            }
            for row in result
        ]
        
        return jsonify({
            "title": "Success",
            "message": "Fetched data from transaction",
            "data": data
        })
    except Exception as e:
        return jsonify({
            "title": "Error",
            "message": "Error fetching the data: " + str(e)
        }), 500
    finally:
        if 'db' in locals(): 
            cursor.close()
            db.close()

