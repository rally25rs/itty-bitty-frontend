import React, { useState, useEffect } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
  IonSpinner,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import { getChildAccount, ChildAccount } from "../../data/child_accounts"; // Adjust imports based on actual functions
import { Board } from "../../data/boards";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  gridOutline,
  peopleCircleOutline,
  mailOutline,
  addCircleOutline,
} from "ionicons/icons";
import BoardGrid from "../../components/boards/BoardGrid";
import ChildBoardDropdown from "../../components/boards/ChildBoardDropdown";
import MainMenu from "../../components/main_menu/MainMenu";
import ChildAccountForm from "../../components/childAccounts/ChildAccountForm";

const ViewChildAccountScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [childAccount, setChildAccount] = useState<ChildAccount | undefined>(
    undefined
  );
  const [segmentType, setSegmentType] = useState("childAccountTab");
  const [boards, setBoards] = useState<Board[]>([]);
  const [userBoards, setUserBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { currentUser } = useCurrentUser();

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
    // const fetchedBoards = await getBoards(currentUser?.id);
    const fetchedBoards = currentUser?.boards;
    if (!fetchedBoards) {
      console.error("Error fetching boards");
      return;
    }
    setUserBoards(fetchedBoards);
  };

  useEffect(() => {
    fetchChildAccount();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchChildAccount();
    }
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
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/child-accounts" />
            </IonButtons>
            <IonTitle>{childAccount?.name}</IonTitle>
          </IonToolbar>
          <IonToolbar>
            {childAccount && (
              <IonSegment
                value={segmentType}
                onIonChange={handleSegmentChange}
                className="w-full bg-inherit"
              >
                <IonSegmentButton value="childAccountTab">
                  <IonLabel className="text-xl">
                    <IonIcon
                      icon={peopleCircleOutline}
                      className="text-2xl mt-3 mb-2"
                    />
                  </IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="boardTab">
                  <IonLabel className="text-xl">
                    <IonIcon icon={gridOutline} />
                  </IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="newAccountTab">
                  <IonLabel className="text-xl">
                    <IonIcon
                      icon={addCircleOutline}
                      className="text-2xl mt-3 mb-2"
                    />
                  </IonLabel>
                </IonSegmentButton>
              </IonSegment>
            )}
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" scrollY={true}>
          {segmentType === "childAccountTab" && (
            <div>
              {childAccount && (
                <div>
                  <IonList>
                    <div>
                      <IonLabel>Child's Name</IonLabel>
                      <IonText>
                        {childAccount.name || childAccount.username}
                      </IonText>
                    </div>
                    <div>
                      <IonLabel>Account Boards</IonLabel>
                      <IonText>
                        {childAccount.boards?.map((board) => (
                          <div key={board.id}>{board.name}</div>
                        ))}
                      </IonText>
                    </div>
                    <div>
                      <IonLabel># of ChildAccount Boards</IonLabel>
                      <IonText>{childAccount.boards?.length}</IonText>
                    </div>
                  </IonList>
                </div>
              )}
            </div>
          )}
          {segmentType === "boardTab" && (
            <div>
              <div>
                <IonLabel>Boards</IonLabel>
                {childAccount?.boards && (
                  <BoardGrid boards={childAccount.boards} />
                )}
              </div>
            </div>
          )}
          {segmentType === "newAccountTab" && (
            <div className="p-4">
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
        </IonContent>
      </IonPage>
    </>
  );
};

export default ViewChildAccountScreen;
