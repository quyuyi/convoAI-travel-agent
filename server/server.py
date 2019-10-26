# !/usr/bin/env python

import os
from flask import Flask, render_template, jsonify, request, send_file

app = Flask(__name__)
app.secret_key='some random string'

@app.route("/")
def index():
    return render_template('index.html')



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)