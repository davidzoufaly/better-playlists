//TODO: trololo
// ! important as fuck
// ? what is goin on here
// default comments

import React, { Component } from 'react';
import './App.css';

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
      },
      {
        name: 'DB',
        songs: [{name: 'kvuli holkam', duration: 140}, 
                {name: 'malovani', duration: 200},
                {name: 'plakala', duration: 789},
                {name: 'davno', duration: 320},
                {name: 'cmelak', duration: 181}]
      },
      {
        name: 'Kabát',
        songs: [{name: 'pohoda', duration: 140}, 
                {name: 'dole v dole', duration: 250},
                {name: 'cirkusovej stan', duration: 730},
                {name: 'starej bar', duration: 120},
                {name: 'na sever', duration: 131}] 
      },
      {
        name: 'Pokáč',
        songs: [{name: 'kocka', duration: 100}, 
                {name: 'blbej den', duration: 240},
                {name: 'vymlaceny entry', duration: 330},
                {name: 'hrdinsky cin', duration: 380},
                {name: 'stereotypy', duration: 191}] 
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
        <h2>{Math.round(totalDuration/60)} hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img/>
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
       <img />
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
    setTimeout(() => {
    this.setState({serverData: fakeServerData});
  },1000)
  }

  render() {
    let playlistElements = [];
    if (this.state.serverData.user) {
    for (let i = 0; i < this.state.serverData.user.playlists.length; i++) {
      let playlist = this.state.serverData.user.playlists.length[i];
      playlistElements.push(<Playlist playlist={playlist}/>)
    }
  }

    return (
      <div className="App">
        {this.state.serverData.user ?
        <div>
        <h1 style={{...defaultStyle, 'font-size': '52px'}}>
        {this.state.serverData.user.name}'s Playlists
        </h1>
        <PlaylistCounter playlists={this.state.serverData.user.playlists}/>
        <HoursCounter playlists={this.state.serverData.user.playlists}/>
        <Filter onTextChange={text => this.setState({filterString: text})}/>
        {this.state.serverData.user.playlists
            .filter(
              playlist => 
                playlist.name.toLowerCase().includes(
                  this.state.filterString.toLocaleLowerCase())
            )
            .map(
              playlist => 
                <Playlist playlist={playlist}/>
              )}
        </div> : <h1 style={defaultStyle}>Loading...</h1> }
      </div>
    );
  }
}

export default App;
