const COVER_GRADIENTS = [
    'linear-gradient(135deg, #e91429, #af2896)',
    'linear-gradient(135deg, #006450, #1ed760)',
    'linear-gradient(135deg, #1e3264, #509bf5)',
    'linear-gradient(135deg, #8400e7, #e91429)',
    'linear-gradient(135deg, #608108, #1ed760)',
    'linear-gradient(135deg, #eb1e32, #ff6b35)',
];

const BROWSE_CATEGORIES = [
    { name: 'Pop', color: '#e91429', emoji: '🎤' },
    { name: 'Hip-Hop', color: '#ba5d07', emoji: '🎧' },
    { name: 'Rock', color: '#e61e32', emoji: '🎸' },
    { name: 'Jazz', color: '#1e3264', emoji: '🎷' },
    { name: 'Chill', color: '#477d95', emoji: '🌊' },
    { name: 'Electronic', color: '#8d67ab', emoji: '⚡' },
];

const playlists = [
    { name: 'Liked Songs', cover: 'linear-gradient(135deg, #450af5, #8e44ad)', icon: 'fa-heart' },
    { name: 'Discover Weekly', cover: COVER_GRADIENTS[2], icon: null },
    { name: 'Release Radar', cover: COVER_GRADIENTS[0], icon: null },
    { name: 'On Repeat', cover: COVER_GRADIENTS[4], icon: null },
];

const songs = [
    {
        id: 1,
        title: 'Neon Dreams',
        artist: 'Synth Echo',
        album: 'Digital Pulse',
        dateAdded: 'Oct 24, 2023',
        duration: '3:45',
        src: 'https://res.cloudinary.com/dbubfhmn4/video/upload/v1778688724/Back_To_The_Start_-_Patrick_Jordan_Patrikios_seah4z.mp3',
        category: 'Recently Played',
    },
    {
        id: 2,
        title: 'Mountain Mist',
        artist: "Nature's Calm",
        album: 'Elysian',
        dateAdded: 'Oct 25, 2023',
        duration: '4:20',
        src: 'https://res.cloudinary.com/dbubfhmn4/video/upload/v1778688653/Find_My_Way_feat._Luqman_Frank_-_Blue_Deer_laajex.mp3',
        category: 'Made For You',
    },
    {
        id: 3,
        title: 'Cyber City',
        artist: 'Neon Samurai',
        album: 'Future Echoes',
        dateAdded: 'Oct 26, 2023',
        duration: '2:55',
        src: 'https://res.cloudinary.com/dbubfhmn4/video/upload/v1778688554/Back_To_The_Start_-_Patrick_Jordan_Patrikios_bos9kx.mp3',
        category: 'Recently Played',
    },
    {
        id: 4,
        title: 'Taught Her How To Leave',
        artist: 'Bill Douglas',
        album: 'Lessons',
        dateAdded: 'Oct 27, 2023',
        duration: '3:38',
        src: 'songs/Taught Her How To Leave - Bill Douglas.mp3',
        category: 'Made For You',
    },
    {
        id: 5,
        title: 'Tiny Shell',
        artist: 'Blue Deer',
        album: 'Ocean Views',
        dateAdded: 'Oct 28, 2023',
        duration: '4:31',
        src: 'songs/Tiny Shell - Blue Deer, Nyles Lannon.mp3',
        category: 'Recently Played',
    },
    {
        id: 6,
        title: 'Midnight Drive',
        artist: 'Synth Echo',
        album: 'Digital Pulse',
        dateAdded: 'Oct 29, 2023',
        duration: '3:12',
        src: 'https://res.cloudinary.com/dbubfhmn4/video/upload/v1778688724/Back_To_The_Start_-_Patrick_Jordan_Patrikios_seah4z.mp3',
        category: 'Made For You',
    },
];

const artists = [
    {
        name: 'Synth Echo',
        gradient: 'linear-gradient(180deg, rgba(0,100,80,0.9) 0%, #121212 100%)',
        followers: '1.2M',
        verified: true,
        description: 'Leading the electronic revival with pulsing beats and ethereal soundscapes.',
    },
    {
        name: "Nature's Calm",
        gradient: 'linear-gradient(180deg, rgba(30,50,100,0.9) 0%, #121212 100%)',
        followers: '850K',
        verified: true,
        description: 'Ambient sounds recorded in the deepest forests and highest peaks.',
    },
];

const mainContent = document.getElementById('main-view');
const searchInput = document.getElementById('search-input');
const navLinks = document.querySelectorAll('.nav-links li');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const likeBtn = document.getElementById('like-btn');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const currentTitle = document.getElementById('current-title');
const currentArtist = document.getElementById('current-artist');
const currentArt = document.getElementById('current-art');
const volumeBar = document.getElementById('volume-bar');
const volumeWrapper = document.getElementById('volume-wrapper');
const volumeIcon = document.getElementById('volume-icon');
const sidebarPlaylists = document.getElementById('sidebar-playlists');
const navBack = document.getElementById('nav-back');
const navForward = document.getElementById('nav-forward');

const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0;
const likedSongs = new Set();
let currentView = 'home';
const viewHistory = ['home'];
let historyIndex = 0;

function getCoverStyle(index) {
    return COVER_GRADIENTS[index % COVER_GRADIENTS.length];
}

function getCoverInitials(title) {
    return title
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

function escapeAttr(str) {
    return str.replace(/'/g, "\\'");
}

function init() {
    renderSidebarPlaylists();
    renderHome();
    loadSong(currentSongIndex, false);
    audio.volume = 0.8;
    volumeBar.style.width = '80%';
    setupEventListeners();
}

function renderSidebarPlaylists() {
    sidebarPlaylists.innerHTML = playlists
        .map(
            (pl) => `
        <div class="sidebar-playlist-item" role="button" tabindex="0">
            <div class="pl-cover" style="background: ${pl.cover}">
                <i class="fa-solid ${pl.icon || 'fa-music'}"></i>
            </div>
            <span>${pl.name}</span>
        </div>`
        )
        .join('');
}

function pushHistory(view, artistName = null) {
    const entry = artistName ? `artist:${artistName}` : view;
    if (viewHistory[historyIndex] === entry) return;
    viewHistory.splice(historyIndex + 1);
    viewHistory.push(entry);
    historyIndex = viewHistory.length - 1;
    updateNavArrows();
}

function updateNavArrows() {
    navBack.disabled = historyIndex <= 0;
    navForward.disabled = historyIndex >= viewHistory.length - 1;
}

function navigateHistory(delta) {
    const next = historyIndex + delta;
    if (next < 0 || next >= viewHistory.length) return;
    historyIndex = next;
    const entry = viewHistory[historyIndex];
    if (entry.startsWith('artist:')) {
        renderArtist(entry.slice(7), false);
    } else {
        switchView(entry, null, false);
    }
    updateNavArrows();
}

function switchView(view, artistName = null, recordHistory = true) {
    currentView = view;
    navLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.view === view);
    });

    if (view === 'home') renderHome();
    else if (view === 'search') renderSearch();
    else if (view === 'artist') {
        renderArtist(artistName, recordHistory);
        return;
    }

    if (recordHistory) pushHistory(view, artistName);
}

function renderHome() {
    mainContent.innerHTML = `
        <section class="page-section">
            <h1 class="greeting">${getGreeting()}</h1>
            <div class="quick-picks" id="quick-picks"></div>
            <div class="section-header">
                <h2 class="section-title">Made for you</h2>
                <a href="#" class="section-link">Show all</a>
            </div>
            <div class="cards-row" id="made-for-you"></div>
            <div class="section-header">
                <h2 class="section-title">Recently played</h2>
            </div>
            <div class="cards-row" id="recently-played"></div>
            <div class="section-header" style="margin-top: 8px;">
                <h2 class="section-title">Your library</h2>
            </div>
            <div class="song-table-wrap">
                <div class="song-list">
                    <div class="list-header">
                        <div class="col-index">#</div>
                        <div class="col-title">Title</div>
                        <div class="col-album">Album</div>
                        <div class="col-date">Date added</div>
                        <div class="col-time"><i class="fa-regular fa-clock"></i></div>
                    </div>
                    <div id="list-content"></div>
                </div>
            </div>
        </section>
    `;

    populateQuickPicks();
    populateAlbumRow('Made For You', 'made-for-you');
    populateAlbumRow('Recently Played', 'recently-played');
    renderSongList('list-content');
}

function populateQuickPicks() {
    const container = document.getElementById('quick-picks');
    const picks = [...songs].slice(0, 6);
    picks.forEach((song) => {
        const idx = songs.indexOf(song);
        const el = document.createElement('div');
        el.className = 'quick-card';
        el.innerHTML = `
            <div class="qc-cover" style="background: ${getCoverStyle(idx)}">${getCoverInitials(song.title)}</div>
            <span class="qc-title">${song.title}</span>
            <button type="button" class="qc-play" aria-label="Play ${song.title}"><i class="fa-solid fa-play"></i></button>
        `;
        el.addEventListener('click', () => playSongIndex(idx));
        container.appendChild(el);
    });
}

function populateAlbumRow(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    songs
        .filter((s) => s.category === category)
        .forEach((song) => {
            const idx = songs.indexOf(song);
            const card = document.createElement('article');
            card.className = 'album-card';
            card.innerHTML = `
                <div class="album-card-art">
                    <div class="cover-gradient" style="background: ${getCoverStyle(idx)}">${getCoverInitials(song.title)}</div>
                    <button type="button" class="card-play-btn" aria-label="Play"><i class="fa-solid fa-play"></i></button>
                </div>
                <h3>${song.title}</h3>
                <p>${song.artist} · ${song.album}</p>
            `;
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.card-play-btn')) playSongIndex(idx);
                else playSongIndex(idx);
            });
            container.appendChild(card);
        });
}

function renderSearch() {
    mainContent.innerHTML = `
        <section class="search-hero">
            <h1>Search</h1>
        </section>
        <section class="search-categories" id="browse-categories">
            ${BROWSE_CATEGORIES.map(
                (cat) => `
                <div class="category-card" style="background: ${cat.color}" data-query="${cat.name}">
                    <h3>${cat.name}</h3>
                    <span style="position:absolute;font-size:64px;bottom:-10px;right:8px;opacity:0.9">${cat.emoji}</span>
                </div>`
            ).join('')}
        </section>
        <section class="search-results-section">
            <h2 id="search-results-title">All tracks</h2>
            <div class="cards-row" id="search-results"></div>
        </section>
    `;

    document.querySelectorAll('.category-card').forEach((card) => {
        card.addEventListener('click', () => {
            searchInput.value = card.dataset.query;
            filterSearch(card.dataset.query);
        });
    });

    const grid = document.getElementById('search-results');
    songs.forEach((song) => grid.appendChild(createAlbumCard(song)));
}

function createAlbumCard(song) {
    const idx = songs.indexOf(song);
    const card = document.createElement('article');
    card.className = 'album-card';
    card.innerHTML = `
        <div class="album-card-art">
            <div class="cover-gradient" style="background: ${getCoverStyle(idx)}">${getCoverInitials(song.title)}</div>
            <button type="button" class="card-play-btn"><i class="fa-solid fa-play"></i></button>
        </div>
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
    `;
    card.addEventListener('click', () => playSongIndex(idx));
    return card;
}

function renderArtist(artistName, recordHistory = true) {
    const artist = artists.find((a) => a.name === artistName);
    if (!artist) return;

    currentView = 'artist';
    navLinks.forEach((link) => link.classList.remove('active'));
    if (recordHistory) pushHistory('artist', artistName);

    mainContent.innerHTML = `
        <section class="artist-view">
            <div class="artist-header" style="background: ${artist.gradient}">
                <div class="artist-info">
                    ${artist.verified ? '<span class="verified"><i class="fa-solid fa-circle-check"></i> Verified Artist</span>' : ''}
                    <h1>${artist.name}</h1>
                    <span class="followers">${artist.followers} monthly listeners</span>
                </div>
            </div>
            <div class="artist-content">
                <div class="artist-controls">
                    <button type="button" class="play-all-btn" id="artist-play-all"><i class="fa-solid fa-play"></i></button>
                    <button type="button" class="follow-btn">Follow</button>
                </div>
                <p style="color: var(--text-subdued); max-width: 600px; margin-bottom: 32px; line-height: 1.6;">${artist.description}</p>
                <h2>Popular</h2>
                <div class="song-table-wrap">
                    <div class="song-list"><div id="artist-tracks"></div></div>
                </div>
            </div>
        </section>
    `;

    const listEl = document.getElementById('artist-tracks');
    songs
        .filter((s) => s.artist === artistName)
        .forEach((song) => listEl.appendChild(createListItem(song, songs.indexOf(song))));

    document.getElementById('artist-play-all')?.addEventListener('click', () => {
        const first = songs.findIndex((s) => s.artist === artistName);
        if (first >= 0) playSongIndex(first);
    });
}

function renderSongList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    songs.forEach((song, index) => container.appendChild(createListItem(song, index)));
}

function createListItem(song, index) {
    const item = document.createElement('div');
    item.className = 'list-item';
    if (index === currentSongIndex && isPlaying) item.classList.add('playing');

    item.innerHTML = `
        <div class="col-index">
            <span class="index-num">${index + 1}</span>
            <i class="fa-solid fa-play play-icon"></i>
            <div class="eq-bars" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
        </div>
        <div class="col-title">
            <div class="thumb" style="background: ${getCoverStyle(index)}">${getCoverInitials(song.title)}</div>
            <div>
                <div class="title">${song.title}</div>
                <button type="button" class="artist-link" data-artist="${escapeAttr(song.artist)}">${song.artist}</button>
            </div>
        </div>
        <div class="col-album">${song.album}</div>
        <div class="col-date">${song.dateAdded}</div>
        <div class="col-time">${song.duration}</div>
    `;

    item.querySelector('.artist-link')?.addEventListener('click', (e) => {
        e.stopPropagation();
        openArtist(song.artist);
    });

    item.addEventListener('click', () => {
        if (index === currentSongIndex) togglePlay();
        else playSongIndex(index);
    });
    return item;
}

function openArtist(name) {
    if (artists.some((a) => a.name === name)) {
        renderArtist(name);
    }
}

function loadSong(index, autoplay = false) {
    const song = songs[index];
    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    currentArt.innerHTML = `<div class="cover-gradient" style="width:100%;height:100%;background:${getCoverStyle(index)};font-size:18px;display:flex;align-items:center;justify-content:center;">${getCoverInitials(song.title)}</div>`;
    audio.src = song.src;
    updateLikeButton();
    if (autoplay) playSong();
}

function playSongIndex(index) {
    currentSongIndex = index;
    loadSong(index, true);
    updateUI();
}

function playSong() {
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fa-solid fa-circle-pause"></i>';
    playPauseBtn.setAttribute('aria-label', 'Pause');
    audio.play().catch(() => {});
    updateUI();
}

function pauseSong() {
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
    playPauseBtn.setAttribute('aria-label', 'Play');
    audio.pause();
    updateUI();
}

function togglePlay() {
    if (isPlaying) pauseSong();
    else playSong();
}

function getNextIndex() {
    if (isShuffle) {
        let next;
        do {
            next = Math.floor(Math.random() * songs.length);
        } while (next === currentSongIndex && songs.length > 1);
        return next;
    }
    return (currentSongIndex + 1) % songs.length;
}

function getPrevIndex() {
    if (audio.currentTime > 3) return currentSongIndex;
    return (currentSongIndex - 1 + songs.length) % songs.length;
}

function nextSong() {
    if (repeatMode === 2) {
        audio.currentTime = 0;
        playSong();
        return;
    }
    playSongIndex(getNextIndex());
}

function prevSong() {
    playSongIndex(getPrevIndex());
}

function updateUI() {
    if (currentView === 'home') renderSongList('list-content');
    if (currentView === 'artist') {
        const artistList = document.getElementById('artist-tracks');
        const artistName = songs[currentSongIndex]?.artist;
        if (artistList && artistName) {
            artistList.innerHTML = '';
            songs
                .filter((s) => s.artist === artistName)
                .forEach((song) => artistList.appendChild(createListItem(song, songs.indexOf(song))));
        }
    }
}

function updateLikeButton() {
    const liked = likedSongs.has(songs[currentSongIndex].id);
    likeBtn.classList.toggle('liked', liked);
    likeBtn.innerHTML = liked
        ? '<i class="fa-solid fa-heart"></i>'
        : '<i class="fa-regular fa-heart"></i>';
}

function filterSearch(query) {
    const q = query.trim().toLowerCase();
    const filtered = q
        ? songs.filter(
              (s) =>
                  s.title.toLowerCase().includes(q) ||
                  s.artist.toLowerCase().includes(q) ||
                  s.album.toLowerCase().includes(q)
          )
        : songs;

    const grid = document.getElementById('search-results');
    const title = document.getElementById('search-results-title');
    if (!grid) {
        if (currentView !== 'search') switchView('search', null, false);
        setTimeout(() => filterSearch(query), 0);
        return;
    }

    title.textContent = q ? `Results for "${query}"` : 'All tracks';
    grid.innerHTML = '';
    if (filtered.length === 0) {
        grid.innerHTML = `<p class="no-results">No results found for "${query}"</p>`;
    } else {
        filtered.forEach((song) => grid.appendChild(createAlbumCard(song)));
    }
}

function handleSearchInput(value) {
    if (value.trim()) {
        if (currentView !== 'search') switchView('search');
        filterSearch(value);
    } else if (currentView === 'search') {
        filterSearch('');
    }
}

function setupEventListeners() {
    playPauseBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    });

    repeatBtn.addEventListener('click', () => {
        repeatMode = (repeatMode + 1) % 3;
        repeatBtn.classList.toggle('active', repeatMode > 0);
        repeatBtn.innerHTML =
            repeatMode === 2
                ? '<i class="fa-solid fa-repeat"></i><span style="font-size:8px;position:absolute;margin:14px 0 0 -8px">1</span>'
                : '<i class="fa-solid fa-repeat"></i>';
    });

    likeBtn.addEventListener('click', () => {
        const id = songs[currentSongIndex].id;
        if (likedSongs.has(id)) likedSongs.delete(id);
        else likedSongs.add(id);
        updateLikeButton();
    });

    currentArtist.addEventListener('click', () => openArtist(songs[currentSongIndex].artist));

    audio.addEventListener('timeupdate', () => {
        const { duration, currentTime } = audio;
        if (!duration || Number.isNaN(duration)) return;
        progressBar.style.width = `${(currentTime / duration) * 100}%`;
        currentTimeEl.textContent = formatTime(currentTime);
        totalDurationEl.textContent = formatTime(duration);
    });

    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        if (audio.duration) audio.currentTime = ratio * audio.duration;
    });

    volumeWrapper.addEventListener('click', (e) => {
        const rect = volumeWrapper.getBoundingClientRect();
        const vol = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.volume = vol;
        volumeBar.style.width = `${vol * 100}%`;
        updateVolumeIcon(vol);
    });

    searchInput.addEventListener('input', (e) => handleSearchInput(e.target.value));

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchView(link.dataset.view);
            if (link.dataset.view !== 'search') searchInput.value = '';
        });
    });

    navBack.addEventListener('click', () => navigateHistory(-1));
    navForward.addEventListener('click', () => navigateHistory(1));

    audio.addEventListener('ended', () => {
        if (repeatMode === 1 || repeatMode === 2) {
            audio.currentTime = 0;
            playSong();
        } else {
            nextSong();
        }
    });

    document.querySelector('.logo')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('home');
    });
}

function updateVolumeIcon(vol) {
    const icon = volumeIcon.querySelector('i');
    if (vol === 0) icon.className = 'fa-solid fa-volume-xmark';
    else if (vol < 0.5) icon.className = 'fa-solid fa-volume-low';
    else icon.className = 'fa-solid fa-volume-high';
}

function formatTime(seconds) {
    if (!seconds || Number.isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

init();
