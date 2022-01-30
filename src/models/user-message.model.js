pool = require("../utils/db.js")

module.exports = {
    async create(userMessage) {
        try {
            conn = await pool.getConnection()

            sql = "INSERT INTO user_message SET ? "

            const process = await new Promise((result, reject) => {
                conn.query(sql, userMessage, (err, res) => {
                    if (err) reject(err)
                    result(res)
                })
            })

            return { id: process.insertId }
        } catch (err) {
            throw err
        }
    },
    async get(id) {
        try {
            conn = await pool.getConnection()

            sql = "SELECT * FROM user_message WHERE id = ?"

            const process = await new Promise((result, reject) => {
                conn.query(sql, [id], (err, res) => {
                    if (err) reject(err)
                    result(res[0])
                })
            })

            return { ...process }
        } catch (err) {
            throw err
        }
    }
}