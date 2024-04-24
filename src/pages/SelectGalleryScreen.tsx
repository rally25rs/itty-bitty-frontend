import React, { useState, useEffect, useRef } from "react";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import {
  arrowBackCircleOutline,
  cloudUploadOutline,
  createOutline,
  imagesOutline,
  refreshCircleOutline,
  toggle,
} from "ionicons/icons";
import {
  getBoard,
  addImageToBoard,
  Board,
  getRemainingImages,
  saveLayout,
} from "../data/boards"; // Adjust imports based on actual functions
import FileUploadForm from "../components/FileUploadForm";
import { generateImage, getMoreImages } from "../data/images";
import { Image } from "../data/images";
import BoardForm from "../components/BoardForm";
import SelectImageGallery from "../components/SelectImageGallery";
import ImageGalleryItem from "../components/ImageGalleryItem";
import "./ViewBoard.css";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Tabs from "../components/Tabs";
import DraggableGrid from "../components/DraggableGrid";

interface SelectGalleryScreenProps {}
const SelectGalleryScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const boardGrid = useRef<HTMLDivElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState("edit");
  const uploadForm = useRef<HTMLDivElement>(null);
  const generateForm = useRef<HTMLDivElement>(null);
  const editForm = useRef<HTMLDivElement>(null);
  const [remainingImages, setRemainingImages] = useState<Image[]>(); // State for the remaining images
  const [searchInput, setSearchInput] = useState("");
  const imageGalleryWrapper = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const history = useHistory();
  const [toastMessage, setToastMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Generating Image...");
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [gridLayout, setGridLayout] = useState([]);
  const initialImage = {
    id: "",
    src: "",
    label: "",
    image_prompt: "",
    audio: "",
    bg_color: "",
    layout: [],
  };
  const [image, setImage] = useState<Image | null>(initialImage);
  const checkCurrentUserTokens = (numberOfTokens: number = 1) => {
    if (
      currentUser &&
      currentUser.tokens &&
      currentUser.tokens >= numberOfTokens
    ) {
      return true;
    }
    return false;
  };

  const fetchBoard = async () => {
    const board = await getBoard(id); // Ensure getBoard is typed to return a Promise<Board>
    console.log("fetch board", board);
    setBoard(board);
    toggleForms(segmentType);
    const remainingImgs = await getRemainingImages(board.id, 1, searchInput);
    setRemainingImages(remainingImgs);
    return board;
  };

  const handleGetMoreImages = async (
    page: number,
    query: string
  ): Promise<Image[]> => {
    const additionalImages = await getMoreImages(page, query);
    setRemainingImages(additionalImages);
    return additionalImages;
  };

  const handleSearchInput = async (event: CustomEvent) => {
    const query = event.detail.value.toLowerCase();
    setSearchInput(query);
    setPage(1); // Reset to first page on new search
  };
  const loadPage = async () => {
    console.log("id", id);
    const boardToSet = await fetchBoard();
    setBoard(boardToSet);
    toggleForms(segmentType);
  };

  useIonViewWillEnter(() => {
    toggleForms("edit");
    setSearchInput("");
    setPage(1);
  });

  useEffect(() => {
    loadPage();
  }, []);

  const toggleForms = (segmentType: string) => {
    if (segmentType === "generate") {
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.remove("hidden");
      editForm.current?.classList.add("hidden");
      imageGalleryWrapper.current?.classList.add("hidden");
    }
    if (segmentType === "upload") {
      uploadForm.current?.classList.remove("hidden");
      generateForm.current?.classList.add("hidden");
      editForm.current?.classList.add("hidden");
      imageGalleryWrapper.current?.classList.add("hidden");
    }
    if (segmentType === "gallery") {
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.add("hidden");
      editForm.current?.classList.add("hidden");
      imageGalleryWrapper.current?.classList.remove("hidden");
    }

    if (segmentType === "edit") {
      uploadForm.current?.classList.add("hidden");
      generateForm.current?.classList.add("hidden");
      editForm.current?.classList.remove("hidden");
      imageGalleryWrapper.current?.classList.add("hidden");
    }
  };

  const handleGenerate = async () => {
    console.log("Generate Image", image);
    if (!checkCurrentUserTokens()) {
      alert(
        "Sorry, you do not have enough tokens to generate an image. Please purchase more tokens to continue."
      );
      console.error("User does not have enough tokens");
      return;
    }
    if (!image) {
      console.error("Image is missing");
      return;
    }
    const formData = new FormData();
    formData.append("image[label]", image.label);
    if (image.image_prompt) {
      formData.append("image[image_prompt]", image.image_prompt);
    }
    setShowLoading(true);
    const updatedImage = await generateImage(formData); // Ensure generateImage returns a Promise<Image>
    if (!board?.id) {
      console.error("Board ID is missing");
      return;
    }
    await addImageToBoard(board.id, updatedImage.id); // Ensure addImageToBoard returns a Promise<Board>
    setImage(initialImage);

    setShowLoading(false);
    const message = `Image added to board: ${updatedImage.label}`;
    setToastMessage(message);
    // history.push(`/boards/${board.id}`);
  };

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
    toggleForms(newSegment);
  };

  const handleImagePromptInput = (e: CustomEvent) => {
    const newPrompt = e.detail.value;
    if (image) {
      setImage({ ...image, image_prompt: newPrompt });
    }
  };

  const handleLabelInput = (e: CustomEvent) => {
    const newLabel = e.detail.value;
    if (image) {
      setImage({ ...image, label: newLabel });
    }
  };

  const setGrid = (layout: any) => {
    console.log("layout", layout);
    setGridLayout(layout);
  };

  const handleSaveLayout = async () => {
    if (!board?.id) {
      console.error("Board ID is missing");
      return;
    }
    const updatedBoard = await saveLayout(board.id, gridLayout);
    const message = "Board layout saved";
    setToastMessage(message);
    setIsOpen(true);
    setBoard(updatedBoard);
  };

  const handleImageClick = (image: Image) => {
    setImage(image);
    setShowLoading(true);
    async function addSelectedImageToBoard() {
      if (!board?.id) {
        console.error("Board ID is missing");
        return;
      }
      const response = await addImageToBoard(board.id, image.id);
      const message = `Image added to board: ${response["board"]["name"]}`;
      setToastMessage(message);
      setShowLoading(false);
      setIsOpen(true);
    }
    addSelectedImageToBoard();
  };

  return (
    <IonPage id="view-board-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton routerLink={`/boards/${board?.id}`}>
              <IonIcon slot="icon-only" icon={arrowBackCircleOutline} />
            </IonButton>
          </IonButtons>
          {board && <IonTitle>{board.name}</IonTitle>}
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={segmentType} onIonChange={handleSegmentChange}>
            <IonSegmentButton value="edit">
              <IonLabel className="text-xl">
                <IonIcon icon={createOutline} />
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="gallery">
              <IonLabel className="text-xl">
                <IonIcon icon={imagesOutline} />
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="upload">
              <IonLabel className="text-xl">
                <IonIcon icon={cloudUploadOutline} />
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="generate">
              <IonLabel className="text-xl">
                <IonIcon icon={refreshCircleOutline} />
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" scrollY={true}>
        <div className="ion-justify-content-center ion-align-items-center ion-text-center pt-1">
          <IonText className="font-bold text-2xl">
            {board && board.name}
          </IonText>
        </div>

        <div className="" ref={editForm}>
          <div className="mb-2">
            <IonText className="text-sm text-gray-500">
              Voice: {board?.voice}
            </IonText>
          </div>
          {board && <BoardForm board={board} setBoard={setBoard} />}
          <div className="mt-3">
            {board && board.images && board.images.length > 0 && (
              <div className="">
                <IonLabel className="font-sans text-sm">
                  There are currently {board.images.length} images in this
                  board. Click on an image to view it.
                </IonLabel>
                <IonButton
                  className="mt-5 block w-5/6 mx-auto text-lg"
                  onClick={handleSaveLayout}
                >
                  Save Layout
                </IonButton>
                <DraggableGrid
                  images={board.images}
                  columns={board.number_of_columns}
                  onLayoutChange={(layout: any) => setGrid(layout)}
                  disableActionList={true}
                />
              </div>
            )}
            {board && board.images && board.images.length < 1 && (
              <div className="text-center">
                <p>No images found</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 py-3 px-1 hidden text-center" ref={uploadForm}>
          <IonText className="text-lg">Upload your own image</IonText>
          {board && (
            <FileUploadForm
              board={board}
              onCloseModal={undefined}
              showLabel={true}
              existingLabel={image?.label}
            />
          )}
        </div>
        <div className="mt-2 hidden" ref={generateForm}>
          <IonList className="" lines="none">
            <IonItem className="my-2">
              <IonText className="font-bold text-xl mt-2">
                Generate an board with AI
              </IonText>
            </IonItem>

            <IonItem className="mt-2 border-2">
              {board && (
                <IonInput
                  className=""
                  aria-label="label"
                  value={image?.label}
                  placeholder="Enter label"
                  onIonInput={handleLabelInput}
                ></IonInput>
              )}
            </IonItem>
            <IonItem className="mt-2 border-2">
              <IonLoading
                className="loading-icon"
                cssClass="loading-icon"
                isOpen={showLoading}
                message={loadingMessage}
              />
              {board && (
                <IonTextarea
                  className=""
                  placeholder="Enter prompt"
                  onIonInput={handleImagePromptInput}
                ></IonTextarea>
              )}
            </IonItem>
            <IonItem className="mt-2">
              <IonButton className="w-full text-lg" onClick={handleGenerate}>
                Generate Image
              </IonButton>
            </IonItem>
            <IonItem className="mt-2 font-mono text-center">
              <IonText className="text-sm">
                This will generate an board based on the prompt you enter.
              </IonText>
            </IonItem>
            <IonItem className="mt-2 font-mono text-center text-red-400">
              <IonText className="ml-6"> It will cost 1 credit.</IonText>
            </IonItem>
          </IonList>
        </div>

        <div className="hidden" ref={imageGalleryWrapper}>
          <IonLabel className="font-sans text-sm">
            Search for images - Click to add to board
          </IonLabel>
          <IonSearchbar
            className="mt-2"
            onIonChange={handleSearchInput}
          ></IonSearchbar>
          {remainingImages && (
            <SelectImageGallery
              boardId={board?.id}
              onImageClick={handleImageClick}
              onLoadMoreImages={handleGetMoreImages}
              searchInput={searchInput}
              images={remainingImages}
            />
          )}
        </div>
        <IonToast
          isOpen={isOpen}
          message={toastMessage}
          onDidDismiss={() => setIsOpen(false)}
          duration={2000}
        ></IonToast>
      </IonContent>
      <Tabs />
    </IonPage>
  );
};

export default SelectGalleryScreen;
