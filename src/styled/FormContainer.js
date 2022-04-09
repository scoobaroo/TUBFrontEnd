import styled from 'styled-components';

const FormContainer = styled.div`
  margin: 16px auto;
  max-width: 450px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-row-gap: 8px;

  @media (max-width: 500px) {
    max-width: 100%;
    margin: 16px;
  }
`;

export default FormContainer;
