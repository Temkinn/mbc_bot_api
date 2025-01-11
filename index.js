import express from "express"

const app = express()
const PORT = 6969

app.use(express.json())

app.get('/', (req, res) => {
	res.send('Hello, World!')
})

app.get('/:point', (req, res) => {
	res.send(`Hello from ${req.params.point}`)
})

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`)
})

