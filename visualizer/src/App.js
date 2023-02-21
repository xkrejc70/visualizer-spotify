import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Table } from 'react-bootstrap'; 

const CLIENT_ID = "387279f221ed48f68d07577ef0d86ab4";
const CLIENT_SECRET = "95bb7060f2254649852bfc6fe195b383";


// https://developer.spotify.com/documentation/web-api/reference/#/
function App() {
  const [artist, setArtist] = useState("");
  const [artistname, setArtistName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [topTracks, setTopTracks] = useState([]);
  const [artistGenres, setArtistgenres] = useState([]);
  
  // Run after render
  useEffect(() => {
    // Spotify API - get access token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
      .catch(err => {
        console.log(err)
        // TODO: render error html
      })

  }, [])

  async function findTopTracks() { 
    var authParameters = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    // Find artist's ID and genres (top searched result)
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + artist + '&type=artist', authParameters)
      .then(response => response.json())
      .then(data => {
        setArtistgenres(data.artists.items[0].genres);
        setArtistName(data.artists.items[0].name);
        return (data.artists.items[0].id);
      })


    // Find artist's top tracks
    var returnedTopTracks = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks' + '?market=CZ', authParameters)
      .then(response => response.json())
      .then(data => {
        setTopTracks(data.tracks)
      })
  }


  return (
    <div className="App">
      <h1>Visualizer of Spotify artist's top tracks</h1>

      <Container>
        <InputGroup className="mb-3">
          <FormControl
              placeholder="Search artist"
              type="input"
              onKeyPress={event => {
                if (event.key == "Enter") {
                  findTopTracks();
                }
              }}
              onChange={event => setArtist(event.target.value)}
            />
            <Button onClick={findTopTracks}>
              Search
            </Button>
        </InputGroup>
      </Container>

      <Container>
        <h2>{artistname}</h2>
        <h5>
          {artistGenres.map( (genre, idx) => {
            return (<i>{genre}</i>)
          })}
        </h5>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Album</th>
              <th>Popularity</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>

          {topTracks.map( (topTrack, idx) => {
            return (
              <tr>
                <td>{idx+1}</td>
                <td>{topTrack.name}</td>
                <td>{topTrack.album.name}</td>
                <td>{topTrack.popularity}</td>
                <td>{topTrack.id}</td>
              </tr>
              )
            })}

          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default App;
