// JavaScript Document

var audio = document.getElementById("player");
function changeClass(elementid, add, remove){
	var temp = document.getElementById(elementid).className;
	temp = temp.replace(add, remove);
	document.getElementById(elementid).setAttribute('class', temp);
};
function addClass(elementid, nameclass){
	document.getElementById(elementid).className += " "+nameclass;
};
function play(event){
	document.getElementById("titlename").innerHTML = crntPlay.name + " - " + crntPlay.singer;
	document.getElementById("titlename").setAttribute('class', "fade");
	if(document.getElementById("button-play").classList.contains("pausetoplay")){
		changeClass("button-play", "pausetoplay", "playtopause");
		return;
	}
	if(!document.getElementById("button-play").classList.contains("playtopause"))
	{
		addClass("button-play", "playtopause");
		return;
	}
};
function pause(event){
	changeClass("button-play", "playtopause", "pausetoplay");
	return;
}
function menuevent(event){
	var sidebar = document.getElementById("sidebar");
	if(!sidebar.classList.contains("menu-invisible")&&!sidebar.classList.contains("menu-visible"))
	{
		addClass("sidebar", "menu-visible");
		addClass("header", "move");
		addClass("content", "move");
		addClass("footer", "move");
		return;
	}
	if(sidebar.classList.contains("menu-invisible"))
	{
		changeClass("sidebar", "menu-invisible", "menu-visible");
		changeClass("header", "moveback", "move");
		changeClass("content", "moveback", "move");
		changeClass("footer", "moveback", "move");
		return;
	}
	if(sidebar.classList.contains("menu-visible")){
		changeClass("sidebar", "menu-visible", "menu-invisible");
		changeClass("header", "move", "moveback");
		changeClass("content", "move", "moveback");
		changeClass("footer", "move", "moveback");
		return;
	}
};
function playercontrol(event){
	var audio = document.getElementById("player");
	if(audio.paused === true || audio.currentTime == 0){
		if(audio.duration> 0)
		{
			return audio.play();
		}
		else{
			var rand = Math.floor((Math.random()*musiclist.length));
			crntPlay = musiclist[rand];
			audio.setAttribute('src', musiclist[rand].url);
			return audio.play();
		}
	}
	else{
		return audio.pause();
	}
};

document.getElementById("content").addEventListener("click",function(event){
	var sidebar = document.getElementById("sidebar");
	var search = document.getElementById("search");
	if(sidebar.classList.contains("menu-visible")){
		menuevent();
	}
	if(search.classList.contains("searchshow")){
		search();
	};
});
audio.ontimeupdate =  function(){
	var percent  =  ((audio.currentTime/audio.duration)*100).toString();
	var e = document.getElementsByClassName("progress");
	e[0].style.width = percent+"%";
	document.title = crntPlay.name + "-" + crntPlay.singer;
};	
audio.addEventListener("pause", pause);
audio.addEventListener("playing", play);
audio.addEventListener("ended", function(event){
	if(repeat==false){
		if(shuffle==false){
			for(var i in musiclist)
			{
				if(musiclist[i].url == crntPlay.url && i!="0")
				{
					audio.pause();
					audio.setAttribute('src', musiclist[++i].url);
					crntPlay = musiclist[i];
					return audio.play();
				}
			}
		}
		else{
			var rand = Math.floor((Math.random()*musiclist.length));
			crntPlay = musiclist[rand];
			audio.setAttribute('src', musiclist[rand].url);
			return audio.play();
		}
	}
	else{
		audio.currentTime = 0;
		return audio.play();
	}
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./js/service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
	}
//ELEMENT.classList.remove("CLASS_NAME");


// xong result search, chỉ cần thêm div gần input search để đổ result xún là xong :D :v :V









	