from flask import Flask, jsonify, render_template

from app.collectors import get_all_system_info

app = Flask(__name__, template_folder="app/templates", static_folder="app/static")


@app.route("/")
def home():
    return render_template("index.html")


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
