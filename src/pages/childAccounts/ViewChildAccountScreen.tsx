import React, { useState, useEffect } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonLabel,
  IonItem,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import { getChildAccount, ChildAccount } from "../../data/child_accounts"; // Adjust imports based on actual functions
import { Board } from "../../data/boards";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  gridOutline,
  peopleCircleOutline,
  addCircleOutline,
  createOutline,
  barChartOutline,
} from "ionicons/icons";
import BoardGrid from "../../components/boards/BoardGrid";
import ChildBoardDropdown from "../../components/childBoards/ChildBoardDropdown";
import MainMenu from "../../components/main_menu/MainMenu";
import ChildAccountForm from "../../components/childAccounts/ChildAccountForm";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";
import Tabs from "../../components/utils/Tabs";
import WordCloudChart from "../../components/utils/WordCloudChart";
import { WordEvent, fetchWordEventsByAccountId } from "../../data/word_event";
import WordNetworkGraph from "../../components/utils/WordNetworkGraph";

const ViewChildAccountScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [childAccount, setChildAccount] = useState<ChildAccount | undefined>(
    undefined
  );
  const [segmentType, setSegmentType] = useState("childAccountTab");
  const [boards, setBoards] = useState<Board[]>([]);
  const [userBoards, setUserBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [wordEvents, setWordEvents] = useState<WordEvent[]>([]);
  const { currentUser, currentAccount, isWideScreen } = useCurrentUser();

  const fetchChildAccount = async () => {
    if (!currentUser?.id) {
      console.error("No current user");
      setLoading(false);
      return;
    }
    if (id === "new") {
      setLoading(false);
      setSegmentType("newAccountTab");
      return;
    }
    const childAccountToSet = await getChildAccount(Number(id), currentUser.id);

    if (!childAccountToSet) {
      console.error("Error fetching childAccount");
      setLoading(false);
      return;
    }
    setChildAccount(childAccountToSet);
    if (childAccountToSet?.boards) {
      console.log("childAccountToSet.boards", childAccountToSet.boards);
      setBoards(childAccountToSet.boards);
    }
    const userBoards = currentUser.boards;
    if (!userBoards) {
      console.error("Error fetching boards ");
      return;
    }
    setUserBoards(userBoards);
    setLoading(false);
  };

  const fetchUserBoards = async () => {
    const fetchedBoards = currentUser?.boards;
    setUserBoards(fetchedBoards || []);
    console.log("fetchedUserBoards", fetchedBoards);
    if (!fetchedBoards) {
      console.error("Error fetching boards");
      return;
    }
    setUserBoards(fetchedBoards);
  };

  const loadWordEvents = async () => {
    setLoading(true);
    if (!currentUser) {
      setLoading(false);
      console.log("No current user");
      return;
    }
    let events: WordEvent[] = [];

    events = await fetchWordEventsByAccountId(Number(id));
    setLoading(false);
    setWordEvents(events);
  };

  useEffect(() => {
    fetchChildAccount();
    fetchUserBoards();
    loadWordEvents();
  }, []);
  useEffect(() => {
    fetchChildAccount();
    fetchUserBoards();
    loadWordEvents();
  }, [currentUser]);

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
  };

  if (loading) {
    return (
      <>
        <MainMenu />
        <IonPage id="main-content">
          <IonHeader className="bg-inherit shadow-none">
            <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton defaultHref="/child-accounts" />
              </IonButtons>
              <IonTitle>Loading...</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding" scrollY={true}>
            <IonSpinner />
          </IonContent>
        </IonPage>
      </>
    );
  }

  return (
    <>
      <MainMenu
        pageTitle="Accounts"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Accounts"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Accounts"
          isWideScreen={isWideScreen}
          startLink="/child-accounts"
        />

        <IonContent className="ion-padding" scrollY={true}>
          {childAccount && (
            <IonSegment
              value={segmentType}
              onIonChange={handleSegmentChange}
              className="w-full bg-inherit"
            >
              <IonSegmentButton value="gallery">
                <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                  Stats
                </IonLabel>
                <IonIcon className="mt-2" icon={barChartOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="childAccountTab">
                <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                  Account
                </IonLabel>
                <IonIcon className="mt-2" icon={peopleCircleOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="boardTab">
                <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                  Boards
                </IonLabel>
                <IonIcon className="mt-2" icon={gridOutline} />
              </IonSegmentButton>
              <IonSegmentButton value="newAccountTab">
                <IonLabel className="text-sm md:text-md lg:text-lg mb-2">
                  Edit
                </IonLabel>
                <IonIcon
                  className="mt-2"
                  icon={childAccount ? createOutline : addCircleOutline}
                />
              </IonSegmentButton>
            </IonSegment>
          )}
          {segmentType === "childAccountTab" && (
            <div className="mt-4">
              <h1 className="text-2xl text-center">
                {childAccount?.name || childAccount?.username}'s Account
              </h1>
              {childAccount && (
                <div className="w-full md:w-2/3 mx-auto">
                  <IonList>
                    <IonItem className="flex justify-between">
                      <IonLabel className="text-2xl"> Name</IonLabel>
                      <IonText>{childAccount.name}</IonText>
                    </IonItem>
                    <IonItem className="flex justify-between">
                      <IonLabel className="text-2xl"> Username</IonLabel>
                      <IonText>{childAccount.username}</IonText>
                    </IonItem>
                    <IonItem>
                      <IonLabel># of Boards</IonLabel>
                      <IonText>{childAccount.boards?.length}</IonText>
                    </IonItem>
                    <div className="flex justify-center">
                      <h1 className="text-lg md:text-xl text-center">
                        Select which boards this account can access
                      </h1>
                    </div>
                    <ChildBoardDropdown
                      childAccount={childAccount}
                      boards={userBoards}
                      onSuccess={fetchChildAccount}
                    />
                  </IonList>
                </div>
              )}
            </div>
          )}
          {segmentType === "boardTab" && (
            <div className="mt-4">
              <h1 className="text-2xl text-center">Boards</h1>
              <BoardGrid boards={boards} gridType="child" />
            </div>
          )}
          {segmentType === "newAccountTab" && (
            <div className="p-4 text-center">
              {childAccount ? (
                <h1 className="text-2xl">Edit child account</h1>
              ) : (
                <>
                  <h1 className="text-2xl">Create a new child account</h1>
                  <p className="text-sm mt-2">
                    Create child accounts to allow your children to use
                    SpeakAnyWay in a way that's safe and secure.
                  </p>
                </>
              )}

              {currentUser && (
                <ChildAccountForm
                  currentUser={currentUser}
                  existingChildAccount={childAccount}
                />
              )}
            </div>
          )}
          {segmentType === "gallery" && (
            <div className="ion-padding border">
              <div className="flex justify-between">
                <div className="text-2xl text-gray-500">
                  🚧 BETA Features 🚧 <br></br>{" "}
                  <span className="text-md font-bold">Under Construction</span>
                  <br></br>{" "}
                  <p className="text-sm">Word Events & Word Relationships</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl">What are Word Events?</p>
                  <p className="text-md">
                    Word Events are a collection of words that are spoken by
                    users. <br></br>They are used to generate Word Clouds and
                    Word Relationships. <br></br>
                  </p>
                </div>
                <IonButtons slot="end">
                  <IonButton
                    onClick={loadWordEvents}
                    className="mt-4"
                    color="primary"
                    fill="outline"
                  >
                    Refresh
                  </IonButton>
                </IonButtons>
              </div>
              {loading && <IonSpinner />}
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                <div className="border ion-padding overflow-hidden">
                  <h1 className="text-2xl mt-4">Word Usage Cloud</h1>
                  <WordCloudChart wordEvents={wordEvents} />
                </div>

                <div className="border ion-padding">
                  <h1 className="text-2xl mt-4">Word Relationships </h1>

                  <WordNetworkGraph wordEvents={wordEvents} />
                </div>
              </div>
            </div>
          )}
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default ViewChildAccountScreen;
