/**
 * RAMA-SITA INDIAN WEDDING SCENE - DEVOTIONAL INTERACTIVE SCRIPT
 */

// Dedicated Asset Map File / Inventory Object
window.WEDDING_ASSET_MAP = {
  rama: 'public/assets/wedding/Rama_Wedding_Garland_Transparent.png',
  sita: 'public/assets/wedding/Sita_Wedding_Garland_Transparent.png',
  mandapArch: 'public/assets/wedding/Indian_Wedding_Mandap_Arch.png',
  mandapPillarLeft: 'public/assets/wedding/Mandap_Pillar_Left.png',
  mandapPillarRight: 'public/assets/wedding/Mandap_Pillar_Right.png',
  toran: 'public/assets/wedding/Wedding_Floral_Toran.png',
  hangingStrings: 'public/assets/wedding/Wedding_Hanging_Flower_Strings.png',
  rangoli: 'public/assets/wedding/Wedding_Flower_Rangoli_Diyas.png',
  cornerLeft: 'public/assets/wedding/Wedding_Floral_Corner_Left.png',
  cornerRight: 'public/assets/wedding/Wedding_Floral_Corner_Right.png',
  havanKund: 'public/assets/wedding/Havan_Kund_Fire_Holder.png',
  flameLeft: 'public/assets/wedding/Flame_Left.png',
  flameRight: 'public/assets/wedding/Flame_Right.png'
};

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('wedding-canvas');
  if (!canvas) return;

  const petalsContainer = document.getElementById('wedding-petals-layer');
  const playPauseBtn = document.getElementById('wedding-play-pause-btn');
  const mandapToggleBtn = document.getElementById('wedding-mandap-toggle-btn');
  const soundToggleBtn = document.getElementById('wedding-sound-btn');
  const fullscreenBtn = document.getElementById('wedding-fullscreen-btn');
  const downloadBtn = document.getElementById('wedding-download-btn');

  const mandapArchImg = document.getElementById('wedding-arch-img');
  const mandapPillarLeftImg = document.getElementById('wedding-pillar-left-img');
  const mandapPillarRightImg = document.getElementById('wedding-pillar-right-img');

  let isPlaying = true;
  let isPillarMode = false;

  // 1. Generate Falling Flower Petals (Disabled)
  function initFallingPetals() {
    return;
  }

  initFallingPetals();

  // 2. Play / Pause Animations
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      const animatedElements = canvas.querySelectorAll(
        '.wedding-fire-flame, .wedding-fire-aura, .wedding-hanging-strings, .wedding-halo-glow-rama, .wedding-halo-glow-sita, .wedding-rangoli, .petal'
      );

      animatedElements.forEach((el) => {
        el.style.animationPlayState = isPlaying ? 'running' : 'paused';
      });

      playPauseBtn.innerHTML = isPlaying
        ? '<span>⏸ Pause</span>'
        : '<span>▶ Play</span>';
      playPauseBtn.setAttribute('aria-label', isPlaying ? 'Pause Animations' : 'Play Animations');
    });
  }

  // 3. Mandap View Toggle (Complete Arch vs Separate Pillars + Toran)
  // Ensures complete mandap and duplicate pillars are NEVER displayed together!
  if (mandapToggleBtn) {
    mandapToggleBtn.addEventListener('click', () => {
      isPillarMode = !isPillarMode;

      if (isPillarMode) {
        if (mandapArchImg) mandapArchImg.style.display = 'none';
        if (mandapPillarLeftImg) mandapPillarLeftImg.style.display = 'block';
        if (mandapPillarRightImg) mandapPillarRightImg.style.display = 'block';
        mandapToggleBtn.innerHTML = '<span>🏛 Mandap Arch</span>';
      } else {
        if (mandapArchImg) mandapArchImg.style.display = 'block';
        if (mandapPillarLeftImg) mandapPillarLeftImg.style.display = 'none';
        if (mandapPillarRightImg) mandapPillarRightImg.style.display = 'none';
        mandapToggleBtn.innerHTML = '<span>🏛 Pillars &amp; Toran</span>';
      }
    });
  }

  // 4. Sound Toggle (Connects to BGM Player)
  if (soundToggleBtn) {
    const bgmPlayer = document.getElementById('ravan-bgm-player');
    soundToggleBtn.addEventListener('click', () => {
      if (!bgmPlayer) {
        alert('Audio player unavailable');
        return;
      }
      if (bgmPlayer.paused) {
        bgmPlayer.play().then(() => {
          soundToggleBtn.innerHTML = '<span>🔊 BGM On</span>';
        }).catch(err => {
          console.warn('Audio playback error:', err);
        });
      } else {
        bgmPlayer.pause();
        soundToggleBtn.innerHTML = '<span>🔇 BGM Muted</span>';
      }
    });
  }

  // 5. Fullscreen Mode
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (canvas.requestFullscreen) {
          canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
          canvas.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  // 6. Download High-Res Screenshot Canvas
  if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {
      downloadBtn.disabled = true;
      const originalText = downloadBtn.innerHTML;
      downloadBtn.innerHTML = '<span>⏳ Exporting...</span>';

      try {
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = 1080;
        offscreenCanvas.height = 1920;
        const ctx = offscreenCanvas.getContext('2d');

        // Render Background Gradient
        const bgGradient = ctx.createRadialGradient(540, 576, 0, 540, 576, 1000);
        bgGradient.addColorStop(0, '#ea580c');
        bgGradient.addColorStop(0.5, '#9a3412');
        bgGradient.addColorStop(1, '#451a03');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, 1080, 1920);

        // Helper function to draw an image onto the 1080x1920 coordinate system
        const drawImageElement = (img, x, y, width, height) => {
          return new Promise((resolve) => {
            if (!img || img.style.display === 'none') {
              resolve();
              return;
            }
            if (img.complete && img.naturalWidth !== 0) {
              try {
                ctx.drawImage(img, x, y, width, height);
              } catch (e) {
                console.warn('Canvas draw warning:', e);
              }
              resolve();
            } else {
              const tempImg = new Image();
              tempImg.crossOrigin = 'anonymous';
              tempImg.onload = () => {
                try {
                  ctx.drawImage(tempImg, x, y, width, height);
                } catch (e) {}
                resolve();
              };
              tempImg.onerror = () => resolve();
              tempImg.src = img.src;
            }
          });
        };

        // Draw Layers Sequentially (Back to Front)
        const cornerLeft = document.getElementById('wedding-corner-left-img');
        const cornerRight = document.getElementById('wedding-corner-right-img');
        const arch = document.getElementById('wedding-arch-img');
        const pillarLeft = document.getElementById('wedding-pillar-left-img');
        const pillarRight = document.getElementById('wedding-pillar-right-img');
        const toran = document.getElementById('wedding-toran-img');
        const strings = document.getElementById('wedding-strings-img');
        const rama = document.getElementById('wedding-rama-img');
        const sita = document.getElementById('wedding-sita-img');
        const rangoli = document.getElementById('wedding-rangoli-img');
        const havan = document.getElementById('wedding-havan-img');
        const flame = document.getElementById('wedding-flame-img');

        // Draw Corner Decor
        await drawImageElement(cornerLeft, 0, 0, 410, 410);
        await drawImageElement(cornerRight, 670, 0, 410, 410);

        // Mandap Layer
        if (!isPillarMode) {
          await drawImageElement(arch, 27, 38, 1026, 1200);
        } else {
          await drawImageElement(pillarLeft, 38, 150, 237, 1200);
          await drawImageElement(pillarRight, 805, 150, 237, 1200);
        }

        // Toran & Strings
        await drawImageElement(toran, 118, 210, 842, 350);
        await drawImageElement(strings, 75, 260, 928, 600);

        // Couple Layer
        await drawImageElement(rama, 226, 600, 360, 1060);
        await drawImageElement(sita, 529, 670, 340, 990);

        // Rangoli
        await drawImageElement(rangoli, 118, 1420, 842, 480);

        // Sacred Fire
        await drawImageElement(havan, 420, 1550, 240, 240);
        await drawImageElement(flame, 450, 1420, 180, 220);

        // Trigger Download
        const dataUrl = offscreenCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'Rama_Sita_Wedding_Devotional_Art.png';
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Screenshot generation failed:', err);
      } finally {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = originalText;
      }
    });
  }
});
