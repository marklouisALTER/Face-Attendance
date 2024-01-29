from flask import jsonify, request, Blueprint
from db import create_db_connection
from datetime import datetime, timedelta
from pytz import timezone

attendance_bp = Blueprint('/attendance', __name__)

db = create_db_connection() 

@attendance_bp.route('/record', methods=['GET'])
def all_attendance_record():
    try:
        cursor = db.cursor()
        query = "SELECT * FROM tbl_attendrec"
        cursor.execute(query)

        result = cursor.fetchall()

        data = []
        for row in result:
            attendance_id, employee_id, full_name, date, time_in, time_out = row
            # Convert timedelta to seconds and then to string
            time_in_str = str(time_in) if time_in else None
            time_out_str = str(time_out) if time_out else None

            data.append({
                "attendance_id": attendance_id,
                "employee_id": employee_id,
                "full_name": full_name,
                "date": date.strftime('%Y-%m-%d'),
                "time_in": time_in_str,
                "time_out": time_out_str
            })

        return jsonify({"data": data})
    except Exception as e:
        return jsonify({"title": "Error", "message": "Error Fetching data: " + str(e)}), 500
    finally:
        cursor.close()

        
@attendance_bp.route('/delete-attendance', methods=['DELETE'])
def delete_attendance():
    try:
        attendance_id = int(request.args.get('attendance_id'))
        cursor = db.cursor()
        delete_query = "DELETE FROM tbl_attendrec WHERE attendance_id = %s"
        cursor.execute(delete_query, (attendance_id,))

        db.commit()
        cursor.close()
        return jsonify({"title": "Success", "message": f"Employee with ID {attendance_id} deleted successfully"}), 200
    except Exception as e:
        db.rollback()
        db.close()
        return jsonify({"title": "Error", "message": "Error deleting data: " + str(e)}), 500


@attendance_bp.route('/update-attendance-record/<int:attendance_id>', methods=['PUT'])
def updateattendance(attendance_id):
    full_name = request.form.get('full_name')
    date = request.form.get('date')
    time_in = request.form.get('time_in')
    time_out = request.form.get('time_out')

    cursor = db.cursor()

    try:
        cursor.execute("SELECT COUNT(*) FROM tbl_attendrec WHERE attendance_id = %s", (attendance_id,))
        if cursor.fetchone()[0] == 0:
            return jsonify({"title": "Error", "message": "Employee not found"}), 404

        update_query = "UPDATE tbl_attendrec SET full_name = %s, date = %s, time_in = %s, time_out = %s WHERE attendance_id = %s"

        cursor.execute(update_query, (full_name, date, time_in, time_out, attendance_id))
        db.commit()

        cursor.close()

        return jsonify({"title": "Success", "message": "Attendance record updated successfully"}), 200
    except Exception as e:
        db.rollback()
        cursor.close()
        return jsonify({"title": "Error", "message": "Error updating data: " + str(e)}), 500
    
@attendance_bp.route('/record-attendance', methods=['POST'])
def attendanceData():
    try:
        employeeId = request.form.get('employeeId')
        firstname = request.form.get('full_name')
        
        asia_manila = timezone('Asia/Manila')
        now = datetime.now(asia_manila)
        date_today = now.strftime("%Y-%m-%d")
        time_now = now.strftime("%H:%M:%S")

        cursor = db.cursor()

        check_query = "SELECT * FROM tbl_attendrec WHERE employee_id = %s AND date = %s"
        cursor.execute(check_query, (employeeId, str(date_today)))
        existing_record = cursor.fetchone()

        if existing_record:
            update_query = "UPDATE tbl_attendrec SET time_out = %s WHERE employee_id = %s AND date = %s"
            cursor.execute(update_query, (time_now, int(employeeId), str(date_today)))
            db.commit()
        else:
            insert_query = "INSERT INTO tbl_attendrec (employee_id, full_name, date, time_in, time_out) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(insert_query, (employeeId, firstname, date_today, time_now, None))
            db.commit()
        with cursor:
            pass

        return jsonify({"message": "Employee attendance recorded successfully", "title": "Success"})
    except Exception as e:
        db.rollback()
        return jsonify({"title": "Error", "message": "Error recording attendance: " + str(e)}), 500


@attendance_bp.route('/get-user-attendance/<int:employee_id>', methods=['GET'])
def user_attendance(employee_id):
    try:
        cursor = db.cursor()
        query = "SELECT * FROM tbl_attendrec WHERE employee_id = %s"
        cursor.execute(query, (employee_id,)) 
        result = cursor.fetchall()

        data = []
        for row in result:
            attendance_id, employee_id, full_name, date, time_in, time_out = row
            # Convert timedelta to seconds and then to string
            time_in_str = str(time_in) if time_in else None
            time_out_str = str(time_out) if time_out else None

            data.append({
                "attendance_id": attendance_id,
                "employee_id": employee_id,
                "full_name": full_name,
                "date": date.strftime('%Y-%m-%d'),
                "time_in": time_in_str,
                "time_out": time_out_str
            })

        return jsonify({"data": data})
    except Exception as e:
        return jsonify({"title": "Error", "message": "Error Fetching data: " + str(e)}), 500
    finally:
        cursor.close()