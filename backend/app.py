from flask import Flask, request
from api.login import login_bp
from api.transaction import transac_bp
from api.teacher import teacher_bp
from api.attendance import attendance_bp
# from api.face_recognition import face_recognition_bp
from api.middleware import verify_token 
from flask_cors import CORS, cross_origin
import logging


app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.before_request
def before_request():
    if not request.path.startswith('/api'):
        verify_token()

app.register_blueprint(login_bp, url_prefix='/api')
app.register_blueprint(transac_bp, url_prefix='/transaction')
app.register_blueprint(teacher_bp, url_prefix='/teachers')
app.register_blueprint(attendance_bp, url_prefix='/attendance')
# app.register_blueprint(face_recognition_bp, url_prefix='/face_recognition')
logging.basicConfig(level=logging.INFO)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
    # app.run(debug=False)