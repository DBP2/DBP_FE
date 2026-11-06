import QrScanner from 'qr-scanner';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

export type QrScannerStatus = 'starting' | 'scanning' | 'denied' | 'unavailable';

const isCameraSupported = () =>
  typeof window !== 'undefined' &&
  window.isSecureContext &&
  Boolean(navigator.mediaDevices?.getUserMedia);

const isPermissionError = (error: unknown) => {
  if (error instanceof DOMException) {
    return error.name === 'NotAllowedError' || error.name === 'SecurityError';
  }
  return String(error).includes('NotAllowed');
};

export function useQrScanner(
  videoRef: RefObject<HTMLVideoElement | null>,
  onDecode: (value: string) => Promise<void>,
  enabled: boolean,
) {
  const [status, setStatus] = useState<QrScannerStatus>('starting');
  const [hasFlash, setHasFlash] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const scannerRef = useRef<QrScanner | null>(null);
  const onDecodeRef = useRef(onDecode);
  const isSupported = isCameraSupported();

  useEffect(() => {
    onDecodeRef.current = onDecode;
  }, [onDecode]);

  useEffect(() => {
    const video = videoRef.current;
    if (!enabled || !isSupported || !video) return;

    let isCancelled = false;
    const scanner = new QrScanner(
      video,
      (result) => {
        scanner.stop();
        onDecodeRef.current(result.data).catch(() => {
          if (!isCancelled) void scanner.start();
        });
      },
      { preferredCamera: 'environment', maxScansPerSecond: 8, returnDetailedScanResult: true },
    );
    scannerRef.current = scanner;

    scanner
      .start()
      .then(async () => {
        if (isCancelled) return;
        setStatus('scanning');
        const flash = await scanner.hasFlash();
        if (!isCancelled) setHasFlash(flash);
      })
      .catch((error: unknown) => {
        if (!isCancelled) setStatus(isPermissionError(error) ? 'denied' : 'unavailable');
      });

    return () => {
      isCancelled = true;
      scanner.destroy();
      scannerRef.current = null;
    };
  }, [enabled, isSupported, attempt, videoRef]);

  const retry = useCallback(() => {
    setStatus('starting');
    setHasFlash(false);
    setIsFlashOn(false);
    setAttempt((prev) => prev + 1);
  }, []);

  const toggleFlash = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    await scanner.toggleFlash();
    setIsFlashOn(scanner.isFlashOn());
  }, []);

  return {
    status: isSupported ? status : ('unavailable' as const),
    hasFlash,
    isFlashOn,
    toggleFlash,
    retry,
  };
}
