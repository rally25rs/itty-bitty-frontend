import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ChildAccountList from "../../components/childAccounts/ChildAccountList";
import MainMenu from "../../components/main_menu/MainMenu";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
import { useEffect, useState } from "react";
// import { useHistory } from "react-router";
import { addCircleOutline } from "ionicons/icons";
const ChildAccountsScreen: React.FC = () => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  // const history = useHistory();
  const [childAccounts, setChildAccounts] = useState<any>([]);
  // const [pageTitle, setPageTitle] = useState("Your ChildAccounts");

  const fetchChildAccounts = async () => {
    if (!currentUser?.id) {
      console.error("No current user");
      return;
    }
    // const fetchedChildAccounts = await getChildAccounts(currentUser?.id);
    const fetchedChildAccounts = currentUser?.child_accounts;
    console.log("fetchedChildAccounts", fetchedChildAccounts);
    if (!fetchedChildAccounts) {
      console.error("Error fetching childAccounts");
      // return;
    }
    setChildAccounts(fetchedChildAccounts);
  };

  useEffect(() => {
    fetchChildAccounts();
  }, [currentUser]);
  useEffect(() => {
    fetchChildAccounts();
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      console.log("Async operation has ended");
      e.detail.complete();
    }, 3000);
  };

  return (
    <>
      <MainMenu />

      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>ChildAccounts</IonTitle>
            <IonButtons slot="end">
              <IonButton routerLink="/child-accounts/new">
                <IonIcon icon={addCircleOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <ChildAccountList childAccounts={childAccounts} />
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ChildAccountsScreen;
