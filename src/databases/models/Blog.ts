import db from "../db";

type Id = number | string;

class Blog {
  static GetAll() {
    const query = db.query(`SELECT blogs.*, users.name AS author FROM blogs
            JOIN users ON blogs.userId = users.id
            WHERE users.isActive = TRUE`);
    return query.all();
  }
  static FindById(id: Id) {
    const query = db.query("SELECT * FROM blogs WHERE id= ?");
    return query.get(id);
  }
  static FindByCategoryId(categoryId: number) {
    const query = db.query(
      `SELECT blogs.*, users.name AS author FROM blogs
            JOIN users ON blogs.userId = users.id
            WHERE categoryId = ? AND users.isActive = TRUE`,
    );

    return query.all(categoryId);
  }
  static FindByUserId(userId: Id) {
    const query = db.query("SELECT * FROM blogs WHERE userId = ?");

    return query.all(userId);
  }
  static UpdateOrCreate(
    categoryId: number,
    title: string,
    imageUrl: string,
    content: string,
    userId?: number,
    id?: number,
  ) {
    if (id) {
      const query = db.query(
        "UPDATE blogs SET categoryId = ?, title = ?, imageUrl = ?, content = ? WHERE id = ?",
      );

      return query.run(categoryId, title, imageUrl, content, id);
    } else {
      const query = db.query(
        "INSERT INTO blogs (categoryId, title, imageUrl, content, userId) VALUES (?, ?, ?, ?, ?)",
      );

      return query.run(categoryId, title, imageUrl, content, userId as number);
    }
  }
  static Delete(id: Id) {
    const query = db.query("DELETE FROM blogs WHERE id = ?");

    return query.run(id);
  }
}

export default Blog;
