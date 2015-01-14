angular.module('flapperNews', [])
	.factory('posts', [function(){
		// service body
		var o {
			posts: []
		};
		return o;
	}])

angular.module('flapperNews', [])
	.controller('MainCtrl', [
				'$scope',
				'posts',
		function($scope){

		 	$scope.posts = posts.posts;

			$scope.incrementUpvotes = function(post) {
				post.upvotes += 1;
			};

			$scope.addPost = function(){
				if (!$scope.title || $scope.title === '') { return; }

				$scope.posts.push({
					title: $scope.title,
					link: $scope.link,
					upvotes: 0
				});

				$scope.title = '';
				$scope.link = '';
			};
		}
	]);

