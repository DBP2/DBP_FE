import { useRef, type ChangeEvent } from 'react';

import BottomSheet from '@/components/common/BottomSheet/BottomSheet';

import './AttachSheet.css';

interface AttachSheetProps {
  open: boolean;
  onClose: () => void;
  onSelect: (file: File) => void;
}

export default function AttachSheet({ open, onClose, onSelect }: AttachSheetProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const albumInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    onSelect(file);
    onClose();
  };

  return (
    <>
      <input
        ref={cameraInputRef}
        className="attach-sheet__input"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
      />
      <input
        ref={albumInputRef}
        className="attach-sheet__input"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
      <BottomSheet open={open} onClose={onClose}>
        <ul className="attach-sheet__list">
          <li>
            <button
              type="button"
              className="attach-sheet__option"
              onClick={() => cameraInputRef.current?.click()}
            >
              카메라로 촬영
            </button>
          </li>
          <li>
            <button
              type="button"
              className="attach-sheet__option"
              onClick={() => albumInputRef.current?.click()}
            >
              앨범에서 선택
            </button>
          </li>
        </ul>
      </BottomSheet>
    </>
  );
}
