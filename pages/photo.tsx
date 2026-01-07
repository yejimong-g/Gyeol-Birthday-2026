import React, { useCallback, useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Bar from "../components/Bar";
import { storage, firestore } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, orderBy, getDocs } from "firebase/firestore";

const Photo = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  // Capture and upload photo
  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setImgSrc(imageSrc);

    // Convert base64 to blob
    const blob = await (await fetch(imageSrc)).blob();
    const photoRef = ref(storage, `photos/${Date.now()}.jpg`);

    // Upload to Firebase Storage
    await uploadBytes(photoRef, blob);

    // Get download URL
    const url = await getDownloadURL(photoRef);

    // Save URL to Firestore
    await addDoc(collection(firestore, "photos"), {
      url,
      createdAt: new Date(),
    });

    // Update gallery instantly
    setPhotos(prev => [url, ...prev]);
  }, []);

  // Fetch gallery photos on load
  useEffect(() => {
    const fetchPhotos = async () => {
      const q = query(collection(firestore, "photos"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const urls = snapshot.docs.map(doc => (doc.data() as any).url);
      setPhotos(urls);
    };
    fetchPhotos();
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
          <img src={imgSrc} />
          <span className="font-kangwon-bold text-xl pt-4">
            2026. 01. 08. 결이 생일 기념🎉
          </span>
        </div>
      )}

      <div className="gallery px-4 py-10">
        <h2 className="text-2xl font-bold pb-4">📸 Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`photo-${i}`}
              className="w-full h-auto rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Photo;
