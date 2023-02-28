from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route("/")
def index():
  return render_template("index.html", js_file='scratch.js')

# i borrowed this simple Flask app from cs50 website on running your own flask server
# because http-server won't forward the request to the index.html file