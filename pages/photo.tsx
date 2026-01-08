import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Bar from "../components/Bar";

const CLOUDINARY_CLOUD_NAME = "yejimong-g";
const CLOUDINARY_UPLOAD_PRESET = "gyeol birthday gallery";

const Photo = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPhoto = async (base64: string) => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", base64);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${yejimong-g}/image/upload`,
        formData
      );

      setGallery(prev => [res.data.secure_url, ...prev]);
    } catch (err) {
      console.error(err);
      setError("Failed to upload photo. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setImgSrc(imageSrc);
    await uploadPhoto(imageSrc);
  }, [webcamRef]);

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
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "📷 찰칵!"}
        </button>

        {error && <span className="text-red-600 font-bold">{error}</span>}
      </div>

      {imgSrc && (
        <div className="px-4 bg-white flex flex-col items-center pt-4 pb-16">
          <img src={imgSrc} alt="Captured" className="rounded-lg" />
          <span className="font-kangwon-bold text-xl pt-4">
            2026. 01. 08. 결이 생일 기념🎉
          </span>
        </div>
      )}

      <div className="gallery px-4 py-10">
        <h2 className="font-kangwon-bold text-2xl mb-4">🎉 Gallery</h2>
        <div className="grid grid-cols-3 gap-4">
          {gallery.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Photo ${i}`}
              className="w-full h-auto rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Photo;
