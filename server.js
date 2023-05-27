const express = require('express');
const path = require('path');
const fs = require('fs');
const noteDb = require('./db/db.json');
const uuid = require('./helpers/uuid');


const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req,res) => {
    console.info(`${req.method} request recieved for notes`);

    res.json(noteDb);
});

app.post('/api/notes', (req, res) => {

    const { title, text } = req.body;
    
    if (title && text) {

        const newNote = {
            title,
            text,
            id: uuid(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);

                parsedNotes.push(newNote);

                fs.writeFile(`./db/db.json`, JSON.stringify(parsedNotes, null, 4), (writeErr) =>
            writeErr
                ? console.error(writeErr)
                : console.log(
                    `It worked :D`
                    )
                );
            };
        });



        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json("mission failed we'll get e'm next time");
    }
});

app.delete('/api/notes/:id', (req, res) => {
    
    const noteId = req.params.id;

    const deleteSearch = noteDb.filter(id => {
        return noteDb.id !== noteId;
    })

    

})

app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`)
);