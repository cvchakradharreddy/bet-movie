var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    
	$scope.movieList=[];
    $scope.cpuMovie={"title":"Processing..."};
    $scope.selectedMovie = "";
    $scope.result="";
    
    var page = 1;
    var pagelimit = 200; //though 1000 rows available, limited to 200 since locale storage limit exceeds
    var reqLimit = 40;
    
    (function triggerGame(){
        var list = JSON.parse(localStorage.getItem("movieList"));
        if(list){
            $scope.movieList = list;
            getCPUMovie(true);
        } else {
            getMovieList(page);
        }
    })();
	 
    function getCPUMovie(cache) {
       var cpuIndex = Math.floor((Math.random() * 200) + 1);
       $scope.cpuMovie = $scope.movieList[cpuIndex];
        if($scope.movieList){
            $scope.movieList.splice(cpuIndex, 1);
        } else {
            getMovieList(page);
        }
        if(!cache) {
            $scope.$apply(); 
        }     
    }
    
	function getMovieList(page) {
			$.get("https://api.themoviedb.org/3/discover/movie?api_key=05875cd50919223ef7db595c5c0743c4&page="+page, function(data, status){
		        if(status=="success"){
		        	for(var movie of data.results){
		        		$scope.movieList.push(movie);
		        	}
		        } 
		        if(page<pagelimit){
		        	if(page % reqLimit == 0){
                        if(((page/reqLimit)+2)*reqLimit==pagelimit){
                            $scope.cpuMovie={"title":"Almost done!"};
                            $scope.$apply();
                        } else if (((page/reqLimit)+1)*reqLimit==pagelimit){
                            $scope.cpuMovie={"title":"Ready"};
                            $scope.$apply();
                        }
                        page++;
			        	setTimeout(function(page){getMovieList(page);},2000, page);
		        	} else {
		        		page++;
			        	getMovieList(page);
		        	}
		        } else if(page==pagelimit){
                    localStorage.setItem("movieList", JSON.stringify($scope.movieList)); 
                    getCPUMovie(false);
                }	             
		    });
	}
    
    $scope.onSelectedMovie = function() {
        if($scope.selectedMovie.vote_average>=$scope.cpuMovie.vote_average){
            $scope.result="You Win!"
           } else {
                $scope.result="Oops! You lose!"
           }
    }
    
    $scope.refreshGame = function() {
        getCPUMovie(true);
        $scope.result = "";
        $scope.selectedMovie = "";
    }
});

