import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, firestore } from "../lib/firebase";

const Photo = () => {
  const webcamRef = useRef<any>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  // Upload function
  const uploadPhoto = async (base64: string) => {
    const blob = await (await fetch(base64)).blob();

    const photoRef = ref(storage, `photos/${Date.now()}.jpg`);
    await uploadBytes(photoRef, blob);
  };

  // Capture function
  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setImgSrc(imageSrc);
    await uploadPhoto(imageSrc); // Upload to Firebase
  }, []);

  return (
    <div className="wrapper">
      <span className="title py-20">📷Photo</span>
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
    </div>
  );
};

export default Photo;
