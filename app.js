// Pacotes requiridos
const express = require("express")
const fetch = require("node-fetch")
require("dotenv").config()

// Criando servidor expresso
const app = express()

// Número de porta do servidor
const PORT = process.env.PORT || 3000

// Configurando o modelo de motor
app.set("view engine", "ejs")
app.use(express.static("public"))

// Necessário para fazer análise do HTML data para o POST request
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.get("/", (req, res) => {
    res.render("index")
} )

app.post("/convert-mp3", async (req, res) => {
    const videoId = req.body.videoID
    if (
        videoId === undefined || 
        videoId === "" ||
        videoId === null
    ) {
        return res.render("index", {success : false, message: "Coloca a URL do vídeo 😡🫵" })
    } else {
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
            "method" : "GET",
            "headers": {
                "x-rapidapi-key" : process.env.API_KEY,
                "x-rapidapi-host" : process.env.API_HOST
            }
        } )

        const fetchResponse = await fetchAPI.json()

        if (fetchResponse.status === "ok")
        return res.render("index", {success : true, song_title: fetchResponse.title, song_link : fetchResponse.link })
        else
        return res.render("index", {success : false, message : fetchResponse.msg} )
    }
} )

// Iniciando o servidor
app.listen(PORT, ()=> {
    console.log(`Servidor iniciado na porta ${PORT}`)
})

