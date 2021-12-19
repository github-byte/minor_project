import styled from 'styled-components/macro';

export const Container = styled.div`
  display: flex;
  padding: 30px 0px;
  margin: auto;
  max-width: 1000px;
  flex-direction: column;

  @media (max-width: 1000px) {
    padding: 30px 0px;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  grid-gap: 15px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

export const Link = styled.a`
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 15px;
  text-decoration: none;
`;

export const Title = styled.p`
  font-size: 20px;
  color: #ffffff;
  text-align: center;
  margin-bottom: 40px;
`;

export const Text = styled.p`
  font-size: 20px;
  color: #fff;
  text-align: center;
  margin-bottom: 40px;
`;

export const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`;
