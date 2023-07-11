const express = require('express'),
    app = express(),
    port = process.env.PORT || 3001,
    cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs').promises

app.use(cors())
app.use(bodyParser.json({ extended: true }))
app.listen(port, () => console.log(`Live on port ${port}`))

app.get('/', getItems)

async function getItems(req, res) {
    try {
        const data = await fs.readFile('database.json')
        const json = JSON.parse(data)
        res.send(json)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

app.post('/add/item', addItem)

async function addItem(req, res) {
    try {
        const id = req.body.jsonObject.id
        const task = req.body.jsonObject.task
        const curDate = req.body.jsonObject.currentDate
        const dueDate = req.body.jsonObject.dueDate
        const newTask = {
            ID: id,
            Task: task,
            Current_Date: curDate,
            Due_Date: dueDate,
        }
        
        const data = await fs.readFile('database.json')
        const json = JSON.parse(data)
        json.push(newTask)
        await fs.writeFile('database.json', JSON.stringify(json))
        console.log('Successfully wrote to file')
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}
