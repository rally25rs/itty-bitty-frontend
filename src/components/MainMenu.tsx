import { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonList, IonMenu, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import { MenuLink, getMenu } from '../data/menu';
import MenuListItem from './MenuListItem';
import { isUserSignedIn } from '../data/users';
function MainMenu() {
  const [menuLinks, setMenuLinks] = useState<MenuLink[]>([]);

  const filterList = () => {
    const filteredList: MenuLink[] = [];
    menuLinks.forEach((link) => {
      if (isUserSignedIn()) {
        if (link.slug !== 'sign-up' && link.slug !== 'sign-in') {
          filteredList.push(link)
        }
      } else {
        if (link.slug !== 'dashboard' && link.slug !== 'sign-out') {
          filteredList.push(link)
        }
      }

    })
    return filteredList
  }

  const [filteredLinks, setFilteredLinks] = useState<MenuLink[]>([]);

  useIonViewWillEnter(() => {
    const links = getMenu();
    setMenuLinks(links);
    const filteredList = filterList();
    setFilteredLinks(filteredList);
  }, []);

  useEffect(() => {
    const filteredList = filterList();
    setFilteredLinks(filteredList);
  }, [menuLinks]);

  return (
    <>
      <IonMenu contentId="main-content" type="overlay">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Main Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>

            {filteredLinks.map(m => (

              <MenuListItem key={m.id} menuLink={m} />
            ))}
          </IonList>
        </IonContent>
      </IonMenu>
    </>
  );
}
export default MainMenu;