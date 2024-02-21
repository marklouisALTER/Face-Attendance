import mysql.connector

def create_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="face_recognition"
    )
# def create_db_connection():
#     return mysql.connector.connect(
#         host="156.67.222.1",
#         user="u683576082_testing",
#         password="testing_Facerecog#123",
#         database="u683576082_face_recog"
#     )
