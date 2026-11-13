/**
 * @file AudioController.js
 * @description Manages YouTube background music playback for Christmas mode.
 * Adheres to Single Responsibility Principle (SRP).
 * Handles mobile touch autoplay policies.
 */

export class AudioController {
  static #instance = null;

  /**
   * @param {string} [videoId='_P95hlQIMzE'] - YouTube video ID for Christmas background music.
   */
  constructor(videoId = '_P95hlQIMzE') {
    if (AudioController.#instance) {
      return AudioController.#instance;
    }

    this.videoId = videoId;
    this.player = null;
    this.isReady = false;
    this.shouldPlay = false;
    this.userInteracted = false;
    this.volume = 70;

    this.#initYouTubeAPI();
    this.#bindUserInteraction();

    AudioController.#instance = this;
  }

  /**
   * Retrieves singleton instance.
   * @returns {AudioController}
   */
  static getInstance() {
    if (!AudioController.#instance) {
      AudioController.#instance = new AudioController();
    }
    return AudioController.#instance;
  }

  /**
   * Dynamically injects YouTube IFrame API and creates hidden player container.
   * @private
   */
  #initYouTubeAPI() {
    if (typeof window === 'undefined') return;

    // Create hidden container for YouTube iframe
    let container = document.getElementById('youtube-audio-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'youtube-audio-container';
      container.style.position = 'absolute';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.top = '-1000px';
      container.style.left = '-1000px';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-9999';
      document.body.appendChild(container);
    }

    const placeholder = document.createElement('div');
    placeholder.id = 'yt-player-element';
    container.appendChild(placeholder);

    // Setup YouTube IFrame API callback
    const onYouTubeReady = () => {
      try {
        this.player = new window.YT.Player('yt-player-element', {
          height: '1',
          width: '1',
          videoId: this.videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: this.videoId,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              this.isReady = true;
              event.target.setVolume(this.volume);
              if (this.shouldPlay && this.userInteracted) {
                event.target.playVideo();
              }
            },
            onStateChange: (event) => {
              // Ensure endless loop
              if (event.data === window.YT.PlayerState.ENDED && this.shouldPlay) {
                this.player.playVideo();
              }
            },
          },
        });
      } catch (err) {
        console.warn('[AudioController] Failed to initialize YouTube player:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      onYouTubeReady();
    } else {
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        onYouTubeReady();
      };
    }
  }

  /**
   * Browser Autoplay Policy: Listen for first touch or interaction
   * on mobile or desktop to unlock audio playback.
   * @private
   */
  #bindUserInteraction() {
    if (typeof window === 'undefined') return;

    const events = ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown'];
    const unlockAudio = () => {
      this.userInteracted = true;
      if (this.shouldPlay) {
        this.play();
      }
      events.forEach((ev) => window.removeEventListener(ev, unlockAudio));
    };

    events.forEach((ev) => window.addEventListener(ev, unlockAudio, { passive: true }));
  }

  /**
   * Starts or resumes background music.
   */
  play() {
    this.shouldPlay = true;

    if (this.isReady && this.player && typeof this.player.playVideo === 'function') {
      try {
        this.player.playVideo();
      } catch (e) {
        console.warn('[AudioController] Playback prevented by browser policy until interaction:', e);
      }
    }
  }

  /**
   * Pauses background music.
   */
  pause() {
    this.shouldPlay = false;

    if (this.isReady && this.player && typeof this.player.pauseVideo === 'function') {
      try {
        this.player.pauseVideo();
      } catch (e) {
        console.warn('[AudioController] Failed to pause player:', e);
      }
    }
  }

  /**
   * Toggles play/pause state.
   */
  toggle() {
    if (this.shouldPlay) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Updates playback volume (0 to 100).
   * @param {number} volume
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(100, volume));
    if (this.isReady && this.player && typeof this.player.setVolume === 'function') {
      this.player.setVolume(this.volume);
    }
  }
}
