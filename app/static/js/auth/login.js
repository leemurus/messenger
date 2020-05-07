$('.validate-form').on('submit', function () {
    let login = $('.login-input').val();
    let password = $('.password-input').val();
    let data = {'login': login, 'password': password};

    var response = postAjaxInformation('/api/login', data);
    if (response.status != 200) {
        let error_text = JSON.parse(JSON.parse(response.responseText).message);
        $('.login-input-div').attr('data-validate', error_text[0][1]);
        $('.password-input-div').attr('data-validate', error_text[1][1]);
        showValidate($('.login-input'));
        showValidate($('.password-input'));
        return false;
    } else {
        return true;
    }
});

$('.validate-form .input100').each(function () {
    $(this).focus(function () {
        hideValidate(this);
    });
});

function showValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
    var thisAlert = $(input).parent();
    $(thisAlert).removeClass('alert-validate');
}