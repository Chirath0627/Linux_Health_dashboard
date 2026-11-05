from flask import Flask, jsonify

from app.collectors import get_all_system_info

app = Flask(__name__)


@app.route("/")
def home():
    return jsonify({
        "message": "Linux System Health Dashboard API",
        "status": "running"
    })


@app.route("/api/system", methods=["GET"])
def system_info():
    data = get_all_system_info()

    return jsonify(data)


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
