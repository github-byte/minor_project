import styled from 'styled-components/macro';


export const Container = styled.div`
display: inline;
`;

export const Button = styled.button`
  background-color: #0f79af;
  border-color: #0f79af;
  margin-bottom: 20px;
  width: 145px;
  height: 45px;
  text-transform: uppercase;
  font-weight: bold;
  color: white;
  font-size: 18px;
  height: 45px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;

  &:hover {
    transform: scale(1.10);
    background-color: #0f79af;
  }
`;
