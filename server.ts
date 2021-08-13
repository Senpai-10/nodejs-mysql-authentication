import express from "express";
import mysql from "mysql2"
import bcrypt from "bcrypt"

const conn = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: ""
})

const app = express()
const port = 8080

app.use(express.json())

app.listen(port)

app.post("/register", async (req: any, res: any) => {
  const username = req.body.name
  const password = req.body.password

  try {
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)

    conn.query(`INSERT INTO users (username, password) VALUES ('${username}', '${hash}')`, (err, rows) => {
      if (err) {
        return res.status(400).send('Duplicate entry!')
      } else {
        return res.status(201).send("Success")
      }
    })
  } catch {
    res.status(500).send()
  }
})

app.post("/login", async (req: any, res: any) => {
  const username = req.body.name
  const password = req.body.password

  conn.query(`SELECT password FROM users WHERE username = '${username}'`, async (err, row: any)  => {
    if (row[0]) {
      const hashedPassword = row[0].password
      
      if (await bcrypt.compare(password, hashedPassword)) {
        return res.send("Success")
      } else {
        return res.send("wrong password")
      }
    } else {
      return res.status(401).send('Wrong username!')
    }
  })
})