import { createContext, useState } from "react";
import React from "react";
import PropTypes from "prop-types";

let initialAppContext;
window.localStorage.getItem("app-context")
  ? (initialAppContext = JSON.parse(window.localStorage.getItem("app-context")))
  : window.sessionStorage.getItem("app-context")
  ? (initialAppContext = JSON.parse(
      window.sessionStorage.getItem("app-context")
    ))
  : (initialAppContext = {
      user_logged: false,
      current_room: undefined,
      remember_user: false,
      songs: [],
      updatable: undefined,
      selection: { current: [] },
      x_token: "",
      setXToken: () => {},
      setSelection: () => {},
      setSelectedUser: () => {},
      serCurrentRoom: () => {},
      setSongs: () => {},
      setRememberUser: () => {},
      closeSession: () => {},
    });

const AppContext = createContext(initialAppContext);

export function AppContextProvider({ children }) {
  const [rememberUser, setRememberUser] = useState(initialAppContext.token);
  const [userLogged, setUserLogged] = useState(initialAppContext.user_logged);
  const [songs, setSongs] = useState(initialAppContext.songs);
  const [selection, setSelection] = useState(initialAppContext.selection);
  const [xToken, setXtoken] = useState(initialAppContext.x_token);
  const [updatable, setUpdatable] = useState(initialAppContext.updatable);
  const [currentRoom, setCurrentRoom] = useState(
    initialAppContext.current_room
  );

  function setRememberUserHandler(remember) {
    setRememberUser(remember);
  }

  function setUpdatableHandler(remember) {
    setUpdatable(remember);
  }
  function setXtokenHandler(xToken) {
    setXtoken(xToken);
  }
  function setUserHandler(user) {
    setUserLogged(user);
  }
  function setSelectionHandler(selection) {
    setSelection(selection);
  }
  function setCurrentRoomHandler(room) {
    setCurrentRoom(room);
  }

  function setSongsHandler(songs) {
    setSongs(songs);
  }

  function closeSessionHandler() {
    setRememberUser(false);
    setUserLogged(false);
    setSelection({ current: [] });
    setCurrentRoom(undefined);
    setSongs([]);
    window.localStorage.clear();
  }

  const context = {
    user_logged: userLogged,
    remember_user: rememberUser,
    current_room: currentRoom,
    songs: songs,
    selection: selection,
    x_token: xToken,
    updatable: updatable,
    setXtoken: setXtokenHandler,
    setSelection: setSelectionHandler,
    setUserLogged: setUserHandler,
    setCurrentRoom: setCurrentRoomHandler,
    setRememberUser: setRememberUserHandler,
    setSongs: setSongsHandler,
    setUpdatable: setUpdatableHandler,
    closeSession: closeSessionHandler,
  };

  window.sessionStorage.setItem("app-context", JSON.stringify(context));
  if (context.remember_user) {
    window.localStorage.setItem("app-context", JSON.stringify(context));
  }
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppContext;
