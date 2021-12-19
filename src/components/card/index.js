import React, { useState, useContext, createContext } from 'react';
import { FirebaseContext } from '../../context/firebase';
import styled from 'styled-components/macro';
import {
  Container,
  Group,
  Title,
  SubTitle,
  Text,
  Feature,
  FeatureTitle,
  FeatureText,
  FeatureClose,
  Maturity,
  Content,
  Meta,
  Entities,
  Item,
  Image,
} from './styles/card';

export const FeatureContext = createContext();


export default function Card({ children, ...restProps }) {
  const [showFeature, setShowFeature] = useState(false);
  const [itemFeature, setItemFeature] = useState(false);

  return (
    <FeatureContext.Provider value={{ showFeature, setShowFeature, itemFeature, setItemFeature }}>
      <Container {...restProps}>{children}</Container>
    </FeatureContext.Provider>
  );
}

Card.Group = function CardGroup({ children, ...restProps }) {
  return <Group {...restProps}>{children}</Group>;
};

Card.Title = function CardTitle({ children, ...restProps }) {
  return <Title {...restProps}>{children}</Title>;
};

Card.SubTitle = function CardSubTitle({ children, ...restProps }) {
  return <SubTitle {...restProps}>{children}</SubTitle>;
};

Card.Text = function CardText({ children, ...restProps }) {
  return <Text {...restProps}>{children}</Text>;
};

Card.Entities = function CardEntities({ children, ...restProps }) {
  return <Entities {...restProps}>{children}</Entities>;
};

Card.Meta = function CardMeta({ children, ...restProps }) {
  return <Meta {...restProps}>{children}</Meta>;
};

Card.Item = function CardItem({ item, children, ...restProps }) {
  const { setShowFeature, setItemFeature } = useContext(FeatureContext);

  return (
    <Item
      onClick={() => {
        setItemFeature(item);
        setShowFeature(true);
      }}
      {...restProps}
    >
      {children}
    </Item>
  );
};

Card.Image = function CardImage({ item,isWatchList= false,...restProps }) {
  let url = ''  
  if(item && isWatchList)
    {
    let {genre= '', data= [], category=null} = item
    console.log('my title',item, category)
    if(genre == 'children'){
      if(category == 'series'){
        url = `/images/series/${item.genre}/${item.slug}/small.jpg`
      }
      else if(category == null){
        url = `/images/films/${item.genre}/${item.slug}/small.jpg` 
      }
    }
    else if(genre == 'drama' || genre == 'thriller'  || genre == 'suspense' || genre == 'romance'){
      url = `/images/films/${item.genre}/${item.slug}/small.jpg`
    }
    else{
      url = `/images/series/${item.genre}/${item.slug}/small.jpg`
    }
  }
  console.log('my img url',url)
  return isWatchList ? <img src={url} /> : <Image  {...restProps} />;
 
};

Card.Feature = function CardFeature({ isWatchList= false,children, category, ...restProps }) {
  const { showFeature, itemFeature, setShowFeature } = useContext(FeatureContext);
  let url = ''  
  if(itemFeature && isWatchList)
    {
    let {genre= '', data= [], category=null} = itemFeature
    if(genre == 'children'){
      if(category == 'series'){
        url = `/images/series/${itemFeature.genre}/${itemFeature.slug}/large.jpg`
      }
      else if(category == null){
        url =`/images/films/${itemFeature.genre}/${itemFeature.slug}/large.jpg`
      }
    }
    if(genre == 'drama' || genre == 'thriller'  || genre == 'suspense' || genre == 'romance'){
      url = `/images/films/${itemFeature.genre}/${itemFeature.slug}/large.jpg`
    }
    else{
      url = `/images/series/${itemFeature.genre}/${itemFeature.slug}/large.jpg`
    }
  }

  return showFeature ? (
    <Feature src={isWatchList ? url : `/images/${category}/${itemFeature.genre}/${itemFeature.slug}/large.jpg`}>
      <Content>
        <FeatureTitle>{itemFeature.title}</FeatureTitle>
        <FeatureText>{itemFeature.description}</FeatureText>
        <FeatureClose onClick={() => setShowFeature(false)}>
          <img src="/images/icons/close.png" alt="Close" />
        </FeatureClose>

        <Group margin="30px 0" flexDirection="row" alignItems="center">
          <Maturity rating={itemFeature.maturity}>{itemFeature.maturity < 12 ? 'PG' : itemFeature.maturity}</Maturity>
          <FeatureText fontWeight="bold">
            {itemFeature.genre.charAt(0).toUpperCase() + itemFeature.genre.slice(1)}
          </FeatureText>
        </Group>

        {children}
      </Content>
    </Feature>
  ) : null;
};

