from flask import Flask
from api.login import login_bp
from api.transaction import transac_bp
from api.teacher import teacher_bp
from api.attendance import attendance_bp
from api.face_recognition import face_recognition_bp
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.register_blueprint(login_bp, url_prefix='/api')
app.register_blueprint(transac_bp, url_prefix='/transaction')
app.register_blueprint(teacher_bp, url_prefix='/teachers')
app.register_blueprint(attendance_bp, url_prefix='/attendance')
app.register_blueprint(face_recognition_bp, url_prefix='/face_recognition')
if __name__ == "__main__":
    app.run(debug=True)
