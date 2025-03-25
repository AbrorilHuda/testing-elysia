import db from "../db";
type Id = number | string;

class User {
  static GetAll() {
    const query = db.query(
      "SELECT id, name, email, isAdmin, isActive, created_at, updated_at FROM users",
    );
    return query.all();
  }
  static FindById(id: Id) {
    const query = db.query(
      "SELECT id, name, email, isAdmin, isActive, created_at, updated_at FROM users WHERE id = ?",
    );
    return query.get(id);
  }
  static FindByEmail(email: string) {
    const query = db.query("SELECT * FROM users WHERE email = ?");
    return query.get(email);
  }
  static UpdateOrCreate(
    name: string,
    email: string,
    isAdmin: boolean,
    password: string | undefined,
    id?: Id,
  ) {
    if (id) {
      const updatedAt = new Date().toISOString();
      if (password !== undefined) {
        const query = db.query(
          "UPDATE users name= ?, email= ?, isAdmin= ?,updated_at= ? WHERE id = ?",
        );
        return query.run(password as string, updatedAt, id);
      } else {
        const query = db.query(
          "UPDATE users SET name= ?, email= ?, isAdmin= ?, updated_at= ? WHERE id= ?",
        );
        return query.run(name, email, isAdmin, updatedAt, id);
      }
    } else {
      const query = db.query(
        "INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)",
      );
      query.run(name, email, password as string, isAdmin);

      return db.query("SELECT id from users WHERE email = ?").get(email);
    }
  }
  static Delete(id: Id) {
    const query = db.query("UPDATE users SET isActive = FALSE WHERE id = ?");
    return query.run(id);
  }
}

export default User;
