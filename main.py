import json
from flask import Flask, render_template, request, make_response, jsonify
app = Flask(__name__) 

menu = [
    {"id": 1, "title": "Porção de Batata Frita", "price": 15, "details": "Batata frita crocante"},
    {"id": 2, "title": "Porção de Frango a Passarinho", "price": 25, "details": "Frango temperado e frito"},
    {"id": 3, "title": "Porção de Calabresa", "price": 20, "details": "Calabresa acebolada"},
    {"id": 4, "title": "Porção de Queijo Coalho", "price": 18, "details": "Queijo coalho grelhado"},
    {"id": 5, "title": "Porção de Mandioca Frita", "price": 15, "details": "Mandioca frita crocante"},
    {"id": 6, "title": "Porção de Pastel", "price": 22, "details": "Pastéis variados"}
]

# API
@app.get("/menu")
def get_menu():
    return jsonify(menu)

@app.post("/menu")
def add_menu():
    if request.is_json:
        new_item = request.get_json()
        new_item["id"] = len(menu) + 1
        menu.append(new_item)
        return jsonify(new_item), 201
    return {"error":"Request must be JSON"}, 415

# Páginas
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/carrinho")
def shopping_cart():
    cart_items = request.cookies.get('cart', '[]')
    print("Carrinho:", cart_items)
    
    try:
        cart = json.loads(cart_items)
        return render_template("cart.html", cart=cart)
    except json.JSONDecodeError:
        return render_template("cart.html", cart=[])

#@app.route('/setcookie', methods = ['POST', 'GET'])
#def setcookie():
#    if request.method == 'POST':
#        user = request.form['nm']
#        resp = make_response(render_template('cookie.html'))
#        resp.set_cookie('userID', user)
#        return resp
    
#@app.route('/getcookie')
#def getcookie():
#    name = request.cookies.get('userID')
#    return '<h1>welcome ' +name+'</h1>'

if __name__ == '__main__': 
    app.run(debug=True)