import React, { useCallback } from 'react';
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
  return canvas.toDataURL('image/jpeg');
};

function Profile({ avatarUrl, setAvatarUrl }: { avatarUrl: string | null, setAvatarUrl: (url: string | null) => void }) {
  const [image, setImage] = React.useState<string | null>(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<any>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (image && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      setAvatarUrl(croppedImage);
      setImage(null);
    }
  };

  return (
    <div className="page active p-6">
      <div className="sec-head">
        <div>
          <div className="sec-title">👤 User Profile</div>
          <div className="sec-sub">Manage your personal information</div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Avatar</div></div>
        <div className="flex items-center gap-4">
          {avatarUrl && avatarUrl.trim() !== '' && <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />}
          <input type="file" onChange={handleFileChange} accept="image/*" />
        </div>
        {image && (
          <div className="mt-4 h-64 relative">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
            <button className="btn btn-primary mt-2" onClick={handleSave}>Save Crop</button>
          </div>
        )}
      </div>
      <div className="card mt-3">
        <div className="card-header"><div className="card-title">Personal Information</div></div>
        <div className="form-group mb-3">
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <input id="fullName" type="text" className="form-control" defaultValue="John Doe" />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input id="email" type="email" className="form-control" defaultValue="john.doe@factory.com" />
        </div>
        <div className="form-group">
          <label htmlFor="role" className="form-label">Role</label>
          <input id="role" type="text" className="form-control" defaultValue="Quality Manager" readOnly />
        </div>
      </div>
      <div className="card mt-3">
        <div className="card-header"><div className="card-title">Security</div></div>
        <button className="btn btn-primary">Change Password</button>
      </div>
      <div className="mt-3">
        <button className="btn btn-primary">Save Profile</button>
      </div>
    </div>
  );
}

export { Profile };
