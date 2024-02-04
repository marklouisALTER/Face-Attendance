from flask import jsonify, request, Blueprint
from db import create_db_connection
import base64

teacher_bp = Blueprint('teachers', __name__)

db = create_db_connection()

# API for all information about teachers
@teacher_bp.route('/profile', methods=['GET'])
def all_profile_teacher():
    cursor = db.cursor()
    try:
        query = """
            SELECT 
                e.employee_id, 
                e.first_name,
                e.last_name,
                e.face_image,
                eye.eyebrows,
                l.leyes,
                r.reyes,
                n.nose,
                m.mouth
            FROM tbl_empdata AS e
            LEFT JOIN tbl_eyebrows AS eye
            USING(employee_id)
            LEFT JOIN tbl_leyes AS l
            USING(employee_id)
            LEFT JOIN tbl_reyes AS r
            USING(employee_id)
            LEFT JOIN tbl_nose AS n
            USING(employee_id)
            LEFT JOIN tbl_mouth AS m
            USING(employee_id)
            GROUP BY e.employee_id
        """
        cursor.execute(query)
        result = cursor.fetchall()

        result_data = []
        for row in result:
            employee_id, first_name, last_name, face_image_blob, eyebrows, leyes, reyes, nose, mouth = row
            face_image_base64 = base64.b64encode(face_image_blob).decode('utf-8')
            eyebrows_image_base64 = base64.b64encode(eyebrows).decode('utf-8')
            leyes_image_base64 = base64.b64encode(leyes).decode('utf-8')
            reyes_image_base64 = base64.b64encode(reyes).decode('utf-8')
            nose_image_base64 = base64.b64encode(nose).decode('utf-8')
            mouth_image_base64 = base64.b64encode(mouth).decode('utf-8')
            result_data.append({
                "employee_id": employee_id,
                "first_name": first_name,
                "last_name": last_name,
                "face_image": face_image_base64,
                "eyebrows": eyebrows_image_base64,
                "leyes": leyes_image_base64,
                "reyes": reyes_image_base64,
                "nose": nose_image_base64,
                "mouth": mouth_image_base64
            })

        return jsonify({"data": result_data})
    except Exception as e:
        return jsonify({"title": "Error", "message": "Error Fetching data: " + str(e)}), 500
    finally:
        cursor.close()

# API for getting the firstname and employee_id of the employee
@teacher_bp.route('/first-name', methods=['GET'])
def all_teacher():
    cursor = db.cursor()
    try:
        query = "SELECT first_name, employee_id FROM tbl_empdata"
        cursor.execute(query)
        result = cursor.fetchall()

        data = [{"first_name": row[0], "employee_id": row[1]} for row in result]
        
        return jsonify({"data": data})
    except Exception as e:
        return jsonify({"title": "Error", "message": "Error Fetching data: " + str(e)}), 500
    finally:
        cursor.close()
from flask import jsonify


@teacher_bp.route('/delete-teacher', methods=['DELETE'])
def delete_teacher():
    try:
        employee_id = int(request.args.get('employee_id'))
        cursor = db.cursor()
        delete_query = "DELETE FROM tbl_empdata WHERE employee_id = %s"
        cursor.execute(delete_query, (employee_id,))

        db.commit()
        cursor.close()
        return jsonify({"title": "Success", "message": f"Employee with ID {employee_id} deleted successfully"}), 200
    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"title": "Error", "message": "Error deleting data: " + str(e)}), 500

# API for update teacher profile
@teacher_bp.route('/update-teacher-profile', methods=['PUT'])
def update_employee():
    try:
        employee_id = int(request.args.get('employee_id'))
        firstname = request.form.get('first_name')
        lastname = request.form.get('last_name')
        imageupload = request.files.get('file')

        cursor = db.cursor()

        cursor.execute("SELECT COUNT(*) FROM tbl_empdata WHERE employee_id = %s", (employee_id,))
        if cursor.fetchone()[0] == 0:
            return jsonify({"message": "Employee not found"}), 404

        update_query = "UPDATE tbl_empdata SET first_name = %s, last_name = %s, face_image = %s WHERE employee_id = %s"
        image_data = imageupload.read()

        cursor.execute(update_query, (firstname, lastname, image_data, employee_id))
        db.commit()

        cursor.close()

        return jsonify({"title": "Success", "message": "Employee data and image updated successfully"}), 200
    except Exception as e:
        db.rollback()
        cursor.close()
        return jsonify({"title": "Error", "message": "Error updating data: " + str(e)}), 500

# API FOR Add new employee
@teacher_bp.route('/new-teacher', methods=['POST'])
def new_teacher():
    firstname = request.form.get('first_name')
    lastname = request.form.get('last_name')
    imageupload = request.files.get('face_image')

    cursor = db.cursor()

    try:
        insert_query = "INSERT INTO tbl_empdata (first_name, last_name, face_image) VALUES (%s, %s, %s)"
        image_data = imageupload.read()

        cursor.execute(insert_query, (firstname, lastname, image_data))
        
        db.commit()

        cursor.close()
        
        return jsonify({"title": "Success", 
                        "message": """Successfully Registered the new employee. 
                        If you want to add more face part of the employee you may do so. If not disregard the other steps.""",
                        }), 200

    except Exception as e:
        db.rollback()
        cursor.close()
        return jsonify({"title": "Error", "message": "Error inserting data" + str(e)}), 500

# API FOR Add face part of the employee
@teacher_bp.route('/add-face-part', methods=['POST'])
def add_face_part():
    employee_id = request.form.get('employee_id')
    eyebrows =  request.files.get('eyebrows')
    leyes = request.files.get('leyes')
    reyes = request.files.get('reyes')
    nose = request.files.get('nose')
    mouth = request.files.get('mouth')

    cursor = db.cursor()

    try:
        if eyebrows:
            insert_eyebrows_query = "INSERT INTO tbl_eyebrows (employee_id, eyebrows) VALUES (%s, %s)"
            eyebrows_data = eyebrows.read()
            cursor.execute(insert_eyebrows_query, (employee_id, eyebrows_data))
        
        if leyes:
            insert_leyes_query = "INSERT INTO tbl_leyes (employee_id, leyes) VALUES (%s, %s)"
            leyes_data = leyes.read()
            cursor.execute(insert_leyes_query, (employee_id, leyes_data))
        
        if reyes:
            insert_reyes_query = "INSERT INTO tbl_reyes (employee_id, reyes) VALUES (%s, %s)"
            reyes_data = reyes.read()
            cursor.execute(insert_reyes_query, (employee_id, reyes_data))

        if nose:
            insert_nose_query = "INSERT INTO tbl_nose (employee_id, nose) VALUES (%s, %s)"
            nose_data = nose.read()
            cursor.execute(insert_nose_query, (employee_id, nose_data))

        if mouth:
            insert_mouth_query = "INSERT INTO tbl_mouth (employee_id, mouth) VALUES (%s, %s)"
            mouth_data = mouth.read()
            cursor.execute(insert_mouth_query, (employee_id, mouth_data))
        
        db.commit()

        cursor.close()

        return jsonify({"title": "Success", 
                        "message": "Successfully Registered the new teacher face parts.",
                        }), 200

    except Exception as e:
        db.rollback()
        cursor.close()
        return jsonify({"title": "Error", "message": "Error inserting data" + str(e)}), 500

@teacher_bp.route('/get-user-profile/<int:employee_id>', methods=['GET'])
def get_user_transaction(employee_id):
    try:
        db = create_db_connection() 
        cursor = db.cursor()

        query = """SELECT 
                e.employee_id, 
                e.first_name,
                e.last_name,
                e.face_image,
                eye.eyebrows,
                l.leyes,
                r.reyes,
                n.nose,
                m.mouth
            FROM tbl_empdata AS e
            LEFT JOIN tbl_eyebrows AS eye
            USING(employee_id)
            LEFT JOIN tbl_leyes AS l
            USING(employee_id)
            LEFT JOIN tbl_reyes AS r
            USING(employee_id)
            LEFT JOIN tbl_nose AS n
            USING(employee_id)
            LEFT JOIN tbl_mouth AS m
            USING(employee_id)
            WHERE employee_id = %s
            GROUP BY e.employee_id
            LIMIT 1
            """
        cursor.execute(query, (employee_id,)) 
        result = cursor.fetchall()

        data = [
            {
                "employee_id": row[0],
                "first_name": row[1],
                "last_name": row[2],
                "face_image": base64.b64encode(row[3]).decode('utf-8'),
                "eyebrows": base64.b64encode(row[4]).decode('utf-8'),
                "leyes": base64.b64encode(row[5]).decode('utf-8'),
                "reyes": base64.b64encode(row[6]).decode('utf-8'),
                "nose": base64.b64encode(row[7]).decode('utf-8'),
                "mouth": base64.b64encode(row[8]).decode('utf-8')
            }
            for row in result
        ]
        
        return jsonify({
            "title": "Success",
            "message": "Fetched user profile successfully",
            "data": data[0]
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


@teacher_bp.route('/teacher-percentage/<int:employee_id>', methods=['GET'])
def teacher_percentage(employee_id):
    cursor = db.cursor()
    try:
        query = """
        SELECT 
            e.employee_id, 
            ROUND(AVG(t.overall_perc), 2) AS avg_face_accuracy, 
            COUNT(*) AS total_user_transaction 
        FROM tbl_empdata AS e 
        INNER JOIN tbl_transac AS t
        USING(employee_id)
        WHERE employee_id = %s
        GROUP BY e.employee_id;
        """

        cursor.execute(query, (employee_id,))
        result = cursor.fetchone()

        if result:
            response = {
                "employee_id": result[0],
                "avg_face_accuracy": result[1],
                "total_user_transaction": result[2]
            }
            return jsonify(response), 200
        else:
            return jsonify({"title": "Error", "message": "No data found for the specified employee_id"}), 404
    
    except Exception as e:
        return jsonify({"title": "Error", "message": "Error Fetching data: " + str(e)}), 500
    finally:
        cursor.close()

