// ===== ГЛОБАЛЬНАЯ МУЗЫКА =====
document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-btn');
  const volumeSlider = document.getElementById('volume-slider');
  
  if (!music) return; // Если на странице нет музыки - выходим

  const MAX_VOLUME = 0.4; // Максимальная громкость

  // 1. Восстанавливаем громкость и время из памяти
  const savedVolume = localStorage.getItem('musicVolume');
  if (savedVolume !== null) {
    music.volume = parseFloat(savedVolume);
    if (volumeSlider && MAX_VOLUME > 0) {
      volumeSlider.value = music.volume / MAX_VOLUME;
    }
  } else {
    music.volume = (volumeSlider ? volumeSlider.value : 0.5) * MAX_VOLUME;
  }

  // Восстанавливаем время трека (чтобы не начинался с нуля)
  const savedTime = sessionStorage.getItem('musicTime');
  if (savedTime) {
    music.currentTime = parseFloat(savedTime);
  }

  // 2. Функция сохранения времени (вызывается каждые полсекунды)
  setInterval(() => {
    if (!music.paused) {
      sessionStorage.setItem('musicTime', music.currentTime);
    }
  }, 500);

  // 3. Обновление иконки кнопки
  function updateBtnIcon() {
    if (!musicBtn) return;
    musicBtn.innerHTML = music.paused ? '🔇' : '🔊';
  }

  // 4. Попытка автозапуска
  function tryPlayMusic() {
    // Если пользователь сам выключил музыку (или еще не включал) - не запускаем
    if (sessionStorage.getItem('musicPaused') !== 'false') {
      updateBtnIcon();
      return;
    }
    
    music.play().then(() => {
      updateBtnIcon();
      document.removeEventListener('click', tryPlayMusic);
      document.removeEventListener('touchstart', tryPlayMusic);
    }).catch(() => {});
  }
  
  tryPlayMusic();
  document.addEventListener('click', tryPlayMusic);
  document.addEventListener('touchstart', tryPlayMusic);

  // 5. Кнопка паузы/воспроизведения
  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (music.paused) {
        music.play();
        sessionStorage.setItem('musicPaused', 'false');
      } else {
        music.pause();
        sessionStorage.setItem('musicPaused', 'true');
      }
      updateBtnIcon();
    });
  }

  // 6. Ползунок громкости
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      music.volume = e.target.value * MAX_VOLUME;
      localStorage.setItem('musicVolume', music.volume);
    });
  }
  
  updateBtnIcon();
});
