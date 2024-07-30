import { Board, createBoard } from "../../data/boards";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewDidLeave,
} from "@ionic/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { arrowBackCircleOutline } from "ionicons/icons";
import React, { useEffect, useRef } from "react";
import MainMenu from "../../components/main_menu/MainMenu";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { denyAccess } from "../../data/users";
import BoardForm from "../../components/boards/BoardForm";

const NewBoard: React.FC = (props: any) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Board>();
  const onSubmit: SubmitHandler<Board> = (data) => {
    createBoard(data);
    props.history.push("/boards");
    window.location.reload();
  };
  const scenarioBtnRef = useRef<HTMLIonButtonElement>(null);
  const scratchFormRef = useRef<HTMLFormElement>(null);
  const scratchBtnRef = useRef<HTMLIonButtonElement>(null);

  const { currentUser } = useCurrentUser();

  const handleCreateFromScratch = () => {
    scratchBtnRef.current?.classList.toggle("hidden");
    scratchFormRef.current?.classList.toggle("hidden");
    scenarioBtnRef.current?.classList.toggle("hidden");
  };

  useIonViewDidLeave(() => {
    scratchBtnRef.current?.classList.remove("hidden");
    scratchFormRef.current?.classList.add("hidden");
    scenarioBtnRef.current?.classList.remove("hidden");
  });

  useEffect(() => {
    scratchFormRef.current?.classList.add("hidden");
  }, []);

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton routerLink="/boards">
                <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>New Board</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen scrollY={true}>
          <div className="w-1/2 mx-auto h-1/4 grid grid-rows-2 gap-8 mt-10">
            <IonButton
              className=""
              expand="block"
              onClick={handleCreateFromScratch}
              ref={scratchBtnRef}
            >
              <span className="font-bold text-lg block">
                Create from scratch
              </span>
            </IonButton>
            <form
              className="hidden"
              onSubmit={handleSubmit(onSubmit)}
              ref={scratchFormRef}
            >
              <IonInput
                aria-label="Name"
                placeholder="Name"
                defaultValue=""
                {...register("name", { required: true })}
              />
              <IonButton className="" type="submit" expand="block">
                Create
              </IonButton>
            </form>
            {/* <BoardForm board={board} setBoard={setBoard} onSubmit={loadPage} /> */}

            <IonButton
              routerLink="/scenarios/new"
              expand="block"
              ref={scenarioBtnRef}
              color={denyAccess(currentUser) ? "danger" : "primary"}
              disabled={denyAccess(currentUser)}
            >
              <div className="text-md font-md">
                {!denyAccess(currentUser) ? (
                  "Create from scenario"
                ) : (
                  <>
                    <span className="font-bold text-lg block">
                      Free Trial Expired{" "}
                    </span>
                    You need to upgrade to create from scenario
                  </>
                )}
              </div>
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default NewBoard;
