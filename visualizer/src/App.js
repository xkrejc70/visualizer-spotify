import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap'; 

const CLIENT_ID = "387279f221ed48f68d07577ef0d86ab4";
const CLIENT_SECRET = "95bb7060f2254649852bfc6fe195b383";


// https://developer.spotify.com/documentation/web-api/reference/#/
function App() {
  const [artist, setArtist] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [topTracks, setTopTracks] = useState([]);

  
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

    // Find artist's ID (top searched result)
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + artist + '&type=artist', authParameters)
      .then(response => response.json())
      .then(data => {
        return (data.artists.items[0].id)
      })

    // Find artist's top tracks
    var returnedTopTracks = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks' + '?market=CZ', authParameters)
      .then(response => response.json())
      .then(data => {
        setTopTracks(data.tracks)
      })
  }

  console.log(topTracks);

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
    </div>
  );
}

export default App;
