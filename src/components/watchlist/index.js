import React, { useState, useContext, createContext, useEffect } from 'react';
import { Button, Container } from './styles/watchlist';
import { FirebaseContext } from '../../context/firebase';
import 'firebase/database'
import { FeatureContext } from '../card';
import { firebase } from '../../lib/firebase.prod';

export const WatchListContext = createContext();

export default function WatchList({ children, ...restProps }) {
  const [add, setAdd] = useState(false);
  const [watchList, setWatchList] = useState([])
  const { showFeature, itemFeature } = useContext(FeatureContext);
  const [data, setData]  = useState([])
  const [watchId, setWatchId] = useState([])
  const { firebase } = useContext(FirebaseContext);
  const user = firebase.auth().currentUser || {};

  useEffect(() => {
      var starCountRef = firebase.database().ref('watchlist/' + user.uid);
      starCountRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if(data){
          console.log('xsvs',data)
          setData(data)
      }
      });
  },[])

  useEffect(() => {
    if(data.length == 0) return
    if(data){
        let {watchId= []} = data
        setWatchId(watchId)     
    }
  },[data])


  useEffect(() => {
    if(add){
        if(data.length == 0){
            firebase.database().ref('watchlist/' + user.uid).set({
                userId: user.uid,
                watchId: [itemFeature.id]
              }, (error) => {
                if (error) {
                  // The write failed...
                    console.log(error)
                } else {
                  // Data saved successfully!
                  console.log("data saved")
                }
              });
        }
        else{
            let watchIdArray = watchId
            watchIdArray = watchIdArray.filter( item => {
              return item.id != itemFeature.id   
            })
            if(watchIdArray.length > 0){
                watchIdArray.push(itemFeature.id)
            }
            console.log('my watchs',watchIdArray)
            var ref = firebase.database().ref('/watchlist/' + user.uid);
            ref.once('value').then(function (snapshot) {
            return ref.update({
                userId: user.uid,
                watchId: watchIdArray
            });
            });
        }
    }
    
},[add])



console.log('my obj',watchList)
  return (
    <WatchListContext.Provider value={{ add, setAdd, watchId }}>
      <Container {...restProps}>{children}</Container>
    </WatchListContext.Provider>
  );
}

WatchList.Button = function WatchList({ children, category, ...restProps }) {
    const { add, setAdd } = useContext(WatchListContext);
    const {watchId} = useContext(WatchListContext)
    const [isAddedInDb, setIsAddedInDb] = useState(false)
    const {itemFeature= {}} = useContext(FeatureContext)
    console.log('featureddd', watchId, itemFeature.id)
    const { firebase } = useContext(FirebaseContext);
    const user = firebase.auth().currentUser || {};

    // const dbRef = firebase.database().ref('watchlist').child(itemFeature.id);
    

    // let item = firebase.ref(itemFeature.id)
    var starCountRef = firebase.database().ref('watchlist/' + user.uid + '/watchId');
    starCountRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if(data != null){
      // let {watchId= []} = data
      console.log('see data123',data);
    }
    });

    console.log('see 1234',starCountRef);
    useEffect(() => {
      if(watchId.indexOf(itemFeature.id) != -1){
        setIsAddedInDb(true)
      }
    },[watchId, itemFeature])


    const handleClick = () => {
      isAddedInDb ? setAdd(false) : setAdd(true)
      console.log("handle", itemFeature.id)
    }

  return (  
    <Button onClick={handleClick}>{!isAddedInDb ? 'Add To WatchList' : 'In WatchList!'}</Button>
  ) 
};
