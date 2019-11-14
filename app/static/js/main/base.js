$(document).ready(function() {  // FOR ALL TEMPLATES
	$('#action_menu_btn').click(function() {
		$('.action_menu').toggle();
	});
    $('.profile-box').hide();
});

$(window).on('load', function() {
	$(".loader").fadeOut();
	$("#preloder").delay(400).fadeOut("slow");
});

function getAjaxInformation(url) {
    let response = null;
    $.ajax({ type: "GET",
             url: url,
             async: false,
             success : function(text) {
                 response = text;
             }
    });
    return response;
}

function postAjaxInformation(url, data) {
    let response = null;
    $.ajax({ type: "POST",
             url: url,
             async: false,
             data: data,
             contentType: 'application/json;charset=UTF-8',
             success : function(text) {
                 response = text;
             },
             error: function(xhr, status, error) {
                 response = xhr.responseText;
             }
    });
    return response
}

function getIP() {
    return "192.168.43.86:5000";
}

function getProfileInformation(username) {
    return getAjaxInformation('http://' + getIP() + '/api/user/information/' + username)
}

function getSelfProfileInformation() {
    return getAjaxInformation('http://' + getIP() + '/api/self/information')
}

function addInformationInProfileBox(username) {
    editVisualProfileBox(getProfileInformation(username));
}

function addSelfInformationInProfileBox() {
    $('.write_message').hide();
    editVisualProfileBox(getSelfProfileInformation());
}

function editVisualProfileBox(dict) {
    $('.profile-box .name_surname p').text(dict['name'] + ' ' + dict['surname']);
    $('.profile-box .photo-preview img').attr('src', dict['photo']);
    $('.profile-box .list .age-base .value').text(dict['age'] ? dict['age'] : 'No information');
    $('.profile-box .list .username-base .value').text(dict['username']);
    $('.profile-box .list .email-base .value').text(dict['email']);
    $('.profile-box .list .address-base .value').text(dict['address'] ? dict['address'] : 'No information');
}

var LastLiClick = false; // Action menu
$('.my_profile').on("click", function() {
    if (LastLiClick) {
        $('.box-for-all').removeClass('col-xl-6').addClass('col-xl-9');
        $('.profile-box').hide();
        LastLiClick = false;
    } else {
        addSelfInformationInProfileBox();
        $('.box-for-all').removeClass('col-xl-9').addClass('col-xl-6');
        $('.profile-box').show();
        LastLiClick = true;
    }
});

function getProfileId(username) {
    return getAjaxInformation('http://' + getIP() + '/api/user/id/' + username);
}

$(".write_message button").click(function () {
    var room_id = getAjaxInformation('http://' + getIP() + '/api/rooms/' + getProfileId(LastTrClick));
    window.location.assign("http://" + getIP() + "/chat/" + room_id);
});


function searchRoom(data) {
    const response = postAjaxInformation('http://' + getIP() + '/api/self/find/room', data);
    return response;
}

function updateListOfRooms(data) {
    $('.room-links').remove();  // delete all links on rooms

    rooms = searchRoom(data);
    for (let i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        if (room['is_dialog']) {
            $('<a class="room-links" href="/chat/' + room['room_id'] + '">' +
                    '<li>' +
                        '<div class="d-flex bd-highlight">' +
                            '<div class="img_cont">' +
                                '<img src="' + room['photo'] + '" class="rounded-circle user_img">' +
                                '<span class="online_icon ' + (room['status'] ? 'online' : 'offline') + '"></span>' +
                            '</div>' +
                            '<div class="user_info">' +
                                '<span class="name">' + room['title'] + '</span>' +
                                '<p class="preview">' + room['last_message'] + '</p>' +
                            '</div>' +
                        '</div>' +
                    '</li>' +
                '</a>'
            ).appendTo($('.contacts'))
        } else {
            // TODO: for conversations
        }
    }
}

$(".search-room").click(function (e) {
    const data = JSON.stringify({
       'request': $('.search-room-input').val()
    });

    updateListOfRooms(data);
});