import styled from 'styled-components';

import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 2rem;
  flex-direction: column;
`;

const Frame = styled.iframe`
  display: block;
  margin: 0 auto;
`;

const Agreement = styled(Link)`
  align-self: flex-end;
  display: block;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  border: 1px solid var(--red);
  color: var(--red);
  text-transform: uppercase;
  text-decoration: none;
`;

export {
  Container,
  Frame,
  Agreement
};
