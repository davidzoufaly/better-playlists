//TODO: trololo
// ! important as fuck
// ? what is goin on here
// default comments

import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

let defaultStyle = {
  color: '#fff',
}

let fakeServerData = {
  user: {
    name: 'David',
    playlists: [
      {
        name: 'Rybičky 48',
        songs: [{name: 'Hit', duration: 134}, 
                {name: 'zeny', duration: 200},
                {name: 'my jeste nejsme stary', duration: 89},
                {name: 'emily', duration: 300},
                {name: 'magdalena', duration: 141}]
      }
    ]
  }
};

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: '40%', display: 'inline-block'}}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0);
    return (
      <div style={{...defaultStyle, width: '40%', display: 'inline-block'}}>
        <h2>{Math.floor(totalDuration / 60)} hours {Math.floor(totalDuration % 60)} minutes </h2>
      </div>
    );
  }
}
 
class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <input type="text" onKeyUp={event => 
          this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return (
     <div style={{...defaultStyle, display: 'inline-block', width: '20%'}}>
       <img src={playlist.imgUrl} style={{width: '120px'}}/>
       <h3>{playlist.name}</h3>
       <ul>
         {playlist.songs.map(song => 
          <li>{song.name}</li>
          )}
       </ul>   
     </div> 
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: ''
    }  
  }
  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    
    fetch('https://api.spotify.com/v1/me', {
        headers: {'Authorization': 'Bearer ' + accessToken}
    }).then((response) => response.json())
    .then(data => this.setState({
      user: {
        name: data.display_name
      }
    }))
  
  fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {'Authorization': 'Bearer ' + accessToken}
  }).then((response) => response.json())
  .then(playlistData => {
    let playlists = playlistData.items
    let trackDataPromises = playlists.map(playlist => {
      let responsePromise = fetch(playlist.tracks.href, {
        headers: {'Authorization': 'Bearer ' + accessToken}
      }) 
    let trackDataPromise = responsePromise
    .then(response => response.json())
  return trackDataPromise   
  })
  let allTracskDatasPromises =
  Promise.all(trackDataPromises)
  let playlistsPromise = allTracskDatasPromises.then(trackDatas => {
    trackDatas.forEach((trackData, i) => {
      playlists[i].trackDatas = trackData.items
      .map(item => item.track)
      .map(trackData => ({
        name: trackData.name,
        duration: trackData.duration_ms / 10000
      }))
    })
    return playlists
  })
  return playlistsPromise
})
  .then(playlists => this.setState({
    playlists: playlists.map(item => ({
      name: item.name,
      imgUrl: item.images[0].url,
      songs: item.trackDatas.slice(0,3)
    }))
  }))

}
  render() {
    let playlistToRender = 
    this.state.user && this.state.playlists 
      ? this.state.playlists.filter(playlist => {
          let matchesPlaylist = playlist.name.toLowerCase().includes(
            this.state.filterString.toLocaleLowerCase())
          let matchesSong = playlist.songs.find(song => song.name.toLocaleLowerCase().includes(this.state.filterString.toLocaleLowerCase()))
          return matchesPlaylist || matchesSong
         }) : []
    return (
      <div className="App">
        {this.state.user ?
        <div>
        <h1 style={{...defaultStyle, 'font-size': '52px'}}>
        {this.state.user.name}'s Playlists
        </h1>
        <PlaylistCounter playlists={playlistToRender}/>
        <HoursCounter playlists={playlistToRender}/>
        <Filter onTextChange={text => this.setState({filterString: text})}/>
        {playlistToRender.map(playlist => 
                <Playlist playlist={playlist}/>
              )}
        </div> : <button onClick={() => 
        window.location = "http://localhost:8888/login"
      }
        className="sign-button">Sign in with Spotify</button> }
      </div>
    );
  }
}

export default App;
