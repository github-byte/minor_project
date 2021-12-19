import React, { useState, useContext, createContext } from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player'
import { Container, Button, Overlay, Inner, Close } from './styles/player';
import { FeatureContext } from '../card';

export const PlayerContext = createContext();

export default function Player({ children, ...restProps }) {
  const [showPlayer, setShowPlayer] = useState(false);
  const {itemFeature } = useContext(FeatureContext);

  return (
    <PlayerContext.Provider value={{ showPlayer, setShowPlayer, itemFeature }}>
      <Container {...restProps}>{children}</Container>
    </PlayerContext.Provider>
  );
}

Player.Video = function PlayerVideo({ src, ...restProps }) {
  const { showPlayer, setShowPlayer, itemFeature } = useContext(PlayerContext);
  const {link=''} = itemFeature

  return showPlayer
    ? ReactDOM.createPortal(
        <Overlay onClick={() => setShowPlayer(false)} data-testid="player">
          <Inner>
          <ReactPlayer
                url={link ? link : src}
                controls
                width = "896px"
                height = "504px"
                playing={true}
            />
            {/* <video id="netflix-player" controls>
              <source src={link ? link : src} type="video/mp4" />
            </video> */}
            <Close />
          </Inner>
        </Overlay>,
        document.body
      )
    : null;
};

Player.Button = function PlayerButton({ ...restProps }) {
  const { showPlayer, setShowPlayer } = useContext(PlayerContext);
  console.log('show', showPlayer)
  return <Button onClick={() => setShowPlayer(!showPlayer)}>Play</Button>;
};
