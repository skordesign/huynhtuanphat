var crntPlay;
var musiclist;
var result;
var app = angular.module("app",[]);
var shuffle = false;
var repeat = false;

app.controller("load", function($scope, $http){
	$scope.loading=true;
	$http.get("https://skormusic.firebaseio.com/music.json").then(function(respone)
	{
		$scope.musics = respone.data;
		musiclist = Object.keys(respone.data).map(function(key)
		{
			return respone.data[key];
		});
	},
	function(err){	
		$scope.loading=true;
		document.getElementById("thongbao").style.display="block";
	})
	.finally(function(status){
		$scope.loading = false;
	})
	.catch(function(error){
	});
	$scope.choose = function($event, music){
		var audio = document.getElementById("player");
		audio.pause();
		audio.setAttribute('src', music.url);
		crntPlay = music;
		return audio.play();
	}
	$scope.space = " - ";
});
app.controller("musicCtrl", function($scope){
	var audio = document.getElementById("player");
	$scope.previous = function($event){
		if(repeat==false){
			if(shuffle==false){
				for(var i in musiclist)
				{
					if(musiclist[i].url == crntPlay.url && i!="0")
					{
						audio.pause();
						audio.setAttribute('src', musiclist[--i].url);
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
	};
	$scope.next = function($event){
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
			return audio.play();
		}
	};
	$scope.play = function($event){
		play(event);
		playercontrol(event);
	};
	$scope.shuffle = function($event){
		shuffle = !shuffle;
		if(shuffle==false){
			$scope.shufflestyle = "url(../assets/Shuffle-000000.svg) center center no-repeat";
			
		}
		else{
			$scope.shufflestyle = "url(../assets/Shuffle-ffffff.svg) center center no-repeat";
			
		}
	}
	$scope.repeat = function($event){
		repeat = !repeat;
		if(repeat==false){
			$scope.repeatstyle = "url(../assets/Repeat-000000.svg) center center no-repeat";
		}
		else{
			$scope.repeatstyle = "url(../assets/Repeat-ffffff.svg) center center no-repeat";
		}
	};
});

app.controller('search', function($scope){
	$scope.keyupsearch = function($event){
		$scope.searchvisible = false;
		var scan = $scope.string.toLowerCase();
		$scope.results = [];
		$scope.iconbl = "url(../assets/icon-ffffff.svg) center center no-repeat";
		angular.forEach(musiclist, function(item){
            if(scan!=""){
            	if(item.name.toLowerCase().indexOf(scan) !== -1){
            		$scope.results.push(item);
     		   }
            }
            else{
            	return results = [];
            }
        });
        console.log($scope.results);
        if($scope.results.length>0){
        	$scope.searchvisible = true;
        }
        else{
        	$scope.searchvisible = false;
        }
        return $scope.results;
	};
	$scope.menu = function($event){
		menuevent(event);
	};
	$scope.choose = function($event, repeat){
		var audio = document.getElementById("player");
		audio.pause();
		audio.setAttribute('src', repeat.url);
		crntPlay = repeat;
		$scope.results = [];
		document.getElementById("searchinput").value = "";
    	$scope.searchborderstyle = "";
		return audio.play();
	};
	$scope.space = " - ";
});