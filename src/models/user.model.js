pool = require("../utils/db.js")

module.exports = {
    async create(user) {
        try {
            conn = await pool.getConnection()

            sql = `INSERT INTO user SET ?`

            const process = await new Promise((result, reject) => {
                conn.query(sql, user, (err, res) => {
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

            sql = "SELECT * FROM user WHERE id = ?"

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

// (async () => {
//     result = await this.create({ name: "GANI GEMILAR", birthdate: "1995-06-03" })
//     debugger
// })

// module.exports.create({ name: "GANI tes", birthdate: "1995-06-03" }).then(res => {
//     console.log(res)
// }).catch(err => {
//     console.error(err)
// })

module.exports.get(4).then(res => {
    console.log(res)
}).catch(err => {
    console.error(err)
})
