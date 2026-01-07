import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Bar from "../components/Bar";
import { storage, ref, uploadBytes, getDownloadURL, listAll } from "../lib/firebase";

const Photo = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);

  // Upload photo to Firebase
  const uploadPhoto = async (base64: string) => {
    const blob = await (await fetch(base64)).blob();
    const photoRef = ref(storage, `photos/${Date.now()}.jpg`);
    await uploadBytes(photoRef, blob);
  };

  // Capture photo
  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setImgSrc(imageSrc);
    await uploadPhoto(imageSrc);

    // Refresh gallery after upload
    loadGallery();
  }, [webcamRef]);

  // Load all photos from Firebase
  const loadGallery = async () => {
    const photosRef = ref(storage, "photos/");
    const res = await listAll(photosRef);
    const urls = await Promise.all(res.items.map(item => getDownloadURL(item)));
    setGallery(urls.reverse()); // newest first
  };

  // Load gallery on page load
  useEffect(() => {
    loadGallery();
  }, []);

  return (
    <div className="wrapper">
      <span className="title py-20">📷 Photo</span>
      <Bar />
      <div className="py-10 flex flex-col items-center space-y-4">
        <span className="font-kangwon-bold text-lg">
          생일 기념 사진을 찍어보세요! (사진은 우클릭으로 저장 가능합니다.)
        </span>
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        <button
          className="w-[150px] h-[70px] bg-purple1 rounded-xl text-white text-2xl font-kangwon-bold"
          onClick={capture}
        >
          📷 찰칵!
        </button>
      </div>

      {imgSrc && (
        <div className="px-4 bg-white flex flex-col items-center pt-4 pb-16">
          <img src={imgSrc} alt="Captured" />
          <span className="font-kangwon-bold text-xl pt-4">
            2026. 01. 08. 결이 생일 기념🎉
          </span>
        </div>
      )}

      <div className="gallery px-4 py-10">
        <h2 className="font-kangwon-bold text-2xl mb-4">🎉 Gallery</h2>
        <div className="grid grid-cols-3 gap-4">
          {gallery.map((url, i) => (
            <img key={i} src={url} alt={`Photo ${i}`} className="w-full h-auto rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Photo;
