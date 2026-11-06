import { useState } from 'react';

import imageErrorIcon from '@/assets/images/image_error.svg';

import './RecordPhoto.css';

interface RecordPhotoProps {
  src: string;
  alt: string;
  caption?: string;
  onRemove?: () => void;
}

export default function RecordPhoto({ src, alt, caption, onRemove }: RecordPhotoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return (
    <div className="record-photo">
      {failedSrc === src ? (
        <span className="record-photo__error">
          <img src={imageErrorIcon} alt="" width={24} height={24} />
        </span>
      ) : (
        <img
          className="record-photo__image"
          src={src}
          alt={alt}
          onError={() => setFailedSrc(src)}
        />
      )}
      {caption && <span className="record-photo__caption">{caption}</span>}
      {onRemove && (
        <button
          type="button"
          className="record-photo__remove"
          onClick={onRemove}
          aria-label="사진 삭제"
        />
      )}
    </div>
  );
}
