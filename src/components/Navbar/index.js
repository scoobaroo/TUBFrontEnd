import React from 'react';
import styled from 'styled-components';
import { Squeeze as Hamburger } from 'hamburger-react'

const StyledNavMobile = styled.nav`
  border: 1px solid red;
  display: none;
  @media (max-width: 750px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const StyledNavDesktop = styled.nav`
  border: 1px solid blue;

  @media (max-width: 750px) {
    display: none;
  }
`;

export default function Navbar(){
  const [open, setOpen] = React.useState(false);
  const toggleOpen = () => {
    setOpen(!open);
  }
  return (
    <>
      <StyledNavMobile>
        <div>
          <div>Unblock.io</div>
        </div>
        <div>
          <Hamburger toggled={open} toggle={toggleOpen} />
        </div>
      </StyledNavMobile>
      <StyledNavDesktop>
        <div>
          Unblock.io
        </div>
      </StyledNavDesktop>
      {open && (
        <div>
          <div>stuff1</div>
          <div>stuff2</div>
        </div>
      )}
    </>
  );
}
