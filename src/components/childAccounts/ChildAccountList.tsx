import { useState } from "react";
import { ChildAccount } from "../../data/child_accounts";
import { IonList, IonButton, IonItem, IonText, IonCard } from "@ionic/react";
import ChildAccountListItem from "./ChildAccountListItem";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface ChildAccountListProps {
  childAccounts: ChildAccount[];
}
const ChildAccountList = ({ childAccounts }: ChildAccountListProps) => {
  const [childAccountId, setChildAccountId] = useState<string>("");
  const { currentUser } = useCurrentUser();

  const handleChildAccountClick = (childAccount: ChildAccount) => {
    setChildAccountId(childAccount.id as unknown as string);
  };

  const shouldDisableActionList = (childAccount: ChildAccount) => {
    return false;
  };

  return (
    <div className="ion-padding">
      <IonList className="w-full" id="childAccount-list" lines="inset">
        {childAccounts &&
          childAccounts.map((childAccount, i) => (
            <IonItem key={i}>
              <div
                id={Number(childAccount.id).toString()}
                className="rounded-md flex relative w-full hover:cursor-pointer text-center"
                onClick={() => handleChildAccountClick(childAccount)}
                key={childAccount.id}
              >
                <ChildAccountListItem
                  childAccount={childAccount}
                  disableActionList={shouldDisableActionList(childAccount)}
                />
              </div>
            </IonItem>
          ))}
        {currentUser && childAccounts?.length === 0 && (
          <IonCard className="p-4 w-full md:w-1/2 mx-auto">
            <div className="text-center">
              <p>No Accounts found</p>
              <IonButton routerLink="/child-accounts/new" color="primary">
                Create a new childAccount
              </IonButton>
            </div>
          </IonCard>
        )}
      </IonList>
    </div>
  );
};

export default ChildAccountList;
