// Login component that redirects you to spotify login

import React, { useEffect } from "react";
import { Container } from "react-bootstrap";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=3b2cc20669ac4e298ef4118589eb889c&response_type=code&redirect_uri=http://localhost:3000&scope=ugc-image-upload%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private%20user-follow-modify%20user-follow-read%20user-read-currently-playing%20user-read-playback-position%20user-library-modify%20playlist-modify-private%20playlist-modify-public%20user-read-email%20user-top-read%20streaming%20user-read-recently-played%20user-read-private%20user-library-read";

export default function Login() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <a className="btn btn-success btn-lg mt-auto" href={AUTH_URL}>
        LOGIN TO SPOTIFY
      </a>
      <p className="text-muted mt-auto">
        Note: Login With Spotify Premium Account.
      </p>
    </Container>
  );
}
