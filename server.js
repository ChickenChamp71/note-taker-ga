const express = require('express');
const path = require('path');
const fs = require('fs');
const noteDb = require(`${__dirname}/db/db.json`);
const uuid = require(`${__dirname}/helpers/uuid`);
const favicon = require('express-favicon');


const PORT = process.env.PORT || 5001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.get('/notes', (req, res) => {
    console.info(noteDb);

    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req,res) => {

    console.info(`${req.method} request recieved to get /api/notes.`);

    fs.readFile(`${__dirname}/db/db.json`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {

            console.info(`readFile: ${data}`);

            const dataTime = JSON.parse(data);

            res.send(dataTime);
        }
    });
});

app.post('/api/notes', (req, res) => {

    const { title, text } = req.body;
    
    if (title && text) {

        const newNote = {
            title,
            text,
            id: uuid(),
        };

        console.info(newNote);

        console.info(`${__dirname}/db/db.json`);

        fs.readFile(`${__dirname}/db/db.json`, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {

                console.info(data);

                const parsedNotes = JSON.parse(data);

                console.info(parsedNotes);

                parsedNotes.push(newNote);

                console.info(parsedNotes);

                fs.writeFile(`${__dirname}/db/db.json`, JSON.stringify(parsedNotes, null, 3), (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                        res.status(500).json({error: 'File write failed here.'});
                    } else {
                        console.info('Data written correctly');
                        fs.readFile(`${__dirname}/db/db.json`, 'utf8', (err, data) => {
                            if (err) {
                                console.error(err);
                            } else {
                
                                console.info(data);
                            }
                        });

                        const response = {
                            status: 'Success',
                            body: newNote,
                        };
                                
                        res.json(response); 
                    }
                    
                }
                )
            }              
        });

    } else {
        res.status(500).json("mission failed we'll get e'm next time");
    }
});

app.get('/api/notes/:id', (req, res) => {

    const noteId = req.params.id;

    fs.readFile(`${__dirname}/db/db.json`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {

            const dataFix = JSON.parse(data);

            console.info(dataFix);

            for (let i = 0; i < dataFix.length; i++) {
        
                if (dataFix[i].id == noteId) {
                    return res.json(dataFix[i]);
                }
            }

            return res.json('No available note.');
        };
    });
});

app.delete('/api/notes/:id', (req, res) => {
    
    console.info(`Check: ${noteDb}`);

    const noteId = req.params.id;
    fs.readFile(`${__dirname}/db/db.json`, 'utf8', (err, data) => {
        
        console.info(`Check 2: ${data}`);

        if (err) {
            console.error(err);
        } else {
            const parseData = JSON.parse(data);
            console.info(data);

            console.info(parseData.length);

            for (let i = 0; i < parseData.length; i++) {

                console.info(`Check 3: for loop`);

                if (parseData[i].id == noteId) {
                    
                    console.info(noteId);

                    parseData.splice(i, 1);

                    console.info(parseData);

                    fs.writeFile(`${__dirname}/db/db.json`, JSON.stringify(parseData, null, 3), (writeErr) => {
                        if (writeErr) {
                            console.error(writeErr);
                            res.status(500).json({error: 'Failed to write file.'})
                        } else {
                            console.info('Wrote successfully!');
                            const response = {
                                status: 'success',
                                body: parseData,
                            };

                            res.json(response);
                        }
                    })

                    
                }
                
            }
        }
    });
});

app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`)
);