import { useState, useRef, useEffect, useCallback } from "react";

// ✅ GitHub Pages 下必须用 BASE_URL 拼接（不要用 /audio/... 这种根路径）
const CHRISTMAS_MUSIC_URL = `${import.meta.env.BASE_URL}audio/christmas-music.mp3`;

type Options = {
  autoPlay?: boolean;   // 是否自动尝试播放（可能被浏览器拦截）
  fadeInMs?: number;    // 渐入时长
  fadeOutMs?: number;   // 渐出时长
};

export function useChristmasAudio(options: Options = {}) {
  const { autoPlay = true, fadeInMs = 1500, fadeOutMs = 900 } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3); // 这是“目标音量”
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ 如果自动播放被拦截，置为 true（你可以在 UI 上提示“点一下开启音乐”）
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const autoTriedRef = useRef(false);

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  const cancelFade = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // ✅ 音量渐变工具：把当前音量平滑过渡到 to
  const fadeTo = useCallback((to: number, durationMs: number) => {
    return new Promise<void>((resolve) => {
      const audio = audioRef.current;
      if (!audio) return resolve();

      cancelFade();

      const from = audio.volume;
      const target = clamp01(to);
      const start = performance.now();
      const dur = Math.max(0, durationMs);

      const tick = (now: number) => {
        const t = dur === 0 ? 1 : Math.min(1, (now - start) / dur);
        audio.volume = from + (target - from) * t;

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
          resolve();
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    });
  }, []);

  // ✅ 初始化 audio（只做一次）
  useEffect(() => {
    const audio = new Audio();
    audio.src = CHRISTMAS_MUSIC_URL;
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0; // 先设 0，播放时再渐入

    const onCanPlay = () => setIsLoaded(true);
    const onErr = (e: Event) => console.warn("Audio loading error:", e);

    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("error", onErr);

    audioRef.current = audio;

    return () => {
      cancelFade();
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onErr);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ play：从 0 音量开始播放，然后渐入到目标音量
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      cancelFade();

      // 确保 src 正确（避免被别处覆盖）
      if (audio.src !== new URL(CHRISTMAS_MUSIC_URL, window.location.href).href) {
        audio.src = CHRISTMAS_MUSIC_URL;
      }

      const target = isMuted ? 0 : clamp01(volume);

      audio.volume = 0;
      await audio.play(); // 可能被浏览器拦截
      setIsPlaying(true);
      setNeedsInteraction(false);

      if (target > 0) {
        await fadeTo(target, fadeInMs);
      }
    } catch (error) {
      console.warn("Audio playback failed:", error);
      setIsPlaying(false);
      setNeedsInteraction(true); // 告诉 UI：需要用户点一下
    }
  }, [fadeInMs, fadeTo, isMuted, volume]);

  // ✅ pause：先渐出到 0，再暂停
  const pause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      cancelFade();
      await fadeTo(0, fadeOutMs);
    } finally {
      audio.pause();
      setIsPlaying(false);
    }
  }, [fadeOutMs, fadeTo]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      void pause();
    } else {
      void play();
    }
  }, [isPlaying, pause, play]);

  // ✅ 静音切换：播放中就做个小渐变更舒服
  const toggleMute = useCallback(async () => {
    const next = !isMuted;
    setIsMuted(next);

    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      audio.volume = next ? 0 : clamp01(volume);
      return;
    }

    await fadeTo(next ? 0 : clamp01(volume), 250);
  }, [fadeTo, isMuted, isPlaying, volume]);

  // ✅ 当用户调音量：如果正在播放且没静音，直接把音量调整到新值（你也可以改成渐变）
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = 0;
    } else if (!rafRef.current) {
      // 如果当前没有在做渐变，就直接同步到目标音量
      audio.volume = clamp01(volume);
    }
  }, [volume, isMuted]);

  // ✅ 自动播放：音频加载完成后，只尝试一次（可能被拦截）
  useEffect(() => {
    if (!autoPlay) return;
    if (!isLoaded) return;
    if (autoTriedRef.current) return;

    autoTriedRef.current = true;
    void play();
  }, [autoPlay, isLoaded, play]);

  return {
    isPlaying,
    isMuted,
    isLoaded,
    volume,
    setVolume,

    // 新增：自动播放被拦截时用这个提示 UI
    needsInteraction,

    play,
    pause,
    toggle,
    toggleMute,
  };
}
