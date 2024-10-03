from app import db

class Friend(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100), nullable = False)
    role = db.Column(db.String(50), nullable = False)
    description = db.Column(db.Text, nullable = True)
    gender = db.Column(db.String(10), nullable = False)
    img_url = db.Column(db.String(200), nullable = False)
    Email = db.Column(db.String(200), nullable = True)
    Ig_un = db.Column(db.String(50), nullable = True)
    fb_un = db.Column(db.String(50), nullable = True)
    phone = db.Column(db.String(50), nullable = True)
    
    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "description": self.description,
            "gender": self.gender,
            "imgUrl": self.img_url,
            "Email": self.Email,
            "igUn": self.Ig_un,
            "fbUn": self.fb_un,
            "phone": self.phone
        }

    