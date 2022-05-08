import React, { useState, useEffect, useContext } from 'react';
import Fuse from 'fuse.js';
import { useHistory } from 'react-router-dom';
import { Card, Header, Loading, Player, WatchList } from '../components';
import * as ROUTES from '../constants/routes';
import image2vector from '../newImg.svg'
import { FirebaseContext } from '../context/firebase';
import { SelectProfileContainer } from './profiles';
import { FooterContainer } from './footer';
import CountdownTimer from './countDownTimer'
import { useCountdown } from './useCountDown';

export function BrowseContainer({ slides }) {
  const [category, setCategory] = useState('series');
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isWatchList, setIsWatchList] = useState(false);
  const [slideRows, setSlideRows] = useState([]);
  const [watchListIds, setWatchListIds] = useState([])
  const [watchList, setWatchList] = useState([])
  const [timeLeft, setTimeLeft] = useState(4 * 60 * 60 * 1000)
  const [timeInterval, setTimeInterval] = useState(0)
  const [addedList, setAddedList] = useState([])
  const [imgUrl, setImgUrl] = useState('')
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);
  const user = firebase.auth().currentUser || {};

  // const THREE_DAYS_IN_MS =  timeLeft;
  // console.log('incoming time',timeLeft)
  const NOW_IN_MS = new Date().getTime();

  useEffect(() => {
    var starCountRef = firebase.database().ref('users/' + user.uid);
    console.log('my data2',starCountRef)
    starCountRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if(data){
        console.log('my data3',snapshot,new Date(data['loginIn']),data)
        // let timeInt = data.logoutTime - data.loginTime;
        if(!data.timeSpend){
          setTimeInterval(0)
        }
        else{
          setTimeInterval(data.timeSpend);
        }
        console.log("my time",new Date(data.loggedIn).getDate(), new Date().getDate())
      }
    });
  },[user])
  
  useEffect(() => {
    if(timeInterval > 4 * 60 * 60 * 1000){
      alert("time limit exceeded,You can see tomorrow")
      return;
    }

    console.log('timing',(60 * 60 * 1000 - 80140), timeInterval)
    window.sessionStorage.setItem('COUNTER_KEY', 4 * 60 * 60 * 1000 - timeInterval);
    setTimeLeft(4 * 60 * 60 * 1000 - timeInterval)

  },[timeInterval])
  
  const dateTimeAfterThreeDays = NOW_IN_MS + timeLeft
  console.log('time logs',timeLeft)

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

  const handleSeries = () => {
    setCategory('series');
    setIsWatchList(false)
    window.location.href = ROUTES.BROWSE
    // history.push('/browse')
  }

  const handleClick = () => {
    let newUser = window.localStorage.getItem('authUser');
    let userTime = JSON.parse(newUser).lastLoginAt
    let timeInt = new Date().getTime() - parseInt(userTime);

    var starCountRef = firebase.database().ref('users/' + user.uid);
    console.log('my data2',starCountRef)
    starCountRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if(data){
        console.log('my data3',snapshot,new Date(data['loginIn']),data)
        // let timeInt = data.logoutTime - data.loginTime;
        if(!data.timeSpend || new Date(data.loggedIn).getDate() != new Date().getDate() || new Date(data.loggedIn).getMonth() != new Date().getMonth()){
          timeInt = 0;
        }
        else{
          timeInt = timeInt + data.timeSpend;
        }
        console.log("my time",data.loggedIn)
      }
    });

   
    firebase.auth().signOut().then(()=> {
      firebase.database().ref('users/' + user.uid).update({
      timeSpend:timeInt,
      loggedIn:new Date().getTime()
   }).then(()=> console.log('time noted2',dateTimeAfterThreeDays)).catch(()=> console.log("error"));
   }).catch((err)=> console.log(err))
    window.location.href = '/signin'
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
            <Header.TextLink  onClick={() => {history.push(ROUTES.WATCHLIST); setIsWatchList(true)}}>
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
            <CountdownTimer targetDate={dateTimeAfterThreeDays} />
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
            <CountdownTimer targetDate={dateTimeAfterThreeDays} />
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
                <Player.Remove/>
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