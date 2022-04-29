import React from 'react';
import { AppContext } from '../context';

export default function useUIControls() {
  const [state, setState] = React.useContext(AppContext);

  const toggleTheme = () => {
    const _map  = { light: 'dark', dark: 'light' };
    const theme = _map[state.theme];
    setState((prevState) => ({
      ...prevState,
      theme
    }));

    if (window.localStorage) {
      window.localStorage.setItem('unblockTheme', theme);
    }
  }

  const reSize = () => {
    const _map  = { large: 'medium', medium: 'large' };
    const scale = _map[state.scale];
    setState((prevState) => ({
      ...prevState,
      scale
    }));

    if (window.localStorage) {
      window.localStorage.setItem('unblockScale', scale);
    }
  }

  const toggleMode = () => {
    const _map = { customer: 'provider', provider: 'customer' };
    const mode = _map[state.mode];
    setState((prevState) => ({
      ...prevState,
      mode
    }));

    if (window.localStorage) {
      window.localStorage.setItem('unblockMode', mode);
    }
  }

  return {
    toggleTheme,
    reSize,
    toggleMode,
  }
}
