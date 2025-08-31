from flask import Flask, request, jsonify
import requests
import os
from datetime import datetime, timedelta, timezone 
from model import db, Todos

def register_routes(app, db):
    @app.route("/todos",methods=['POST'])
    def add_todos():
        N8N_WEBHOOK_URL="https://gokuln8n.up.railway.app/webhook-test/8f12af30-0c0d-44d2-a4ab-b86bbbe72b40"
        data=request.get_json()
        if not data or 'title' not in data:
            return jsonify({"error":"Data without title"}),404
        new_todo=Todos(title=data['title'],description=data.get('description'),time=data.get('time'))
        db.session.add(new_todo)
        db.session.commit()
        if N8N_WEBHOOK_URL:
            try:
                n8n= requests.post(N8N_WEBHOOK_URL,json=new_todo.to_dict())
                n8n.raise_for_status()
            except requests.exceptions.RequestException as e:
                print(f"Error sending todo to n8n: {e}")
        else:
            print("Not properly fitted")
        return jsonify(new_todo.to_dict())

    @app.route("/todos", methods=['GET'])
    def get_all_todos():
        todos = Todos.query.all()
        return jsonify([i.to_dict() for i in todos])

    @app.route('/todos/<int:todo_id>', methods=['GET'])
    def get_todo(todo_id):
        todo = db.session.get(Todos, todo_id)
        if not todo:
            return jsonify({'error': 'Todo not found'}), 404
        return jsonify(todo.to_dict())
    
    @app.route("/todos/<int:todo_id>",methods=['PUT'])
    def update_todo(todo_id):
        todos=db.session.get(Todos,todo_id)
        if not todos:
            return jsonify({'Error':"can't able to get"}),404
        data=request.get_json()
        if 'title' in data:
            todos.title=data['title']
        if 'description' in data:
            todos.description=data['description']
        if 'completed' in data:
            todos.completed=data['completed']
        db.session.commit()
        return jsonify(todos.to_dict()),200
    
    @app.route("/todos/delete/<int:todo_id>",methods=['DELETE'])
    def delete_todo(todo_id):
        todos=db.session.get(Todos,todo_id)
        if not todos:
            return jsonify({'Error':"can't able to get"}),404
        db.session.delete(todos)
        db.session.commit()
        return jsonify({"message":"Todo deleted succesfully"}),200


    @app.route("/todos", methods=['GET'])
    def get_todos():
        filter_date_str = request.args.get('date')

        query = Todos.query 

        if filter_date_str:
            try:
                # Convert 'YYYY-MM-DD' string to a date object
                target_date = datetime.strptime(filter_date_str, '%Y-%m-%d').date()
                print(f"Filtering todos for date: {target_date}")

                # Filter todos where the 'created_at' date matches the target_date
                query = query.filter(db.func.date(Todos.created_at) == target_date)

            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
            except Exception as e:
                return jsonify({"error": f"Error parsing date: {e}"}), 400

        all_todos = query.all() # Execute the query
        return jsonify([todo.to_dict() for todo in all_todos])


    @app.route("/", methods=['GET'])
    def home():
        return "Welcome Home Buddy!"