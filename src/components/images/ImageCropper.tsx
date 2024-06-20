import React, { useRef, useState, useEffect } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonInput,
  IonLabel,
  IonLoading,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { createImage, cropImage, findOrCreateImage } from "../../data/images";
import { useHistory } from "react-router";
import ImagePasteHandler from "../utils/ImagePasteHandler";

interface ImageCropperProps {
  // onSubmit: (data: {
  //   label: string;
  //   croppedImage: string;
  //   fileExtension: string;
  // }) => void;
  existingId?: string;
  boardId?: string | null;
  existingLabel?: string | null;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  existingId,
  existingLabel,
}) => {
  const imageElementRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const history = useHistory();
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [cropper, setCropper] = useState<Cropper>();
  const [label, setLabel] = useState<string>("");
  const [fileExtension, setFileExtension] = useState<string>("");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileExtension = file.name.split(".").pop() || "";
      setFileExtension(fileExtension);
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const dataUrl = event.target!.result as string;
        setImageSrc(dataUrl);

        // Create an image to measure dimensions
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
        };
        img.src = dataUrl;
      };

      reader.readAsDataURL(file);
    }
  };

  const handlePastedFile = (file: File) => {
    const fileExtension = file.name.split(".").pop() || "";
    setFileExtension(fileExtension);
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const dataUrl = event.target!.result as string;
      setImageSrc(dataUrl);

      // Create an image to measure dimensions
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  }

  const handleCancel = () => {
    setImageSrc(null);
    setLabel("");
    
  }

  useEffect(() => {
    if (imageSrc && imageElementRef.current) {
      const cropperInstance = new Cropper(imageElementRef.current, {
        aspectRatio: 1,
        viewMode: 1,
        responsive: true,
      });
      setCropper(cropperInstance);
      return () => {
        cropperInstance.destroy();
      };
    }
  }, [imageSrc]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (cropper) {
      const croppedImage = cropper.getCroppedCanvas().toDataURL();
      handleFormSubmit({ croppedImage, fileExtension });
    } else {
      if (label) {
        const formData = new FormData();
        formData.append("image[label]", label);
        
        const result = await findOrCreateImage(formData, false);

      }
    }
  };

  const handleFormSubmit = async (data: {
    croppedImage: string;
    fileExtension: string;
  }) => {
    setShowLoading(true);
    const formData = new FormData();
    const strippedImage = data.croppedImage.replace(
      /^data:image\/[a-z]+;base64,/,
      ""
    );

    formData.append("cropped_image", strippedImage);
    formData.append("file_extension", data.fileExtension);
    if (existingId && existingLabel) {
      formData.append("image[id]", existingId);
      formData.append("image[label]", existingLabel);
    } else {
      formData.append("image[label]", label);
    }
    const labeToSendl = formData.get("image[label]");
    if (!labeToSendl) {
      alert("Please provide a label for the image.");
      setShowLoading(false);
      return;
    }

    const result = await cropImage(formData);
    setShowLoading(false);

    if (result && result.id) {
      history.replace(`/images/${result.id}`);
    } else {
      console.error("Error:", result.error);
      alert("An error occurred. Please try again.");
    }
  };
  
  useIonViewWillLeave(() => {
    imageElementRef.current?.removeAttribute("src");
    if (imageSrc) {
      setImageSrc(null);
    }
    if (label) {
      setLabel("");
    }
  } );

  return (
    <div className="w-full md:w-1/2 lg:w-1/2 mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <IonCard className="p-4 m-4 border">
          {!existingId ? (
            <IonInput
              value={label}
              label="Image Label"
              labelPlacement="stacked"
              required
              onIonChange={(e) => setLabel(e.detail.value!)}
              className="p-2 border border-gray-300 rounded my-2 pl-2"
            />
          ) : null}

          <input
            type="file"
            id="file_field"
            accept="image/*"
            onChange={onFileChange}
          />
        </IonCard>
        <ImagePasteHandler setFile={handlePastedFile} />
        {imageSrc && (
          <>
            <img
              ref={imageElementRef}
              src={imageSrc}
              alt="Source"
              style={{ display: "none" }}
            />
            <div className="mt-4">
              <p className="text-center">Select the area to crop</p>
            </div>
          </>
        )}
        <IonButtons>
        <IonButton
          type="submit"
          className="mt-4"
          color="secondary"
          expand="block"
        >
          Submit
        </IonButton>
        <IonButton
          onClick={handleCancel}
          className="mt-4"
          color="danger"
          expand="block"  
        >
          Cancel
        </IonButton>
        </IonButtons>
      </form>
      <IonLoading isOpen={showLoading} message="Uploading..." />
    </div>
  );
};

export default ImageCropper;
