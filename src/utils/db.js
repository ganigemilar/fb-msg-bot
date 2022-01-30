const mysql = require("mysql")

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "fb_msg_bot"
})

module.exports = {
    getConnection() {
        return new Promise((result, reject) => {
            pool.getConnection((err, conn) => {
                if (err) reject(err)
                result(conn)
            })
        })
    }
}
