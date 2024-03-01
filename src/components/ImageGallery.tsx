import React, { useEffect, useState, useRef } from 'react';
import { Image, ImageGalleryProps, getImages } from '../data/images';
import { IonCol, IonGrid, IonRow, IonImg, IonInput, IonButton, IonIcon } from '@ionic/react';
import {
    playCircleOutline,
    trashBinOutline
} from 'ionicons/icons';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

import '../index.css'
// import TTS from 'cordova-plugin-tts';
import { image } from 'ionicons/icons';
import { useHistory } from 'react-router';
import ActionList from './ActionList';
import { removeImageFromBoard } from '../data/boards';
import { set } from 'react-hook-form';
const ImageGallery: React.FC<ImageGalleryProps> = ({ images, boardId }) => {
    const gridRef = useRef(null); // Ref for the grid container
    const [audioList, setAudioList] = useState<string[]>([]);
    const inputRef = useRef<HTMLIonInputElement>(null);
    const [showIcon, setShowIcon] = useState(false);
    const [imageId, setImageId] = useState<string>('');

    const resizeGrid = () => {
        const currentGrid = gridRef.current ? gridRef.current as HTMLElement : null;

        if (currentGrid) {
            const imagesCount = currentGrid.children.length || 0;
            const sqrt = Math.sqrt(imagesCount);
            const rows = Math.ceil(sqrt);
            let cols = Math.round(sqrt);

            const adjustedHeight = `calc(100vh - 115px - 32px)`;
            const adjustedWidth = `calc(100vw - 32px)`;

            currentGrid.style.width = adjustedWidth;
            currentGrid.style.height = adjustedHeight;
            currentGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
            currentGrid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;
        } else {
            console.error('Grid container not found');
        }
    }

    const handleImageClick = (image: Image) => {
        const audioSrc = image.audio;

        console.log('handleImageClick', image);
        const label = image.label;
        if (inputRef.current) {
            inputRef.current.value += ` ${label}`
        }
        if (inputRef.current?.value) {
            setShowIcon(true);
        } else {
            setShowIcon(false);
        }
        if (!audioSrc) {
            speak(label);
            return;
        }
        setAudioList([...audioList, audioSrc as string]);
        const audio = new Audio(audioSrc);
        audio.play();
    };

    const speak = async (text: string) => {
        await TextToSpeech.speak({
            text: text,
            lang: 'en-US',
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0,
            category: 'ambient',
        });
    };

    const clearInput = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        setShowIcon(false);
    }

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        console.log('handleTouchStart', e);
    }

    const history = useHistory();
  const [showActionList, setShowActionList] = useState<boolean>(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleButtonPress = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    const imageId = (event.target as HTMLDivElement).id;

    // setImageId(imageId);
    console.log("Set Image ID", imageId);
    longPressTimer.current = setTimeout(() => {
      setShowActionList(true); // Show the action list on long press
      console.log('Long press detected');
      console.log('Image ID', imageId);
    }, 800); // 500 milliseconds threshold for long press
  };

  const handleButtonRelease = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current); // Cancel the timer if the button is released before the threshold
      longPressTimer.current = null;
    }
  };

  const handleActionSelected = (action: string) => {
    console.log(`Action selected: ${action}`);
    console.log('Image ID', imageId);
    console.log('Board ID', boardId);
    if (action === 'delete') {
        if (!boardId) {
            console.error('Board ID is missing');
            return;
        }
        const result = remove(imageId, boardId);
        console.log('Action', result);
        window.location.reload();
    } else if (action === 'edit') {
      history.push(`/images/${imageId}/edit`);
    }
    setShowActionList(false);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    console.log('handlePointerDown', event);
    const imageId = (event.target as HTMLDivElement).id;
    if (!imageId) {
      console.error('Image ID is missing');
      return;
    }
    setImageId(imageId);
    console.log('handlePointerDown Image ID', imageId);
  }

  const remove = async (imageId: string, boardId: string) => {
    const result = await removeImageFromBoard(boardId, imageId);
    console.log('Remove Image from Board', result);
    return result;
    };

    // Resize grid on mount and when images state changes
    useEffect(() => {
        resizeGrid();
        // Add window resize event listener to adjust grid on viewport change
        window.addEventListener('resize', resizeGrid);
        return () => window.removeEventListener('resize', resizeGrid);
    }, [images]);

    return (
        <div>
            <IonInput placeholder="" ref={inputRef} readonly={true}>
            </IonInput>
            <div className="flex justify-between">
                {showIcon &&
                    <IonButton size="small" onClick={() => speak(inputRef.current?.value as string)}><IonIcon slot="icon-only"
                        icon={playCircleOutline} onClick={() => speak(inputRef.current?.value as string)}></IonIcon> </IonButton>
                }
                {showIcon &&
                    <IonButton size="small" onClick={() => clearInput()}><IonIcon slot="icon-only" icon={trashBinOutline} onClick={() => clearInput()}></IonIcon></IonButton>

                }
            </div>
            <div className="my-auto mx-auto h-[calc(100vh-60px-32px)] w-[calc(100vw-32px)] overflow-hidden grid grid-cols-1 gap-1" ref={gridRef}>
                {images.map((image, i) => (
                    <div className='flex relative w-full hover:cursor-pointer text-center' onClick={() => handleImageClick(image)} key={image.id}
                        onTouchStart={(e) => handleButtonPress(e)}
                        onPointerDown={(e) => handlePointerDown(e)}
                        onTouchEnd={(e) => handleButtonRelease(e) }
                        onMouseDown={(e) => handleButtonPress(e)} // For desktop
                        onMouseUp={handleButtonRelease} // For desktop
                        onMouseLeave={handleButtonRelease} // Cancel on mouse leave to handle edge cases
                    >
                        <IonImg id={image.id} src={image.src} alt={image.label} className="absolute object-contain w-full h-full top-0 left-0" />
                        <span className="font-medium text-xs md:text-sm lg:text-md rounded bg-white bg-opacity-90 overflow-hidden absolute bottom-0 left-0 right-0 p-0 text-black">
                            {image.label}
                            <audio>
                                <source src={image.audio} type="audio/aac" />
                            </audio>
                        </span>
                    <ActionList
                        isOpen={showActionList}
                        onClose={() => setShowActionList(false)}
                        onActionSelected={(action: string) => handleActionSelected(action)}
                    />
                                        </div>

                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
