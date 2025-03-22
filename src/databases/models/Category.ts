import db from "../db"

type Id = number | string

class Category {
    static GetAll(){
        const query = db.query("SELECT * FROM categories")
        return query.all()
    }
    static FindById(id: Id){
        const query = db.query("SELECT * FROM categories WHERE id= ?")
        return query.get(id)
    }
    static FindByTitle(title: string){
        const query = db.query("SELECT * FROM categories WHERE title like %?%")
        return query.all(title)
    }
    static UpdateOrCreate(title: string, id?: Id){
        if (id) {
            const updatedAt = new Date().toISOString();
            const query = db.query('UPDATE catagories SET title = ?, updated_at = ? WHERE id = ?');

            return query.run(title, updatedAt, id);
        } else {
            const query = db.query('INSERT INTO catagories (title) VALUES (?)');

            return query.run(title);
        }
    }
    static Delete(id: Id){
        const query = db.query("DELETE FROM categories WHERE id= ?")
        return query.run(id)
    }
}


export default Category;