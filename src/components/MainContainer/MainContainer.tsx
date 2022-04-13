import { Container, ContainerProps } from '@mui/material';
import React, { FC } from 'react';

export interface MainContainerProps extends ContainerProps {
  children: React.ReactElement | React.ReactElement[];
}

export const MainContainer: FC<MainContainerProps> = ({children, ...props}) => {
  return (
    <Container {...props}>
      {children}
    </Container>  
  )
};