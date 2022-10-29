// spotify player to search and play tracks

import React, { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { Form, Container } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResults from "./TrackSearchResults";
import Player from "./Player";
import axios from "axios";

const spotifyApi = new SpotifyWebApi({
  clientId: "3b2cc20669ac4e298ef4118589eb889c",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState("");
  const [lyrics, setLyrics] = useState("");

  useEffect(() => {
    if (!playingTrack) return;
    setLyrics("Loading Lyrics...");
    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          title: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => setLyrics(res.data.lyrics));
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    // set accessToken to specify our access query
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
    let cancelRequest = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancelRequest) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (smallest.height > image.height) return image;
              return smallest;
            },
            track.album.images[0]
          );
          const largestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (smallest.height < image.height) return image;
              return smallest;
            },
            track.album.images[0]
          );
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            smallestAlbumUrl: smallestAlbumImage.url,
            largestAlbumUrl: largestAlbumImage.url,
          };
        })
      );
    });
    return () => {
      cancelRequest = true;
    };
  }, [search, accessToken]);

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.length === 0 ? (
          playingTrack === "" ? (
            <div className="text-center">Search song to play.</div>
          ) : (
            <div className="d-flex flex-column  align-items-center">
              <img
                src={playingTrack?.largestAlbumUrl}
                alt="img"
                style={{ height: "50%", width: "50%" }}
              />
              <div className="text-center my-5" style={{ whiteSpace: "pre" }}>
                {lyrics}
              </div>
            </div>
          )
        ) : (
          searchResults.map((track) => (
            <TrackSearchResults
              track={track}
              chooseTrack={chooseTrack}
              key={track.uri}
            />
          ))
        )}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  );
}
