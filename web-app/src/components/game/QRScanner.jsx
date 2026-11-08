"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, X, RefreshCw, AlertCircle, Smartphone } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScanSuccess, onClose }) {
  const [error, setError] = useState("");
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [starting, setStarting] = useState(true);
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const scannerId = "qr-reader-container";

    const qrCodeScanner = new Html5Qrcode(scannerId);
    scannerRef.current = qrCodeScanner;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!isMounted) return;
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer back/rear camera on phones
          const backCam = devices.find(
            (d) =>
              d.label.toLowerCase().includes("back") ||
              d.label.toLowerCase().includes("environment") ||
              d.label.toLowerCase().includes("rear")
          );
          const camId = backCam ? backCam.id : devices[0].id;
          setSelectedCameraId(camId);
          startCamera(qrCodeScanner, camId);
        } else {
          setStarting(false);
          setError("No cameras found on your device.");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setStarting(false);
        setError("Camera access was not granted or is unavailable on this device. Please allow camera permissions in your browser.");
      });

    return () => {
      isMounted = false;
      if (scannerRef.current && isScanningRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch(() => {});
      }
    };
  }, []);

  const startCamera = (scanner, cameraId) => {
    setStarting(true);
    setError("");
    isScanningRef.current = true;

    scanner
      .start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 230, height: 230 }
        },
        (decodedText) => {
          let code = decodedText.trim();
          try {
            if (decodedText.includes("room=")) {
              const url = new URL(decodedText);
              code = url.searchParams.get("room") || code;
            }
          } catch (e) {}

          if (code && isScanningRef.current) {
            isScanningRef.current = false;
            scanner
              .stop()
              .then(() => {
                scanner.clear();
                onScanSuccess(code.toUpperCase());
              })
              .catch(() => {
                onScanSuccess(code.toUpperCase());
              });
          }
        },
        () => {
          // ignore per-frame scan misses
        }
      )
      .then(() => {
        setStarting(false);
      })
      .catch((err) => {
        setStarting(false);
        setError("Failed to start camera viewfinder: " + (err.message || "Camera busy"));
      });
  };

  const handleSwitchCamera = (newCamId) => {
    setSelectedCameraId(newCamId);
    if (scannerRef.current && isScanningRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          startCamera(scannerRef.current, newCamId);
        })
        .catch(() => {
          startCamera(scannerRef.current, newCamId);
        });
    }
  };

  return (
    <div className="p-4 rounded-3xl glass-card border border-sky-300 shadow-2xl space-y-3">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/60">
        <div className="flex items-center gap-2 text-xs font-black text-[#0369a1]">
          <Camera className="w-4 h-4 text-sky-600 animate-pulse" />
          <span>Point Camera at Player 1&apos;s QR Code</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg glass-pill hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-bold transition-colors"
          title="Close Camera"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Error prompt */}
      {error && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Camera Error</span>
          </div>
          <p className="text-[11px] leading-relaxed">{error}</p>
          <p className="text-[11px] text-slate-600 font-semibold pt-1">
            Tip: You can always enter the 6-character room code manually below!
          </p>
        </div>
      )}

      {/* Camera Viewfinder */}
      <div className="relative overflow-hidden rounded-2xl bg-black/90 min-h-[260px] flex items-center justify-center">
        <div id="qr-reader-container" className="w-full max-w-[280px] mx-auto overflow-hidden" />
        {starting && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white gap-2 z-10">
            <div className="w-8 h-8 border-3 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold">Starting Camera...</span>
          </div>
        )}
      </div>

      {/* Camera Switcher if multiple exist */}
      {cameras.length > 1 && (
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-500 font-medium">Select Camera:</span>
          <select
            value={selectedCameraId}
            onChange={(e) => handleSwitchCamera(e.target.value)}
            className="text-xs px-2.5 py-1 rounded-xl glass-pill font-semibold text-slate-700 focus:outline-none"
          >
            {cameras.map((c, idx) => (
              <option key={c.id} value={c.id}>
                {c.label || `Camera ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Cancel button */}
      <button
        type="button"
        onClick={onClose}
        className="w-full py-2 rounded-xl glass-pill hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all"
      >
        Cancel Camera • Enter Code Manually
      </button>
    </div>
  );
}

