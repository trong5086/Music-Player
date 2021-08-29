const $=document.querySelector.bind(document)
const $$=document.querySelectorAll.bind(document)
var playList=$('.playlist')
var cd=$('.cd');
var cdThumb=$('.cd-thumb');
const heading=$('header h2')
const audio=$('#audio')
const playBtn=$('.btn-toggle-play')
const player=$('.player')
const progress=$('.progress')
const nextBtn=$('.btn-next')
const prevBtn=$('.btn-prev')
const randomBtn=$('.btn-random')
const repeatBtn=$('.btn-repeat')

const app={
    currentIndex:0,
    isPlaying:false,
    isRandom:false,
    isReplay:false,
    songs:[
    {
        name:'Ghé Qua' ,
        singer:'Dick, Tofu, PC',
        path:'./assets/music/GheQua-DickTofuPC-5308038.mp3',
        image:'./assets/img/ghequa.jpg'
    },
    {
        name:'At My Worst' ,
        singer:'Pink Sweat$',
        path:'./assets/music/At My Worst.mp3',
        image:'./assets/img/atmyworst.jpg'
    },
    {
        name:'Mười Ngàn Năm' ,
        singer:'PC,Duckie',
        path:'./assets/music/MuoiNganNam-PCDuckie-6183024.mp3',
        image:'./assets/img/10ngannam.jpg'
    },
    {
        name:'Em Dạo Này' ,
        singer:'Ngọt',
        path:'./assets/music/Em-Dao-Nay-Ngot.mp3',
        image:'./assets/img/emdaonay.jpg'
    },
    {
        name:'Bartender' ,
        singer:'Ngọt',
        path:'./assets/music/Bartender-Ngot.mp3',
        image:'./assets/img/bartender.jpg'
    },
    {
        name:'Em À' ,
        singer:'Xám, Ngọc Dolil',
        path:'./assets/music/EmA1-XamBCTMNgocDolil-7005224.mp3',
        image:'./assets/img/ema.jpg'
    },
    
    ],
    renderListSong:function(){
       const htmls=this.songs.map(function(song,index){
            return `
            <div class="song ${index===this.currentIndex?'active':''}" data-index='${index}' ">
                <div class="thumb" style="background-image: url('${song.image}')">
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
         })
         playList.innerHTML = htmls.join('')
    },
    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get :function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong:function(){
       cdThumb.style.backgroundImage=`url('${this.currentSong.image}')`
       heading.textContent=this.currentSong.name;
       audio.src=this.currentSong.path
       if ($('.song.active')) 
        {
         $('.song.active').classList.remove('active');
        }
         $$('.song')[app.currentIndex].classList.add('active')
    },
    // next song
    nextSong:function(){
        this.currentIndex++;
        if(this.currentIndex>=this.songs.length)
        {
            this.currentIndex=0;
        }
        this.loadCurrentSong()
        this.scrollToActiveSong()
    },
    //prev song
    prevSong:function(){
        this.currentIndex--;
        if( this.currentIndex<0){
            this.currentIndex=this.songs.length-1
        }
        this.loadCurrentSong()
        this.scrollToActiveSong()
    },
    scrollToActiveSong:function(){
        if(this.currentIndex<2){
            setTimeout(function(){
                    $('.song.active').scrollIntoView({
                        behavior: 'smooth',
                        block:'end'
                    })
            },500)
        }else{
            setTimeout(function(){
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block:'center'
                })
        },500)
        }
    },
    handleEvent(){
        const _this=this;
        cdWidth=cd.offsetWidth;
        //Xử lý quay đĩa
        const cdThumbAnimate=cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration:10000,
            iterations:Infinity,
        })
        cdThumbAnimate.pause()
        //rê chuột thu nhỏ cd 
        document.onscroll=function(){
            const scrollTop=window.scrollY||document.documentElement.scrollTop;
            const newCdWidth=cdWidth-scrollTop
            cd.style.width=newCdWidth>0?newCdWidth+'px':0
            cd.style.opacity=newCdWidth / cdWidth
        }
        // play / pause nhạc
        playBtn.onclick=function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        //Xử lí nhạc đang chạy
        audio.onplay=function(){
            _this.isPlaying=true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //Xử lí nhạc pause
        audio.onpause=function(){
            _this.isPlaying=false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //xử lí khi tiến độ bài hát thay đổi
        audio.ontimeupdate=function(){
            if(audio.duration){
                var currentProgressPercent=Math.floor(audio.currentTime/audio.duration*100)
                progress.value=currentProgressPercent
            }
            
        }
        // Xử lí khi tua song
        progress.oninput=function(e){
            seekTime=audio.duration/100 *e.target.value
            audio.currentTime=seekTime
        }
        // xử lí next song mới
        nextBtn.onclick=function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong();
            }
            audio.play();
        }
        prevBtn.onclick=function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.prevSong();
            }
            audio.play();
        }
        //Xử lí khi ấn vào nút random 
        randomBtn.onclick=function(){
            _this.isRandom=!_this.isRandom
            randomBtn.classList.toggle("active",_this.isRandom)
        }
         //Xử lí khi ấn vào nút repeat 
         repeatBtn.onclick=function(){
            _this.isReplay=!_this.isReplay
            repeatBtn.classList.toggle("active",_this.isReplay)
        }
        //Xử li khi hết bài hát
        audio.onended=function(){
            if(_this.isReplay){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
        //Xử lí phát nhạc khi click vào song
        playList.onclick=function(e){
           const songNode=e.target.closest('.song:not(.active)')
           if(!e.target.closest('.option')){
               if(songNode)
               {
                   _this.currentIndex=Number(songNode.dataset.index);
                   _this.loadCurrentSong();
                   audio.play();
               }
            
           }
        }
    },
    randomSong:function(){
        var newIndex;
        do{
            newIndex=Math.floor(Math.random()*this.songs.length)
        }while(newIndex===this.currentIndex|| arrayOfSongsPlayed.some(function(arrayOfSongPlayed){
            return newIndex===arrayOfSongPlayed
        }))
        this.currentIndex=newIndex;
        arrayOfSongsPlayed.push(this.currentIndex)
        console.log(arrayOfSongsPlayed)
        if(arrayOfSongsPlayed.length>=this.songs.length){
            arrayOfSongsPlayed=[]
        }
        this.loadCurrentSong();
    },
    start:function(){
        //Render danh sách bài hát
        this.renderListSong();
        // Xử lí sự kiện 
        this.handleEvent();
        // định nghĩa thuộc tính
        this.defineProperties();
        // load bài hát hiện tại
        this.loadCurrentSong();
    }
}

var arrayOfSongsPlayed=[app.currentIndex]
app.start()
