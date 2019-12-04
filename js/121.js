$(function () {
    var audio = $('#audio')[0];
    var songsId = [];
    var songDatail = [];
    var audioduration = 0;
    var url = 'https://music.163.com/song/media/outer/url?id=';

    var minutes = Math.floor(songDatail.dt / 1000 / 60);
    minutes = minutes >= 10 ? minutes : '0' + minutes;
    console.log(minutes)
    var seconds = Math.floor(songDatail.dt / 1000 % 60);
    seconds = seconds >= 10 ? seconds : '0' + seconds;

    // var da = localStorage.songs
    // if (da) {
    //     da = JSON.parse(da);
    //     songDatail = da.playlist.tracks.concat();
    //     //歌曲id

    //     for (var i = 0; i < da.privileges.length; i++) {
    //         songsId.push(da.privileges[i].id);
    //     }

    //     $('.list-mysong').text(songsId.length);
    // } else {
        //获取歌单
        $.ajax({
            type: 'GET',
            url: 'http://www.arthurdon.top:3000/top/list?idx=1',
            success: function (data) {
                console.log('data ==> ', data);
               
                // localStorage.setItem("songs", JSON.stringify(data))

                songDatail = data.playlist.tracks.concat();
                

                //歌曲id
                for (var i = 0; i < data.privileges.length; i++) {
                    songsId.push(data.privileges[i].id);
                }

                $('.list-mysong').text(songsId.length);

                // songsDetail(15, songsDetail);

            }
        })
    // }



    //保存歌曲id
    var previewIds = [];
    var startsIndex = 0;
    var endIndex = 15;



    // var $mask = $('.mask');
    // var maskWidth = $mask.width();

    // var progressWidth = $('.progress').width();

    // var minLeft = 0;
    // var maxLeft = progressWidth - maskWidth;

    // var $layer = $('.layer');

    // function move(e) {

    //     var x = e.targetTouches[0].pageX;

    //     console.log('x ==> ', x);
    //     var offsetLeft = $(this).offset().left;
    //     console.log('offsetLeft ==> ', offsetLeft);

    //     var left = x - offsetLeft - maskWidth / 2;

    //     left = left >= maxLeft ? maxLeft : left <= minLeft ? minLeft : left;

    //     $mask.css({
    //         left: left + 'px'
    //     })
    //     var w = x - offsetLeft;
    //     w = w >= progressWidth ? progressWidth : w <= 0 ? 0 : w;
    //     $('.progress-active').css({
    //         width: w + 'px'
    //     })
    // }

    // $layer.on('touchstart', function (e) {
    //     move.call(this, e);
    // })
    // $layer.on('touchmove', function (e) {

    //     move.call(this, e);
    // })

    // var audio = $("#audio")[0];

    // 获取时间
    function dealTime(time) {

        var minutes = Math.floor(time / 60);
        minutes = minutes >= 10 ? minutes : '0' + minutes;
        var seconds = Math.floor(time % 60);
        seconds = seconds >= 10 ? seconds : '0' + seconds;
        return minutes + ":" + seconds;
    }

    var duration = 0;
    var $progress = $('#progress');
    var max = $progress.attr('max');

    var value = $progress.val();
    var percent = value / max;
    var t = percent * duration;





    $(".list ul li").one("click", function () {

        $(".local-list").css({
            display: "block"
        });
        $(".box,.myself").hide();

        if (previewIds.length == 0) {
            previewIds = previewIds.concat(songsId.slice(startsIndex, endIndex));
            startsIndex = endIndex;
            endIndex += endIndex;
        }


        for (var i = 0; i < previewIds.length; i++) {
            var $lis = $(`<li class="" name="0" data-id = '${songDatail[i].id}' data-img = '${songDatail[i].al.picUrl}' data-dt = '${songDatail[i].dt/1000}'>
                                    <div class="fl">
                                        <img src="${songDatail[i].al.picUrl}" alt="">
                                    </div>
                                    <div class="lh fl ">
                                        <div class="st local-songname nowrap">${songDatail[i].name}</div>
                                       
                                    </div>
                                    <div class="local-play fr">
                                      
                                        <span class="iconfont icon-liebiao-dian f15"></span>
                                    </div>
                                </li>`)

            var singer = [];
            for (var j = 0; j < songDatail[i].ar.length; j++) {
                singer.push(songDatail[i].ar[j].name)
            }

            var $singers = $(`<div class="sn local-singer nowrap">${singer.join(' / ')}</div>`);

            $lis.find('.lh').append($singers);
            $(".current-list").append($lis);

        }
        console.log(previewIds)


    })
    $(".current-list").on("click", "li", function () {

        $(".words-box>p").text('')
        var songid = $(this).data("id");
        $(this).addClass('active').siblings().removeClass('active');

        if (songid == $(audio).attr('name')) {
            //播放同一首歌曲
            if ($(this).attr('name') == 0) {
                //播放
                $(".playing").removeClass("icon-play").addClass("icon-zantingbofang")
                // $(".playing").data("name", 1);
                $(this).attr('name', 1);
                $(".liPlay").removeClass("icon-play").addClass("icon-zantingbofang")


                audio.play();

            } else {
                //停止
                $(this).attr('name', 0);
                $(".playing").removeClass("icon-zantingbofang").addClass("icon-play");
                // $(".playing").data("name", 0);
                $(".liPlay").removeClass("icon-zantingbofang").addClass("icon-play")


                audio.pause();

            }

        } else {
            $(audio).attr('name', songid);

            audio.src = 'https://music.163.com/song/media/outer/url?id=' + songid;
        }


    })


    //总时间
    // duration = audio.duration;
    // $('#duration').text(ctrlTime(duration));

    audio.oncanplay = function () {
        // duration = this.duration;
        // $('#duration').text(ctrlTime(duration));

        var $liactive = $(".active")
        var self = this

        //获取歌词
        var lyricid = $liactive.data("id")
        $.ajax({
            type: "GET",
            url: 'http://www.arthurdon.top:3000/lyric?id=' + lyricid,
            success: function (data) {

                var lyric = data.lrc.lyric.split(/[\n\r]+/)
                $(".words-box").empty()
                for (var i = 0; i < lyric.length; i++) {
                    var lyr = lyric[i].split("]")
                    var lyrtext = lyr[1];

                    if (lyrtext) {

                        //歌词文本 时刻
                        var time = lyr[0].slice(1).split(":");
                        var second = Number(time[0]) * 60 + Number(time[1])

                        var $p = $(`<p data-time="${second}">${lyrtext}</p>`);

                        $(".words-box").append($p)

                    }


                }
                self.play();

                audioduration = this.duration

                console.log($('.active'))

                $(".dtime").text(dealTime(self.duration))

                $("li.active").attr("name", 1);
                var $divs = $(".title>div");
                $divs.eq(0).text($liactive.find(".st").text());
                $divs.eq(1).text($liactive.find(".sn").text());
                $divs.eq(2).text($liactive.find(".st").text());
                $divs.eq(3).text($liactive.find(".sn").text());


                var $ps = $(".song>p");
                $ps.eq(0).text($liactive.find(".st").text());
                $ps.eq(1).text($liactive.find(".sn").text());

                $(".play-img").find("img").attr("src", $liactive.data("img"));
                $(".album").find("img").attr("src", $liactive.data("img"));

            }
        })

        $(".liPlay").removeClass("icon-play").addClass("icon-zantingbofang")

        $(".album>img").css({
            animation: 'rotation 20s linear 0s infinite'
        });
    }

    // var isChange = false;
    // $progress.on('change', function () {
    //     var value = $(this).val();
    //     var percent = value / max;


    //     //设置音频当前播放时间
    //     audio.currentTime = duration * percent;

    //     isChange = false;
    // })


    var progressWidth = $('.m-progress').width();
    var $mMask = $('.m-mask');
    var mMaskWidth = $mMask.width();

    var wordsBoxTop = parseFloat($(".words-box").css("top"))
    // 实时监听变化
    audio.ontimeupdate = function () {
        var $pps = $(".words-box>p");
        var $height = $pps.height()

        $(".ctime").text(dealTime(this.currentTime));
        // console.log(audioduration)
        //移动进度
        var x = this.currentTime / $(".active").data("dt") * (progressWidth - mMaskWidth);
        console.log(x)
        var minLeft = 0;
        var maxLeft = progressWidth - mMaskWidth;
        var left = x <= minLeft ? minLeft : x >= maxLeft ? maxLeft : x;
        $('.m-mask').css({
            left: left + +"px"
        })
        $(".m-progress-active").css({
            width: x + "px"
        })

        //移动歌词
        for (var i = 0; i < $pps.length; i++) {
            //获取当前的p和下一个p元素
            var currentTime = $pps.eq(i).data('time');
            var nextTime = $pps.eq(i + 1).data('time');

            if (i + 1 == $pps.length) {
                nextTime = Number.MAX_VALUE;
            }

            if (audio.currentTime >= currentTime && audio.currentTime <= nextTime) {

                $pps.eq(i).addClass('songactive');
                $('.words-box').animate({
                    top: wordsBoxTop - $height * i + 'px'
                }, 0)
                if (i - 1 >= 0) {
                    $pps.eq(i - 1).removeClass('songactive');
                }



                break;
            }

        }




        // $("play-img>img").src()
        // var $aa = $("progress-active")

        // console.log($mask)
        // if (!isChange) {
        //     var currentTime = this.currentTime;
        //     $('#currentTime').text(ctrlTime(currentTime));
        //     var percent = currentTime / duration;
        //     console.log(max)
        //     $aa.css({
        //         left: percent * max + "%"
        //     });
        //     $mask.css({
        //         left: percent * max + "%"
        //     });

    }

    //点击进度条
    $('.m-event-progress').on('touchstart', function (e) {
        // $(window).width()
        var x = e.touches[0].pageX;
        console.log(x)
        var minLeft = 0;
        var maxLeft = progressWidth - mMaskWidth;
        var left = x <= minLeft ? minLeft : x >= maxLeft ? maxLeft : x;
        $('.m-mask').css({
            left: left + "px"
        })
        $(".m-progress-active").css({
            width: e.touches[0].pageX + "px"
        })
        audio.currentTime = x / progressWidth * $(".active").data("dt")
    })
    // 播放完成
    audio.onended = function () {
        console.log('finished');
    }


    // $('.playing').on('click', function () {
    //     if ($(this).data('name') == 0) {
    //         //播放

    //         $(this).removeClass("icon-play").addClass("icon-zantingbofang");
    //         // $(".play .play-fr .icon-play").removeClass("icon-play").addClass("icon-zantingbofang");
    //         $(this).data("play", 1);
    //         $(".album>img").css({
    //             animation: 'rotation 20s linear 0s infinite'
    //         });
    //         audio.play();

    //     } else {
    //         //停止

    //         $(this).removeClass("icon-zantingbofang").addClass("icon-play");
    //         $(this).data("play", 0);
    //         // $(".play .play-fr .icon-zantingbofang").removeClass("icon-zantingbofang").addClass("iconfont icon-play f17");


    //         $(".album>img").css({
    //             animation: 'rotation 20s linear 0s infinite',
    //             animationPlayState: "paused"
    //         });
    //         audio.pause();
    //     }
    // })



    $(".play .play-fr .icon-play").on("click", function () {
        if ($(this).data('play') == 0) {
            $(this).removeClass().addClass("iconfont icon-zantingbofang f17");
        }
    })



    //循环播放
    $(".mode").on("click", function () {
        var min = $(this).data('min');
        var max = $(this).data('max');
        var value = $(this).data('value');

        if (value == 3) {
            value = min;
            $(this).data('value', min);
        } else {
            $(this).data('value', ++value);
        }

        $(this).css({
            background: 'url("./img/' + value + '.png") no-repeat center center',
            backgroundSize: "cover"

        })

    })
    // var iconArr = ['icon-danquxunhuan', 'icon-xunhuan','icon-suijibofang' ]
    // var k = 0;
    // $(".icon-suijibofang").on("click", function () {
    //     k++;

    //     if (k == 3) {

    //         k = 0;
    //         $(this).removeClass().addClass("iconfont " + iconArr[k] + " f35");
    //     } else {

    //         console.log(k);

    //         $(this).removeClass().addClass("iconfont " + iconArr[k] + " f35");
    //     }

    // })

    //主页暂停播放
    // 1单曲  2列表  3随机
    // $(".player").on("click", function () {
    //     var liactive = $(".active");
    //     if (liactive.length == 0) {
    //         var mode = $(".mode").data("value");
    //     } else {
    //         var name = liactive.attr("name");
    //         if (name == 0) {

    //             $(this).removeClass("icon-play").addClass("icon-zantingbofang")
    //             audio.play()
    //         } else {
    //             $(this).removeClass("icon-zantingbofang").addClass("icon-play")
    //             audio.pause()
    //         }
    //     }

    // })



    //上一首
    $('.icon-yduishangyiqu').on('click', function () {

        var $activeLi = $('.active');
        var $lis = $('.local-song li');

        //如果不存在，随机播放
        if ($activeLi.length == 0) {

            var mode = $('.mode').data('value');

            var $li = null;
            if (mode == 1 || mode == 2) {
                $li = $lis.eq(0);
            } else if (mode == 3) {
                $li = $lis.eq(Math.floor(Math.random() * $lis.length));
            }

            var id = $li.data('id');
            audio.src = url + id;
            // $animate = $li.find('.animate');
            $li.addClass('active');
            $(audio).attr('name', id);
        } else {
            //如果存在被点击播放的音乐
            var index = $activeLi.index();
            var $thisLi = $lis.eq(index);
            console.log('index ==> ', index);

            //根据模式选择播放
            var mode = $('.mode').data('value');
            if (mode == 1 || mode == 2) {

                if (index == 0) {
                    index = $lis.length - 1;
                } else {
                    index--;
                }

            } else if (mode == 3) {

                index = Math.floor(Math.random() * $lis.length);
            }

            $thisLi.removeClass();
            if ($thisLi.attr('name') == 1) {
                $thisLi.attr('name', 0).find('.line').css({
                    animationPlayState: 'paused'
                })
            }

            var $cLi = $lis.eq(index);
            var id = $cLi.data('id');
            audio.src = url + id;
            // $animate = $cLi.find('.animate');
            $cLi.addClass('active');
            $(audio).attr('name', id);

        }

    })
    $('.icon-yduixiayiqu').on('click', function () {
        var $activeLi = $('.active');

        var $lis = $('.local-song li');

        //如果不存在，随机播放
        if ($activeLi.length == 0) {
            //根据播放模式选择歌曲
            //<!-- 1: 单曲循环，2：列表循环 ，3：随机播放 -->
            //获取模式
            var mode = $('.mode').data('value');

            var $li = null;
            if (mode == 1 || mode == 2) {
                $li = $lis.eq(0);
            } else if (mode == 3) {
                $li = $lis.eq(Math.floor(Math.random() * $lis.length));
            }

            var id = $li.data('id');
            audio.src = url + id;
            // $animate = $li.find('.animate');
            $li.addClass('active');
            $(audio).attr('name', id);
        } else {
            //如果存在被点击播放的音乐
            var index = $activeLi.index();
            var $thisLi = $lis.eq(index);
            console.log('index ==> ', index);

            //根据模式选择播放
            var mode = $('.mode').data('value');
            if (mode == 1 || mode == 2) {

                if (index == $lis.length - 1) {
                    index = 0;
                } else {
                    index++;
                }

            } else if (mode == 3) {

                index = Math.floor(Math.random() * $lis.length);
            }

            $thisLi.removeClass();
            if ($thisLi.attr('name') == 1) {
                $thisLi.attr('name', 0).find('.line').css({
                    animationPlayState: 'paused'
                })
            }

            var $cLi = $lis.eq(index);
            var id = $cLi.data('id');
            audio.src = url + id;
            // $animate = $cLi.find('.animate');
            $cLi.addClass('active');
            $(audio).attr('name', id);

        }

    })



    //点击收藏
    $(".icon-like").on("click", function () {
        if ($(this).hasClass("iconfont icon-like")) {
            $(this).removeClass("icon-like").addClass("iconfont icon-aixin")
        } else {
            $(this).removeClass("iconfont icon-aixin").addClass("iconfont icon-like")
        }
    })

    //个人页面
    $(".icon-xiangzuo").on("click", function () {
        $(".box").hide();
        $(".myself").css({
            display: "block"
        });


    })



    $(".list ul li").on("click", function () {
        $(".local-list").css({
            display: "block"
        });
        $(".box,.myself").hide();
    })
    $(".icon-houtui").on("click", function () {
        $(".myself").show();
        $(".box,.local-list").hide();
    })

    $(".play .play-img").on("click", function () {
        $(".myself,.local-list").hide();
        $(".box").show();
    })

    $(".album>img").on("click", function () {

        // if ($(this).show()) {
        $(this).hide();
        $(".words").show();

    })
    $(".words").on("click", function () {
        $(this).hide()
        $(".album>img").show()
    })

    $(".liPlay").on("click", function () {
        var $liActive = $(".active");
        var name = $liActive.attr("name");
        if (name == 0) {

            $(this).removeClass("icon-play").addClass("icon-zantingbofang");

            $(".album>img").css({
                animation: 'rotation 20s linear 0s infinite'
            });
            $liActive.attr("name", 1)
            audio.play();
        } else {

            $(this).removeClass("icon-zantingbofang").addClass("icon-play");

            $(".album>img").css({
                animation: 'rotation 20s linear 0s infinite',
                animationPlayState: "paused"
            });
            $liActive.attr("name", 0)
            audio.pause();

        }
    })





})