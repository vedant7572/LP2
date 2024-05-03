const express = require("express");
const mongoose = require("mongoose");
const Music = require("./music.js");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

// middleware
app.use(express.json());

const mongo_url = "mongodb://0.0.0.0:27017/music";
const port = 3000;

mongoose
  .connect(mongo_url)
  .then(() => {
    app.listen(port, () => {
      console.log("Server connected successfully");
      console.log("mongo connected successfully!!");
    });
  })
  .catch((err) => {
    console.log("Error occured", err);
  });

app.post("/addSongs", async (req, res) => {
  const { Songname, Film, Music_director, singer } = req.body;
  const music = await Music.create({ Songname, Film, Music_director, singer });
  res.send(music);
});

// app.post("/addSongs", async (req, res)=>{
//     try {
//         const { Songname, Film, Music_director, singer } = req.body;
//         const music = await Music.create({ Songname, Film, Music_director, singer });
//         res.send(music);
//     } catch (error) {
//         console.error("Error adding song:", error);
//         res.status(500).send("Error adding song");
//     }
// });

app.get("/showSongs", async (req, res) => {
  const songs = await Music.find();
  res.send({ "Number of songs": songs.length, songs });
});

app.get("/songsDirector/:musicDirector", async (req, res) => {
  const music_Director = req.params.musicDirector;
  const songs = await Music.find(
    { Music_director: music_Director },
    { Songname: true }
  );
  res.send(songs);
});

app.get("/songDirectorSinger/:singer/:director", async (req, res) => {
  try {
    const singer = req.params.singer;
    const director = req.params.director;

    const songs = await Music.find(
      { Music_director: director, singer: singer },
      { Songname: true }
    );
    if (songs.length == 0) {
      res.send("No song found");
    } else {
      res.send(songs);
    }
  } catch (err) {
    console.log(err);
  }
});

app.delete("/deleteSong/:song", async (req, res) => {
  try {
      const songName = req.params.song;
      const result = await Music.deleteOne({ Songname: songName });

      if (result.deletedCount > 0) {
          res.status(200).send("Song deleted successfully");
      } else {
          res.status(404).send("Song is not present");
      }
  } catch (err) {
      res.status(500).send(err.message);
  }
});


app.put("/updateActorActress/:song_id", async(req, res)=>{
    try{
        const songid = req.params.song_id;
        const {actor, actress} = req.body;
  
        const song = await Music.findById({_id:songid});
        if(song){
            await Music.findByIdAndUpdate({_id:songid}, {Actor:actor, Actress:actress});
            res.send("song updated successfully");
        }
        else{
            res.send("No song found");
        }
    }catch(err){
        res.send(err);
    }
})

app.get("/getSongs", async(req, res)=>{
    const songs = await Music.find();

    let html = "<table border=1, style='border-collapse: collapse'>"
    html = html + `<tr>
        <th>Songname</th>
        <th>Film</th>
        <th>Music Director</th>
        <th>Singer</th>
        <th>Actor</th>
        <th>Actress</th>
    </tr>`

    songs.map((song)=>{
        html = html + "<tr>"

        html = html + "<td>" + song.Songname + "</td>"
        html = html + "<td>" + song.Film + "</td>"
        html = html + "<td>" + song.Music_director + "</td>"
        html = html + "<td>" + song.singer + "</td>"
        html = html + "<td>" + song.Actor + "</td>"
        html = html + "<td>" + song.Actress + "</td>"

        html = html + "</tr>"
    })

    html = html + "</table>"
    res.send(html);
})
