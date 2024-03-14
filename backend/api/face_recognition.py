from flask import Flask, request, jsonify, Blueprint
import numpy as np
import dlib
import cv2
import face_recognition
import uuid
import os
from datetime import datetime
from db import create_db_connection

face_recognition_bp = Blueprint('/face_recognition', __name__)

predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

db = create_db_connection()

def load_known_faces():
    cursor = db.cursor()
    cursor.execute("SELECT employee_id, last_name, first_name, face_image FROM tbl_empdata")

    known_faces = []
    known_id = []
    known_names = []
    known_first_names = []

    read_count = 0

    for employee_id, last_name, first_name, face_blob in cursor:
        read_count += 1

        face_image = np.frombuffer(face_blob, dtype=np.uint8)

        # Decode the image
        face_image = cv2.imdecode(face_image, cv2.IMREAD_COLOR)

        # Use the pre-trained face detector from dlib
        detector = dlib.get_frontal_face_detector()
        faces = detector(cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY))

        if faces:
            # Use the first detected face for encoding
            landmarks = predictor(cv2.cvtColor(face_image, cv2.COLOR_BGR2GRAY), faces[0])
            encoding = face_recognition.face_encodings(face_image, [(
                faces[0].top(),
                faces[0].right(),
                faces[0].bottom(),
                faces[0].left()
            )])[0]
            known_faces.append(encoding)
            known_names.append(last_name)
            known_id.append(employee_id)
            known_first_names.append(first_name)

    cursor.close()

    print(f"Total records iterated in the database: {read_count}")

    return known_faces, known_id, known_names, known_first_names

known_faces, known_id, known_names, known_first_names = load_known_faces()

def find_matching_face(encoding_to_check):
    # Compare the given face encoding with known faces in the database
    matches = face_recognition.compare_faces(known_faces, encoding_to_check)

    for i, match in enumerate(matches):
        if match:
            return known_id[i], known_first_names[i], known_names[i]

    return None, None, None

def connect_dots(image, landmarks, dot_indices, color):
    for i in range(len(dot_indices) - 1):
        start_point = (landmarks.part(dot_indices[i]).x, landmarks.part(dot_indices[i]).y)
        end_point = (landmarks.part(dot_indices[i + 1]).x, landmarks.part(dot_indices[i + 1]).y)
        cv2.line(image, start_point, end_point, color, 1)

@face_recognition_bp.route('/detect_faces', methods=['POST'])
def detect_faces_endpoint():
    if 'file' not in request.files:
        return jsonify({'title': 'Error', 'message': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'title': 'Error', 'message': 'No selected file'})

    temp_image_path = './temp/temp_image.jpg'
    file.save(temp_image_path)

    recog_id = str(uuid.uuid4())
    current_date = datetime.today()
    formatted_date = current_date.strftime("%Y%m%d")

    image_file_name = 'EMP_TRANS_{}_{}.jpg'.format(formatted_date, recog_id)
    image_file_path = os.path.join('./temp', image_file_name)

    # Mag sasave yung image
    image = cv2.imread(temp_image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    detector = dlib.get_frontal_face_detector()
    faces = detector(gray)

    detected_face_path = './temp/detected_features.jpg'

    for face in faces:
        landmarks = predictor(gray, face)

        # Mag dradrawing ng box around face
        x, y, w, h = face.left(), face.top(), face.width(), face.height()
        cv2.rectangle(image, (x, y), (x + w, y + h), (255, 0, 0), 2)

        for i in range(68):
            x, y = landmarks.part(i).x, landmarks.part(i).y
            cv2.circle(image, (x, y), 1, (0, 255, 0), -1)

        # Display the detected face
        # cv2.imshow('Detected Face', image)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()

        encoding_to_check = face_recognition.face_encodings(image, [(  # Extract the encoding of the detected face
            face.top(),
            face.right(),
            face.bottom(),
            face.left()
        )])[0]

        # print("Encoding to check:", encoding_to_check)

        employee_id, first_name, last_name = find_matching_face(encoding_to_check)  # Find a matching face in the database

        if employee_id is not None:  # Debug print: print the known faces and their encodings
            print("Known IDs:", known_id)
            print("Known Encodings:", known_faces)

            feature_accuracies = calculate_feature_accuracies(landmarks, encoding_to_check)

            overall_percentage = round(sum(feature_accuracies.values()) / len(feature_accuracies), 2)

            cv2.imwrite(image_file_path, image)
            
            cursor = db.cursor()
            query = """
            INSERT INTO tbl_transac (
                transaction_id, employee_id, face_image, eyebrows_perc, reyes_perc, leyes_perc, 
                nose_perc, mouth_perc, created_at, overall_perc
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """

            # Generate a transaction_id (you may need to implement this)
            transaction_id = str(uuid.uuid4())

            # Use the values from the 'result' dictionary
            values = (
                transaction_id,
                employee_id,
                image_file_path,
                feature_accuracies['Left Eyebrow'],
                feature_accuracies['Left Eye'],
                feature_accuracies['Right Eye'],
                feature_accuracies['Nose'],
                feature_accuracies['Mouth'],
                datetime.now(),
                overall_percentage,
            )

            cursor.execute(query, values)
            db.commit()
            cursor.close()

            return jsonify({'title': 'Success', 'message': 'Employee found', 'employee_id': employee_id,
                            'first_name': first_name, 'last_name': last_name,
                            'feature_accuracies': feature_accuracies,
                            'overall_percentage': overall_percentage,
                            'image_path': image_file_path}) 
        else:
            return jsonify({'title': 'Error', 'message': 'No matching employee found'}), 404

    return jsonify({'title': 'Error', 'message': 'No face detected'}), 404


def calculate_feature_accuracies(landmarks, encoding_to_check):
    feature_accuracies = {}

    nose_landmarks = list(range(29, 36))
    nose_distances = face_recognition.face_distance([known_faces[0][nose_landmarks]], encoding_to_check[nose_landmarks])
    feature_accuracies['Nose'] = round((1 - nose_distances[0]) * 100, 2)

    left_eye_landmarks = list(range(36, 42))
    left_eye_distances = face_recognition.face_distance([known_faces[0][left_eye_landmarks]], encoding_to_check[left_eye_landmarks])
    feature_accuracies['Left Eye'] = round((1 - left_eye_distances[0]) * 100, 2)

    right_eye_landmarks = list(range(42, 48))
    right_eye_distances = face_recognition.face_distance([known_faces[0][right_eye_landmarks]], encoding_to_check[right_eye_landmarks])
    feature_accuracies['Right Eye'] = round((1 - right_eye_distances[0]) * 100, 2)

    left_eyebrow_landmarks = [17, 18, 19, 20, 21]
    left_eyebrow_distances = face_recognition.face_distance([known_faces[0][left_eyebrow_landmarks]], encoding_to_check[left_eyebrow_landmarks])
    feature_accuracies['Left Eyebrow'] = round((1 - left_eyebrow_distances[0]) * 100, 2)

    right_eyebrow_landmarks = [22, 23, 24, 25, 26]
    right_eyebrow_distances = face_recognition.face_distance([known_faces[0][right_eyebrow_landmarks]], encoding_to_check[right_eyebrow_landmarks])
    feature_accuracies['Right Eyebrow'] = round((1 - right_eyebrow_distances[0]) * 100, 2)

    mouth_landmarks = list(range(48, 68))
    mouth_distances = face_recognition.face_distance([known_faces[0][mouth_landmarks]], encoding_to_check[mouth_landmarks])
    feature_accuracies['Mouth'] = round((1 - mouth_distances[0]) * 100, 2)

    return feature_accuracies