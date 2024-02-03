from flask import Flask, request, jsonify, Blueprint
import numpy as np
import dlib
import cv2
import face_recognition
import uuid
import os
from datetime import timedelta, datetime
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

def connect_dots(image, landmarks, dot_indices, color):
    for i in range(len(dot_indices) - 1):
        start_point = (landmarks.part(dot_indices[i]).x, landmarks.part(dot_indices[i]).y)
        end_point = (landmarks.part(dot_indices[i + 1]).x, landmarks.part(dot_indices[i + 1]).y)
        cv2.line(image, start_point, end_point, color, 1)

def recognize_faces(image_path):

    known_faces, known_id, known_names, known_first_names = load_known_faces()

    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    detector = dlib.get_frontal_face_detector()
    faces = detector(gray)

    result = {'match': False}

    for face in faces:
        landmarks = predictor(gray, face)

        x, y, w, h = face.left(), face.top(), face.width(), face.height()
        cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)

        # Draw small dots for facial landmarks
        for i in range(68):
            x, y = landmarks.part(i).x, landmarks.part(i).y
            cv2.circle(image, (x, y), 1, (0, 255, 0), -1)

        # Connect dots with lines
        connect_dots(image, landmarks, [17, 18, 19, 20, 21], (0, 255, 0))  # Connect left eyebrow
        connect_dots(image, landmarks, [22, 23, 24, 25, 26], (0, 255, 0))  # Connect right eyebrow
        connect_dots(image, landmarks, list(range(36, 42)), (0, 0, 255))  # Connect left eye
        connect_dots(image, landmarks, list(range(42, 48)), (0, 0, 255))  # Connect right eye
        connect_dots(image, landmarks, list(range(29, 36)), (255, 0, 0))  # Connect nose
        connect_dots(image, landmarks, list(range(48, 68)), (0, 255, 255)) 

        # Extract the face encoding for recognition
        unknown_encoding = face_recognition.face_encodings(image, [(face.top(), face.right(), face.bottom(), face.left())])[0]

        # Compare with known faces
        results = face_recognition.compare_faces(known_faces, unknown_encoding)

        for i, result in enumerate(results):
            if result:
                matched_name = known_names[i]
                matched_id = known_id[i]
                matched_firstname = known_first_names[i]
                result = {'match': True, 'last_name': matched_name, 'first_name': matched_firstname, 'employee_id': matched_id}

                # Display accuracy for individual facial features
                feature_accuracies = []

                # Nose accuracy
                nose_landmarks = list(range(29, 36))
                nose_distances = face_recognition.face_distance([known_faces[i][nose_landmarks]], unknown_encoding[nose_landmarks])
                feature_accuracies.append((1 - nose_distances[0]) * 100)

                # Left eye accuracy
                left_eye_landmarks = list(range(36, 42))
                left_eye_distances = face_recognition.face_distance([known_faces[i][left_eye_landmarks]], unknown_encoding[left_eye_landmarks])
                feature_accuracies.append((1 - left_eye_distances[0]) * 100)

                # Right eye accuracy
                right_eye_landmarks = list(range(42, 48))
                right_eye_distances = face_recognition.face_distance([known_faces[i][right_eye_landmarks]], unknown_encoding[right_eye_landmarks])
                feature_accuracies.append((1 - right_eye_distances[0]) * 100)

                # Left eyebrow accuracy
                left_eyebrow_landmarks = [17, 18, 19, 20, 21]
                left_eyebrow_distances = face_recognition.face_distance([known_faces[i][left_eyebrow_landmarks]], unknown_encoding[left_eyebrow_landmarks])
                feature_accuracies.append((1 - left_eyebrow_distances[0]) * 100)

                # Right eyebrow accuracy
                right_eyebrow_landmarks = [22, 23, 24, 25, 26]
                right_eyebrow_distances = face_recognition.face_distance([known_faces[i][right_eyebrow_landmarks]], unknown_encoding[right_eyebrow_landmarks])
                feature_accuracies.append((1 - right_eyebrow_distances[0]) * 100)

                # Mouth accuracy
                mouth_landmarks = list(range(48, 68))
                mouth_distances = face_recognition.face_distance([known_faces[i][mouth_landmarks]], unknown_encoding[mouth_landmarks])
                feature_accuracies.append((1 - mouth_distances[0]) * 100)

                # Add accuracy for each feature to the result
                result.update({
                    'feature_accuracies': {
                        'Nose': round( (1 - nose_distances[0]) * 100, 2),
                        'Left Eye': round((1 - left_eye_distances[0]) * 100, 2),
                        'Right Eye': round((1 - right_eye_distances[0]) * 100, 2),
                        'Left Eyebrow': round((1 - left_eyebrow_distances[0]) * 100, 2),
                        'Right Eyebrow': round((1 - right_eyebrow_distances[0]) * 100, 2),
                        'Mouth': round((1 - mouth_distances[0]) * 100, 2),
                    }
                })
                print("Match found:", result) 
                return result
    print("No match found.")
    return result

@face_recognition_bp.route('/detect_faces', methods=['POST'])
def detect_faces_endpoint():
    if 'file' not in request.files:
        return jsonify({'title': 'Error', 'message': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'title': 'Error', 'message': 'No selected file'})

    temp_image_path = './temp/temp_image.jpg'
    file.save(temp_image_path)

    result = recognize_faces(temp_image_path)

    recog_id = str(uuid.uuid4())
    current_date = datetime.today()
    formatted_date = current_date.strftime("%Y%m%d")
    
    image_file_name = 'EMP_TRANS_{}_{}.jpg'.format(formatted_date, recog_id)
    image_file_path = os.path.join('./temp', image_file_name)
    
    result['transaction_id'] = 'EMP_TRANS_{}_{}'.format(formatted_date, recog_id)


    #mag sasave yung image
    image = cv2.imread(temp_image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    detector = dlib.get_frontal_face_detector()
    faces = detector(gray)

    for face in faces:
        landmarks = predictor(gray, face)

        # Mag dradrawing ng box around face 
        x, y, w, h = face.left(), face.top(), face.width(), face.height()
        cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)

        for i in range(68):
            x, y = landmarks.part(i).x, landmarks.part(i).y
            cv2.circle(image, (x, y), 1, (0, 255, 0), -1)

        connect_dots(image, landmarks, [17, 18, 19, 20, 21], (0, 255, 0))  
        connect_dots(image, landmarks, [22, 23, 24, 25, 26], (0, 255, 0)) 
        connect_dots(image, landmarks, list(range(36, 42)), (0, 0, 255)) 
        connect_dots(image, landmarks, list(range(42, 48)), (0, 0, 255)) 
        connect_dots(image, landmarks, list(range(29, 36)), (255, 0, 0)) 
        connect_dots(image, landmarks, list(range(48, 68)), (0, 255, 255))  

    cv2.imwrite(image_file_path, image)

    image_with_landmarks = image.copy()
    for face in faces:
        landmarks = predictor(gray, face)
        connect_dots(image_with_landmarks, landmarks, [17, 18, 19, 20, 21], (0, 255, 0)) 
        connect_dots(image_with_landmarks, landmarks, [22, 23, 24, 25, 26], (0, 255, 0))  
        connect_dots(image_with_landmarks, landmarks, list(range(36, 42)), (0, 0, 255))  
        connect_dots(image_with_landmarks, landmarks, list(range(42, 48)), (0, 0, 255)) 
        connect_dots(image_with_landmarks, landmarks, list(range(29, 36)), (255, 0, 0))  
        connect_dots(image_with_landmarks, landmarks, list(range(48, 68)), (0, 255, 255))  

    cv2.imwrite('./temp/detected_features.jpg', image_with_landmarks)

    overall_accuracy = sum(result['feature_accuracies'].values()) / len(result['feature_accuracies'])
    result['overall_accuracy'] = round(overall_accuracy, 2)

    result['image_path'] = f'/temp/{image_file_name}'

    cursor = db.cursor()
    query = """
    INSERT INTO tbl_transac (
        transaction_id, employee_id, face_image, eyebrows_perc, reyes_perc, leyes_perc, 
        nose_perc, mouth_perc, created_At, overall_perc
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    # Use the values from the 'result' dictionary
    values = (
        result.get('transaction_id'),
        result.get('employee_id'),
        result.get('image_path'),
        result['feature_accuracies']['Left Eyebrow'],
        result['feature_accuracies']['Left Eye'],
        result['feature_accuracies']['Right Eye'],
        result['feature_accuracies']['Nose'],
        result['feature_accuracies']['Mouth'],
        datetime.now(),
        result.get('overall_accuracy'),
    )

    cursor.execute(query, values)

    db.commit()
    cursor.close()

    return jsonify(result)
