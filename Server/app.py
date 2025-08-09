from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from model import db
from route import register_routes
from flask_cors import CORS
def create_app():
    app=Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///./testdb.db'
    db.init_app(app)
    migrate=Migrate(app,db)
    CORS(app)
    from model import Todos
    register_routes(app,db)
    return app
    





