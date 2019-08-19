import React from 'react';
import styled from 'styled-components';

const InfoBoxWrapper = styled.div`
display: flex;
justify-content: space-around;
transform: translateY(30vh);
`
const InfoWrapper = styled.div`
display: flex;
flex-direction: column;
color: ${({theme})=>theme.primary};
text-transform: uppercase;
`

const InfoText = styled.h1`
align-self: center;
font-size: 3rem;
margin: 0;
`

const InfoSubText = styled.h2`
align-self: center;
font-size: 1.5rem;
margin: 0;
`

const InfoMessage = ({title, message}) =>
    <InfoBoxWrapper>
        <InfoWrapper>
            <InfoText>{title}</InfoText>
            <InfoSubText>{message}</InfoSubText>
        </InfoWrapper>
    </InfoBoxWrapper>



export default InfoMessage