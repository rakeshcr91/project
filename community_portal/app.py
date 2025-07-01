from flask import Flask, render_template, redirect, url_for, request, session, flash
from models import db, User, Post, Vote
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'change_this_secret'

db.init_app(app)

@app.before_first_request
def create_tables():
    db.create_all()

@app.context_processor
def inject_user():
    user = None
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
    return dict(current_user=user)

@app.route('/')
def index():
    posts = (
        db.session.query(
            Post,
            db.func.coalesce(db.func.sum(Vote.value), 0).label('score')
        )
        .outerjoin(Vote, Vote.post_id == Post.id)
        .group_by(Post.id)
        .order_by(db.desc('score'))
        .all()
    )
    return render_template('feed.html', posts=posts)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if User.query.filter_by(username=username).first():
            flash('Username exists')
            return redirect(url_for('register'))
        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        flash('Registration successful')
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            session['user_id'] = user.id
            return redirect(url_for('index'))
        flash('Invalid credentials')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/post', methods=['POST'])
def post_message():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    content = request.form['content']
    if content:
        post = Post(content=content, author_id=session['user_id'])
        db.session.add(post)
        db.session.commit()
    return redirect(url_for('index'))

@app.route('/vote/<int:post_id>/<action>')
def vote(post_id, action):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    value = 1 if action == 'up' else -1
    vote = Vote.query.filter_by(user_id=session['user_id'], post_id=post_id).first()
    if vote:
        if vote.value == value:
            db.session.delete(vote)
        else:
            vote.value = value
    else:
        vote = Vote(value=value, user_id=session['user_id'], post_id=post_id)
        db.session.add(vote)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/api/vote/<int:post_id>/<action>', methods=['POST'])
def api_vote(post_id, action):
    if 'user_id' not in session:
        return ('', 401)
    value = 1 if action == 'up' else -1
    vote = Vote.query.filter_by(user_id=session['user_id'], post_id=post_id).first()
    if vote:
        if vote.value == value:
            db.session.delete(vote)
        else:
            vote.value = value
    else:
        vote = Vote(value=value, user_id=session['user_id'], post_id=post_id)
        db.session.add(vote)
    db.session.commit()
    score = db.session.query(db.func.coalesce(db.func.sum(Vote.value), 0)).filter_by(post_id=post_id).scalar()
    return {'score': score}

@app.route('/delete/<int:post_id>')
def delete_post(post_id):
    user = User.query.get(session.get('user_id'))
    if not user or user.username != 'admin':
        return redirect(url_for('login'))
    Post.query.filter_by(id=post_id).delete()
    Vote.query.filter_by(post_id=post_id).delete()
    db.session.commit()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
