import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';

const CLIENT_ID = "387279f221ed48f68d07577ef0d86ab4";
const CLIENT_SECRET = "95bb7060f2254649852bfc6fe195b383";

function App() {
  
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
      .then(data => console.log(data))
  }, [])

  return (
    <div className="App">

    </div>
  );
}

export default App;
