import {
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  useIonViewWillEnter,
} from "@ionic/react";
import "../../components/main.css";
import MainMenu from "../../components/main_menu/MainMenu";
import Tabs from "../../components/utils/Tabs";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useState, useEffect } from "react";
import { WordEvent } from "../../data/word_event";
import MainHeader, { closeMainMenu } from "../MainHeader";
import { ChildBoard, getCurrentChildBoards } from "../../data/child_boards";
import StaticMenu from "../../components/main_menu/StaticMenu";
import ChildBoardGrid from "../../components/childBoards/ChildBoardGrid";
interface DashboardProps {
  userType?: string;
}
const AccountDashboard: React.FC<DashboardProps> = () => {
  const { isWideScreen, currentUser, currentAccount } = useCurrentUser();

  const [childBoards, setChildBoards] = useState<ChildBoard[]>([]);
  const [wordEvents, setWordEvents] = useState<WordEvent[]>([]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };
  const [loading, setLoading] = useState(false);

  // };
  const loadChildBoards = async () => {
    let boards: ChildBoard[] = await getCurrentChildBoards();
    if (currentAccount && currentAccount?.id) {
      // return;
    } else {
      console.error("No current account");
    }

    console.log("Child Boards", boards);
    setChildBoards(boards);
  };

  useIonViewWillEnter(() => {
    closeMainMenu();
  }, []);

  useEffect(() => {
    loadChildBoards();

    // loadWordEvents();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      loadChildBoards();
    }, 3000);
  }, [currentAccount]);

  return (
    <>
      <MainMenu
        pageTitle=" Child Dashboard"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Child Dashboard"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Child Dashboard"
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
        />
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          <div className="">
            {currentAccount && (
              <>
                <h2 className="text-xl font-semibold">
                  {currentAccount?.name || currentAccount?.username}'s Dashboard
                  🚀
                </h2>
                <div className="flex flex-col">
                  <div className="m-1">
                    {childBoards && childBoards.length > 0 && (
                      <ChildBoardGrid
                        child_boards={childBoards}
                        gridType={"child"}
                      />
                    )}
                  </div>
                </div>
              </>
            )}

            {loading && <IonSpinner />}
          </div>
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default AccountDashboard;
