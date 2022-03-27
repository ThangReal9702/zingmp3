const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'Thang_Player'

const cd = $('.cd')

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')

const player = $('.player')
const playBtn = $('.btn-toggle-play')

const progress = $('#progress')

const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')

const randomBtn = $('.btn-random')

const repeatBtn = $('.btn-repeat')

const playlist = $('.playlist')
// this tro ve app obj  
const app = {

    currentIndex: 0,
    isPlaying :false,
    isRandom : false,
    isRepeat :false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    
    // lay ra bai hat  
    songs: [
        {
            name:'Be What You Wanna Be',
            singer: 'Darin',
            path: 'acsset/music/Be What You Wanna Be.mp3',
            image: 'acsset/img/img-music4.jpg'
        },
        
        {
            name:'Hall Of Fame',
            singer: 'The Script',
            path: 'acsset/music/Hall Of Fame.mp3',
            image: 'acsset/img/img.jpg'
        },
        {
            name:'Halo',
            singer: 'Beyonce',
            path: 'acsset/music/Halo.mp3',
            image: 'acsset/img/img2.jpg'
        },
        {
            name:'On Top Of The World',
            singer: 'Imagine Dragon',
            path: 'acsset/music/On Top Of The World.mp3',
            image: 'acsset/img/img-music4 (2).jpg'
        },
        {
            name:'Sign Of The Times',
            singer: 'Harry Style',
            path: 'acsset/music/Sign Of The Times.mp3',
            image: 'acsset/img/img-music5.jpg'
        },
        {
            name:'Superheroes',
            singer: 'The Script',
            path: 'acsset/music/Superheroes.mp3',
            image: 'acsset/img/img3.jpg'
        },
        {
            name:'The Champion',
            singer: 'Carrie Underwood',
            path: 'acsset/music/The Champion.mp3',
            image: 'acsset/img/img-music7.jpg'
        }
    ],

    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function(){
        const htmls = this.songs.map((song,index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
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
                </div>
            `
        });
        playlist.innerHTML = htmls.join('');
    },

    // dinh nghia cac thuoc tinh 
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        });
        
    },

    // xu lý các cái sự kiện 
    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth
        // const cd = $('.cd')

        // xu ly quay dia nhac ,an pause thi pause ,an play thi play 
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(-360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // xu ly phong to hoac thu nhor dia cd
        document.onscroll = function(){
            // tinh kich thuoc cua cai dia CD 
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            // tinh kich thuoc de an thang CD 
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth 
        }

        // xu ly khi click play 
        playBtn.onclick = function(){
            if(_this.isPlaying){
                _this.isPlaying = false
                audio.pause()
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }
            else{
                _this.isPlaying = true
                audio.play()
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
        }

        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // khi tien do bai hat thay doi 
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent
            }
        }

        // xu ly khi tua bai hat 
        progress.onchange = function(e){
            const seekTime = ( e.target.value * audio.duration ) / 100; 
            audio.currentTime = seekTime
        }

        // xu li next bai hat 
        nextBtn.onclick = function(){
            // player.classList.add('playing')
            cdThumbAnimate.play()
            _this.nextSong();
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong
            }
            audio.play();
            _this.render()
            _this.scrollToActiveSong()
        }

        // xu ly khi lui bai hat 
        prevBtn.onclick = function(){
            // player.classList.add('playing')
            cdThumbAnimate.play()
            _this.prevSong();
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong
            }
            audio.play();
            _this.render()
            _this.scrollToActiveSong()
        }

        //xu ly random bai hat 
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
        }

        //xu ly lap lai bai hat
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }

        // xu ly next song khi ended 
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }

        // xu ly click bat ki 1 bai hat 
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active')
            if(songNode || e.target.closest('.option') ){
                
                // xu ly khi click vao song 
                if(songNode){
                    _this.currentIndex = Number(songNode.getAttribute('data-index'));
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                //xu ly click khi vao song option

            }
        }
    },

    // active song khi next ,prev bai hat 
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:"smooth",
                block: "nearest"
            })
        },300)
    },

    // phat bai hat hien tai 
    loadCurrentSong: function(){
        // const heading = $('header h2')
        // const cdThumb = $('.cd-thumb')
        // const audio = $('#audio')

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        // console.log(heading,cdThumb,audio)
    },

    //next song 
    nextSong : function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },

    //load config luu cai dat
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    // nguoc lai song 
    prevSong : function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong();
    },

    //play random song 
    playRandomSong : function(){
        let newIndex 
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong
    },

    start: function(){
        // load cau hinh cai dat vao app
        this.loadConfig();

        // dinh nghia cac thuoc tinh cho obj 
        this.defineProperties();
        
        // lang nghe va xu ly cac su kien 
        this.handleEvents();

        // tai thong tin bai hat dau tien vao giao dien khi chay app 
        this.loadCurrentSong();

        // render playlist 
        this.render();

        //hien thi trang thai ban dau cua button repeat va random
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)
    }
};

app.start();