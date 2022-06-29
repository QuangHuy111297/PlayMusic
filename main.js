const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PlAYER_STORAGE_KEY = 'PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playlist = $(".playlist");
const cd = $('.cd')
const cdbg = $('.cd-bg')
const playBtn = $('.btn-toggle-play');
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [{
            name: "Đông Nhi",
            singer: "DN",
            path: "./assets/music/DoiMi.mp3",
            image: "./assets/img/DoiMi.png"
        },
        {
            name: "Hồng Thanh",
            singer: "HT-Mie",
            path: "./assets/music/DamCuoiNha.mp3",
            image: "./assets/img/DamCuoiNha.png"
        },
        {
            name: "1",
            singer: "fdsfewfwefw",
            path: "./assets/music/DamCuoiNha.mp3",
            image: "./assets/img/DamCuoiNha.png"
        },
        {
            name: "12",
            singer: "fdsfewfwefw",
            path: "./assets/music/DamCuoiNha.mp3",
            image: "./assets/img/DamCuoiNha.png"
        },
        {
            name: "13",
            singer: "fdsfewfwefw",
            path: "./assets/music/DamCuoiNha.mp3",
            image: "./assets/img/DamCuoiNha.png"
        },
        {
            name: "14",
            singer: "fdsfewfwefw",
            path: "./assets/music/DamCuoiNha.mp3",
            image: "./assets/img/DamCuoiNha.png"
        },
        {
            name: "15",
            singer: "fdsfewfwefw",
            path: "./assets/music/DamCuoiNha.mp3",
            image: "./assets/img/DamCuoiNha.png"
        },
        {
            name: "16",
            singer: "fdsfewfwefw",
            path: "./assets/music/DamCuoiNha.mp3",
            image: "./assets/img/DamCuoiNha.png"
        },
        {
            name: "17",
            singer: "fdsfewfwefw",
            path: "./assets/music/DamCuoiNha.mp3",
            image: "./assets/img/DamCuoiNha.png"
        }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                        <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>

                            <div class="spectrum-container ${index === this.currentIndex ? "active" : ""}">
                            <div class="spectrum"></div>
                            </div>

                        </div>
                    `;
        });
        playlist.innerHTML = htmls.join("");
    },

    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý cd rotate
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to thu nhỏ
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play 
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }


        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add("playing")
            cdbg.classList.add('active')
            $('.song.active .spectrum-container').classList.add('active')
            cdThumbAnimate.play()
        }

        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove("playing")
            cdbg.classList.remove('active')
            $('.song.active .spectrum-container').classList.remove('active')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig("isRandom", _this.isRandom)
            randomBtn.classList.toggle("active", _this.isRandom)
        }

        // Khi repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig("isRepeat", _this.isRepeat)
            repeatBtn.classList.toggle("active", _this.isRepeat)
        }

        // Next song khi end 1 bai
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest(".song:not(.active)")

            if (songNode || e.target.closest(".option")) {

                // Khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // Khi click vào option
                // if (e.target.closes('.option')) {

                // }
            }
        }


    },

    scrollToActiveSong: function() {
        setTimeout(function() {
            if ((app.currentIndex < 3)) {
                $(".song.active").scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                });
            } else {
                $(".song.active").scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
        }, 200);
    },

    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function() {
        this.currentIndex++
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },


    start: function() {
        // Gán cấu hình từ config vào object
        this.loadConfig()

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        // Lắng nghe và xử lý các sự kiện
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // Hiển thị trạng thái ban đầu của button random & repeat
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }

}

app.start()