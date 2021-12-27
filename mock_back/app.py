import json

from flask import Flask

from image_container import itemImageB64, userImageB64

app = Flask(__name__)


@app.route("/ny2022/api/gay/<id>", methods=['GET'])
def login(id: str):
    return json.dumps({'name': 'Im GAYYY'})


@app.route("/ny2022/api/items/<id>", methods=['GET'])
def items(id: str):
    return json.dumps([
        {'name': 'Gay item', 'image': itemImageB64},
        {'name': 'Kek', 'image': itemImageB64},
        {'name': 'Some other gay item', 'image': itemImageB64},
        {'name': 'Giga shrek', 'image': itemImageB64},
    ])


@app.route("/ny2022/api/items/<id>/gays", methods=['GET'])
def users(id: str):
    return json.dumps([
        {'name': 'Gay 1', 'image': userImageB64},
        {'name': 'Super Gay', 'image': userImageB64},
        {'name': 'Alexander', 'image': userImageB64}
    ])


@app.route("/ny2022/api/items/<id>/granted", methods=['GET'])
def granted_items(id: str):
    return json.dumps([
        {'name': 'Gay item', 'image': itemImageB64},
        {'name': 'Some other gay item', 'image': itemImageB64},
    ])


@app.route("/ny2022/api/items/<id>/<itemId>/grant/<anotherId>", methods=['POST'])
def grant_item(id: str, itemId: str, anotherId: str):
    return json.dumps({})
