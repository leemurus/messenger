import re

from flask import jsonify, request
from flask_login import login_required, current_user

from app.api.errors import bad_request
from app.api import bp
from app.models import User


@bp.route('/self/find/room', methods=['POST'])
@login_required
def find_room():
    data = request.get_json() or {}

    if 'request' not in data:
        return bad_request('Must include request field!')
    try:
        rooms_list = []
        for room in current_user.rooms:
            if re.search(data['request'].lower(), room.get_title(current_user).lower()):
                if room.is_dialog:
                    recipient = room.get_recipient(current_user)
                    rooms_list.append({
                        'is_dialog': True,
                        'status': recipient.status,
                        'title': recipient.name + ' ' + recipient.surname,
                        'photo': recipient.photo,
                        'last_message': room.get_last_message(),
                        'room_id': room.id
                    })
                else:
                    rooms_list.append({
                        'is_dialog': False,
                        'title': room.get_title(current_user),
                        'photo': room.photo,
                        'last_message': room.get_last_message(),
                        'room_id': room.id
                    })
        return jsonify(rooms_list)
    except Exception as exception:
        return bad_request(str(exception))


@bp.route('/self/find/user', methods=['POST'])
@login_required
def find_user():
    data = request.get_json() or {}

    if 'request' not in data:
        return bad_request('Must include request field!')
    try:
        user_list = []
        for user in User.query.all():
            search_line = (user.name + ' ' + user.surname + ' ' + user.username).lower()
            if re.search(data['request'].lower(), search_line) and user != current_user:
                user_list.append({
                    'name': user.name,
                    'surname': user.surname,
                    'username': user.username,
                    'photo': user.photo,
                    'age': user.age,
                    'status': user.status,
                    'email': user.email
                })
        return jsonify(user_list)
    except Exception as exception:
        return bad_request(str(exception))
