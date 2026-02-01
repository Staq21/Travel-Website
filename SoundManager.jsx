import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';

const SoundManager = forwardRef(({ enabled }, ref) => {
  const [audioContext, setAudioContext] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const ambientRef = useRef(null);
  
  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContext) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(ctx);
        setIsInitialized(true);
      }
    };
    
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, [audioContext]);

  // Create a ping sound using Web Audio API
  const playPing = () => {
    if (!audioContext || !enabled) return;
    
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not available');
    }
  };

  // Create a success/confirmation sound
  const playSuccess = () => {
    if (!audioContext || !enabled) return;
    
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      
      // Play a pleasant ascending arpeggio
      const now = audioContext.currentTime;
      oscillator.frequency.setValueAtTime(523.25, now); // C5
      oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      
      oscillator.start(now);
      oscillator.stop(now + 0.4);
    } catch (e) {
      console.log('Audio not available');
    }
  };

  // Create ambient background sound (wind/atmosphere)
  const startAmbient = () => {
    if (!audioContext || !enabled || ambientRef.current) return;
    
    try {
      // Create noise source
      const bufferSize = audioContext.sampleRate * 2;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.02;
      }
      
      const noise = audioContext.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      
      // Low-pass filter for wind-like sound
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      filter.Q.value = 1;
      
      // Very low gain for subtle background
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0.05;
      
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      noise.start();
      ambientRef.current = { noise, gainNode };
    } catch (e) {
      console.log('Ambient audio not available');
    }
  };

  const stopAmbient = () => {
    if (ambientRef.current) {
      try {
        ambientRef.current.noise.stop();
        ambientRef.current = null;
      } catch (e) {
        // Already stopped
      }
    }
  };

  const toggleAmbient = () => {
    if (ambientRef.current) {
      stopAmbient();
    } else {
      startAmbient();
    }
  };

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    playPing,
    playSuccess,
    startAmbient,
    stopAmbient,
    toggleAmbient
  }));

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbient();
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioContext]);

  // Stop ambient when disabled
  useEffect(() => {
    if (!enabled) {
      stopAmbient();
    }
  }, [enabled]);

  return null; // This is a non-visual component
});

SoundManager.displayName = 'SoundManager';

export default SoundManager;
