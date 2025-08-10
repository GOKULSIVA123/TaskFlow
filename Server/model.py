from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta, timezone

db = SQLAlchemy()

class Todos(db.Model):
    __tablename__ = 'TodoList2'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    time=db.Column(db.String(255),nullable=True)
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "completed": self.completed,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "time":self.time
        }
    


