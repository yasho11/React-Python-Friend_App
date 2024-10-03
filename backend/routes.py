from app import app, db
from flask import jsonify, request
import requests
from models import Friend

# Get all friends
@app.route("/api/friends", methods=["GET"])
def get_friends():
    friends = Friend.query.all()
    result = [friend.to_json() for friend in friends]
    return jsonify(result)

# Create a friend
@app.route("/api/friends", methods=["POST"])
def create_friend():
    try: 
        # Get JSON data from the request
        data = request.json
        print(f"Data received: {data}")
        
        # Required fields validation
        required_fields = ["name", "role", "gender"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f'Missing required field: {field}'}), 400
        
        # Extract the required fields from the JSON data
        name = data.get("name")
        role = data.get("role")
        description = data.get("description")
        gender = data.get("gender")
        email = data.get("Email")
        ig_un = data.get("IgUn")
        fb_un = data.get("fbUn")
        phone = data.get("phone")
        
        # Fetch avatar image based on gender
        if gender == "male":
            img_url = f"https://avatar.iran.liara.run/public/boy?username={name}"
        elif gender == "female":
            img_url = f"https://avatar.iran.liara.run/public/girl?username={name}"
        else:
            img_url = None
            
        # Create a new Friend object
        new_friend = Friend(
            name=name, 
            role=role, 
            description=description, 
            gender=gender, 
            img_url=img_url,
            Email=email,
            Ig_un=ig_un,
            fb_un=fb_un,
            phone=phone
        )
        
        # Add the new friend to the database session
        db.session.add(new_friend)
        
        # Commit the session to the database
        db.session.commit()

        # Return the newly created friend as a JSON response
        return jsonify({"msg": "Friend created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")  # Print the error for debugging
        return jsonify({"error": str(e)}), 500

# Delete a friend
@app.route("/api/friends/<int:id>", methods=["DELETE"])
def delete_friend(id):
    try:
        # Query to find the friend by id
        friend = Friend.query.get(id)
        
        # If no friend found, return an error
        if not friend:
            return jsonify({"error": "Friend not found"}), 404
        
        # If friend exists, delete it from the database
        db.session.delete(friend)
        db.session.commit()

        # Return a success message
        return jsonify({"msg": f"Friend with id {id} deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")  # Print the error for debugging
        return jsonify({"error": str(e)}), 500

# Update a friend's profile
@app.route("/api/friends/<int:id>", methods=["PATCH"])
def update_friend(id):
    try:
        # Query to find the friend by id
        friend = Friend.query.get(id)

        # If no friend found, return an error
        if not friend:
            return jsonify({"error": "Friend not found"}), 404
        
        # Get JSON data from the request
        data = request.json
        print(f"Data received for update: {data}")

        # Track updates and if any fields were actually changed
        update_message = []
        updated = False

        # Update the friend's profile only if fields are provided in the data
        if "name" in data:
            if friend.name != data["name"]:
                friend.name = data["name"]
                update_message.append("Name updated.")
                updated = True
            else:
                update_message.append("Name is already the same.")
        
        if "role" in data:
            if friend.role != data["role"]:
                friend.role = data["role"]
                update_message.append("Role updated.")
                updated = True
            else:
                update_message.append("Role is already the same.")

        if "description" in data:
            if friend.description != data["description"]:
                friend.description = data["description"]
                update_message.append("Description updated.")
                updated = True
            else:
                update_message.append("Description is already the same.")

        if "gender" in data:
            if friend.gender != data["gender"]:
                friend.gender = data["gender"]
                # Fetch avatar image based on the updated gender
                if friend.gender == "male":
                    friend.img_url = f"https://avatar.iran.liara.run/public/boy?username={friend.name}"
                elif friend.gender == "female":
                    friend.img_url = f"https://avatar.iran.liara.run/public/girl?username={friend.name}"
                else:
                    friend.img_url = None
                update_message.append("Gender updated.")
                updated = True
            else:
                update_message.append("Gender is already the same.")

        if "Email" in data:
            if friend.Email != data["Email"]:
                friend.Email = data["Email"]
                update_message.append("Email updated.")
                updated = True
            else:
                update_message.append("Email is already the same.")

        if "IgUn" in data:
            if friend.Ig_un != data["IgUn"]:
                friend.Ig_un = data["IgUn"]
                update_message.append("Instagram username updated.")
                updated = True
            else:
                update_message.append("Instagram username is already the same.")

        if "fbUn" in data:
            if friend.fb_un != data["fbUn"]:
                friend.fb_un = data["fbUn"]
                update_message.append("Facebook username updated.")
                updated = True
            else:
                update_message.append("Facebook username is already the same.")

        if "phone" in data:
            if friend.phone != data["phone"]:
                friend.phone = data["phone"]
                update_message.append("Phone number updated.")
                updated = True
            else:
                update_message.append("Phone number is already the same.")

        # If no fields were updated, return a message stating so
        if not updated:
            return jsonify({"msg": "No changes made. All values are already the same.", "details": update_message}), 200

        # Commit the updates to the database if there were any changes
        db.session.commit()

        # Return the updated friend as a JSON response with the update message
        return jsonify({
            "msg": "Friend updated successfully",
            "friend": friend.to_json(),
            "details": update_message
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")  # Print the error for debugging
        return jsonify({"error": str(e)}), 500

