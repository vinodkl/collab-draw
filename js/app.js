var collabPaintApp = angular.module("collabDraw", ['ui.router']);
var socket = io.connect('http://localhost:8089');

collabPaintApp.config(function($stateProvider) {
	$stateProvider
		.state('login', {
			url: '/',
	        templateUrl: 'views/login.html',
	        controller: 'LoginCtrl'
		})
		.state('drawhome', {
			url: '/draw',
			templateUrl: 'views/draw.html',
	        controller: 'DrawPageCtrl'
		})
		// .otherwise('/')
});

collabPaintApp.controller("LoginCtrl", function($rootScope, $scope, $state) {
	$rootScope.users = [];
	$scope.doLogin = function(e) {
		if(!this.nick) {
			$scope.error = "Empty nickname";
		} else {
			$scope.error = null;
			$rootScope.currentUser = this.nick;
			socket.emit('message', {message: 'join:-' + this.nick});
			$state.transitionTo("drawhome");
		}
	}
});

collabPaintApp.controller("DrawPageCtrl", function($rootScope, $scope) {
	// $scope.onlineUsers = $rootScope.users;
	// console.debug($scope.onlineUsers);
	
});

collabPaintApp.directive('drawarea', function() {
	return {
		replace: true,
		link: function(element, scope) {
			var sketchpad = Raphael.sketchpad("editor", {
				width: $('.draw-container').width(),
				height: $(document).height() - 40,
				editing: true
			});

			sketchpad.change(function() {
				if(sketchpad.startDraw) {
					socket.emit('draw', {drawJson: (sketchpad.json())});
				}
			});

			socket.on('drawCords', function(data) {
				sketchpad.strokes(JSON.parse(data.drawJson));
			});
		},
		template: '<div class="area" id="editor"></div>'
	}
});