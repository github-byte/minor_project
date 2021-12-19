import React, { useState, useEffect, useContext } from 'react';
import Fuse from 'fuse.js';
import { useHistory } from 'react-router-dom';
import { Card, Header, Loading, Player, WatchList } from '../components';
import * as ROUTES from '../constants/routes';
import logo from '../logo.svg';
import image2vector from '../image2vector.svg'
import { FirebaseContext } from '../context/firebase';
import { SelectProfileContainer } from './profiles';
import { FooterContainer } from './footer';

export function BrowseContainer({ slides }) {
  const [category, setCategory] = useState('series');
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isWatchList, setIsWatchList] = useState(false);
  const [slideRows, setSlideRows] = useState([]);
  const [watchListIds, setWatchListIds] = useState([])
  const [watchList, setWatchList] = useState([])
  const [addedList, setAddedList] = useState([])
  const [imgUrl, setImgUrl] = useState('')
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);
  const user = firebase.auth().currentUser || {};

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [profile.displayName]);

  console.log('my slide',slides)
  useEffect(() => {
    setSlideRows(slides[category]);
    let finalList = slides['series'].concat(slides['films'])
    console.log('finalList',finalList)
    setAddedList(finalList)
  }, [slides, category]);

  useEffect(() => {
    const fuse = new Fuse(slideRows, { keys: ['data.description', 'data.title', 'data.genre'] });
    const results = fuse.search(searchTerm).map(({ item }) => item);

    if (slideRows.length > 0 && searchTerm.length > 3 && results.length > 0) {
      setSlideRows(results);
    } else {
      setSlideRows(slides[category]);
    }
    // eslint-disable-next-line
  }, [searchTerm]);

  
  useEffect(() => {
    var starCountRef = firebase.database().ref('watchlist/' + user.uid);
    starCountRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if(data != null){
      let {watchId= []} = data
      console.log('see data',watchId);
      setWatchListIds(watchId)
    }
    });
  },[firebase, user])

  useEffect(() => {
    // if(watchListIds.length == 0) return
    let finalArr=[];
    console.log('hello', slides)
    let arr = slides['series'].concat(slides['films']);
    console.log('array list',arr,slides)
    arr.map((slideItem) => {
      console.log('hello2')
      let {data= [], title=''} = slideItem
      let array = [];
      console.log('my item',slideItem)
      data.forEach(element => {
        let {id= ''} = element
        watchListIds.forEach(idi => {if(idi == id)array.push(element)})

      })
      finalArr.push({title:title,data:array})
      console.log('my final arr',finalArr)
    })
    setWatchList(finalArr)

  },[slides, watchListIds])

  console.log('fix watch', watchListIds, watchList, slides)
  const handleClick = () => {
    window.location.href = '/signup'
    firebase.auth().signOut()
  }

  const handleSeries = () => {
    setCategory('series');
    setIsWatchList(false)
    // window.location.href = ROUTES.BROWSE
    history.push('/browse')
  }
  
  console.log('watch list',watchListIds, watchList)
  return profile.displayName ? (
    <>
      {loading ? <Loading src={user.photoURL} /> : <Loading.ReleaseBody />}

      {!isWatchList && <Header src="joker1" dontShowOnSmallViewPort>
        <Header.Frame>
          <Header.Group>
            <Header.Logo to={ROUTES.BROWSE} src={image2vector} alt="Netflix" />
            <Header.TextLink active={category === 'series' ? 'true' : 'false'} onClick={() => setCategory('series')}>
              Series
            </Header.TextLink>
            <Header.TextLink active={category === 'films' ? 'true' : 'false'} onClick={() => setCategory('films')}>
              Films
            </Header.TextLink>
            <Header.TextLink onClick={() => {history.push(ROUTES.WATCHLIST); setIsWatchList(!isWatchList)}}>
              WatchList
            </Header.TextLink>
          </Header.Group>
          <Header.Group>
            <Header.Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Header.Profile>
              <Header.Picture src={user.photoURL} />
              <Header.Dropdown>
                <Header.Group>
                  <Header.Picture src={user.photoURL} />
                  <Header.TextLink>{user.displayName}</Header.TextLink>
                </Header.Group>
                <Header.Group>
                  <Header.TextLink onClick={() => firebase.auth().signOut()}>Sign out</Header.TextLink>
                </Header.Group>
              </Header.Dropdown>
            </Header.Profile>
          </Header.Group>
        </Header.Frame>

        {!isWatchList && <Header.Feature>
          <Header.FeatureCallOut>Watch Joker Now</Header.FeatureCallOut>
          <Header.Text>
            Forever alone in a crowd, failed comedian Arthur Fleck seeks connection as he walks the streets of Gotham
            City. Arthur wears two masks -- the one he paints for his day job as a clown, and the guise he projects in a
            futile attempt to feel like he's part of the world around him.
          </Header.Text>
          <Header.PlayButton>Play</Header.PlayButton>
        </Header.Feature>}

      </Header>}


      {isWatchList && <Header src="joker1" dontShowOnSmallViewPort>
        <Header.Frame>
          <Header.Group>
            <Header.Logo to={ROUTES.BROWSE} src={image2vector} alt="Netflix" />
            <Header.TextLink active={category === 'series' ? 'true' : 'false'} to={ROUTES.BROWSE} onClick={() => {handleSeries()}}>
              Series
            </Header.TextLink>
            <Header.TextLink active={category === 'films' ? 'true' : 'false'} onClick={() => {setCategory('films');setIsWatchList(false)}}>
              Films
            </Header.TextLink>
            <Header.TextLink onClick={() => {history.push(ROUTES.WATCHLIST); setIsWatchList(true)}}>
              WatchList
            </Header.TextLink>
          </Header.Group>
          <Header.Group>
            <Header.Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Header.Profile>
              <Header.Picture src={user.photoURL} />
              <Header.Dropdown>
                <Header.Group>
                  <Header.Picture src={user.photoURL} />
                  <Header.TextLink>{user.displayName}</Header.TextLink>
                </Header.Group>
                <Header.Group>
                  <Header.TextLink onClick={() => handleClick()}>Sign out</Header.TextLink>
                </Header.Group>
              </Header.Dropdown>
            </Header.Profile>
          </Header.Group>
        </Header.Frame>
        <Header.Feature watchList={true}>
        </Header.Feature>
      </Header>}

      {!isWatchList && <Card.Group>
        {slideRows.map((slideItem) => (
          <Card key={`${category}-${slideItem.title.toLowerCase()}`}>
            <Card.Title>{slideItem.title}</Card.Title>
            <Card.Entities>
              {slideItem.data.map((item) => (
                <Card.Item key={item.docId} item={item}>
                  <Card.Image src={`/images/${category}/${item.genre}/${item.slug}/small.jpg`} />
                  <Card.Meta>
                    <Card.SubTitle >{item.title}</Card.SubTitle>
                    <Card.Text>{item.description}</Card.Text>
                  </Card.Meta>
                </Card.Item>
              ))}
            </Card.Entities>
            <Card.Feature category={category}>
              <WatchList>
              <WatchList.Button/>
              </WatchList>
               <Player>
              <Player.Button />
                <Player.Video src="/videos/bunny.mp4" />
              </Player>
            </Card.Feature>
          </Card>
        ))}
      </Card.Group>}

    
      {isWatchList && <Card.Group>
        {watchList.map((slideItem) => {
          return slideItem.data.length != 0 &&
         <Card>
            <Card.Title>{slideItem.title}</Card.Title>
            <Card.Entities>
              {slideItem.data.map((item) => (
                <Card.Item key={item.docId} item={item}>
                  <Card.Image item={item} isWatchList={true}/>
                  <Card.Meta>
                    <Card.SubTitle >{item.title}</Card.SubTitle>
                    <Card.Text>{item.description}</Card.Text>
                  </Card.Meta>
                </Card.Item>
              ))}
            </Card.Entities>
            <Card.Feature category={category} isWatchList= {true}>
              <Player>
                <Player.Button />
                <Player.Video src="/videos/bunny.mp4" />
              </Player>
            </Card.Feature>
          </Card>
          })}
      </Card.Group>}
      <FooterContainer />
    </>
  ) : (
    <SelectProfileContainer user={user} setProfile={setProfile} />
  );
}