import React, { useCallback, useEffect, useState } from "react";
import { MenuLink, getMenu } from "../../data/menu";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import SideMenu from "./SideMenu";
import { getImageUrl, getFilterList } from "../../data/utils";
import { useHistory } from "react-router";
import "../../components/main.css";

import { closeMainMenu } from "../../pages/MainHeader";

interface MainMenuProps {
  isWideScreen?: boolean;
  currentUser?: any;
  currentAccount?: any;
  pageTitle?: string;
}

const MainMenu: React.FC<MainMenuProps> = (props) => {
  const [filteredLinks, setFilteredLinks] = useState<MenuLink[]>([]);
  const history = useHistory();
  const filteredList = getFilterList();
  const { isWideScreen, currentUser, currentAccount, pageTitle } = props;
  const filterList = useCallback(() => {
    return getFilterList(currentUser, currentAccount);
  }, [currentUser, currentAccount]);

  useEffect(() => {
    const filtered = filterList();
    setFilteredLinks(filtered);
    console.log("filtered", filtered);
  }, [filterList]);

  const setUpMenu = useCallback(() => {
    // const links = getMenu();
    setFilteredLinks(filteredList ?? []);
  }, []);

  useEffect(() => {
    setUpMenu();
    console.log("MainMenu useEffect", isWideScreen);
  }, [setUpMenu]);

  const goToDashboard = () => {
    closeMainMenu();
    history.push("/home");
  };

  return (
    <>
      <SideMenu
        filteredLinks={filteredLinks}
        currentUser={currentUser}
        goToDashboard={goToDashboard}
      />
    </>
  );
};

export default MainMenu;
