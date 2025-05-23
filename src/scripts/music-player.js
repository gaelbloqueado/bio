const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;
const songTitleElement = document.getElementById('songTitle');
const progressBar = document.getElementById('progressBar');
const progressBarContainer = document.querySelector('.progress-bar-container');
const volumeBtn = document.getElementById('volumeBtn');
const volumeIcon = volumeBtn ? volumeBtn.querySelector('i') : null;
const volumeSlider = document.getElementById('volumeSlider');

if (!audioPlayer || !playPauseBtn || !playIcon || !songTitleElement || !progressBar || !progressBarContainer || !volumeBtn || !volumeIcon || !volumeSlider) {
    console.warn("Bio Card Music Player: Algunos elementos del DOM no fueron encontrados. El reproductor podría no funcionar correctamente.");
} else {
    let isPlaying = false;
    let previousVolume = audioPlayer.volume; 

    function updateSongTitle() {
        if (songTitleElement && audioPlayer.src) {
            if (audioPlayer.title && audioPlayer.title.trim() !== "") {
                 songTitleElement.textContent = audioPlayer.title;
            } else {
                try {
                    const url = new URL(audioPlayer.src);
                    const pathSegments = url.pathname.split('/');
                    const fileNameWithExtension = pathSegments[pathSegments.length - 1];
                    let trackName = decodeURIComponent(fileNameWithExtension.substring(0, fileNameWithExtension.lastIndexOf('.')) || fileNameWithExtension);
                    trackName = trackName.replace(/[_-]/g, ' ');
                    trackName = trackName.replace(/\b\w/g, char => char.toUpperCase());
                    songTitleElement.textContent = trackName || "Audio Track";
                } catch (e) {
                    songTitleElement.textContent = "Audio Track";
                }
            }
        }
    }
    
    if (audioPlayer.readyState > 0) {
        updateSongTitle();
        previousVolume = audioPlayer.volume;
        volumeSlider.value = previousVolume;
        updateVolumeIcon(previousVolume);
    } else {
        audioPlayer.addEventListener('loadedmetadata', () => {
            updateSongTitle();
            previousVolume = audioPlayer.volume;
            volumeSlider.value = previousVolume;
            updateVolumeIcon(previousVolume);
        });
    }

    playPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused || audioPlayer.ended) {
            audioPlayer.play().catch(error => console.error("Error al reproducir audio:", error));
        } else {
            audioPlayer.pause();
        }
    });

    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    });

    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    });

    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        progressBar.style.width = '0%';
        audioPlayer.currentTime = 0;
    });

    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration) {
            const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
    });

    progressBarContainer.addEventListener('click', (e) => {
        const rect = progressBarContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const duration = audioPlayer.duration;
        
        if (duration && Number.isFinite(duration)) {
            audioPlayer.currentTime = (clickX / width) * duration;
        }
    });

    volumeBtn.addEventListener('click', () => {
        audioPlayer.muted = !audioPlayer.muted;
    });
    
    volumeSlider.addEventListener('input', (e) => {
        const newVolume = parseFloat(e.target.value);
        audioPlayer.volume = newVolume;
        audioPlayer.muted = newVolume === 0;
    });

    audioPlayer.addEventListener('volumechange', () => {
        volumeSlider.value = audioPlayer.muted ? 0 : audioPlayer.volume;
        updateVolumeIcon(audioPlayer.muted ? 0 : audioPlayer.volume);
    });
    
    function updateVolumeIcon(volume) {
        volumeIcon.classList.remove('fa-volume-up', 'fa-volume-down', 'fa-volume-off', 'fa-volume-mute');
        if (audioPlayer.muted || volume === 0) {
            volumeIcon.classList.add('fa-volume-mute');
        } else if (volume > 0.66) {
            volumeIcon.classList.add('fa-volume-up');
        } else if (volume > 0.33) {
            volumeIcon.classList.add('fa-volume-down');
        } else {
            volumeIcon.classList.add('fa-volume-off'); 
        }
    }
    updateVolumeIcon(audioPlayer.volume);
    if (audioPlayer.muted) updateVolumeIcon(0);
}