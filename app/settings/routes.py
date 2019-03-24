from flask import render_template, redirect, url_for
from flask_login import current_user, login_required

from app.models import User
from app.settings import bp
from app.settings.forms import (
    ProfSettingsForm,
    SecSettingsForm,
    AboutSettingsForm
)


@bp.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    form = ProfSettingsForm(
        name=current_user.name,
        surname=current_user.surname,
        nick=current_user.nick,
        age=current_user.age,
        email=current_user.email,
        address=current_user.address
    )

    if form.validate_on_submit():
        current_user.set_profile_form(form)
        return redirect(url_for('settings.profile'))

    users = User.query.all()

    return render_template(
        'settings/profile.html',
        form=form,
        user=current_user,
        users=users
    )


@bp.route('/security', methods=['GET', 'POST'])
@login_required
def security():
    form = SecSettingsForm()
    
    if form.validate_on_submit():
        current_user.set_password(form.new_password.data)
        return redirect(url_for('settings.security'))

    users = User.query.all()

    return render_template(
        'settings/security.html',
        form=form,
        user=current_user,
        users=users
    )


@bp.route('/about', methods=['GET', 'POST'])
@login_required
def about():
    form = AboutSettingsForm(
        about_me=current_user.about_me
    )

    if form.validate_on_submit():
        current_user.set_about_form(form)
        return redirect(url_for('settings.about'))

    users = User.query.all()

    return render_template(
        'settings/about.html',
        form=form,
        user=current_user,
        users=users
    )
