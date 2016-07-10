angular.module('ItemsApp', [])

//filter
.filter('reverse',[function(){
    return function(string){
        return string.split('').reverse().join('');
    }
}])


//controller
.controller('MainCtrl', function($scope, $rootScope) {
    $scope.title = 'Hello Pluralsight';

  //update MainCtrl by adding a listener
  $rootScope.$on("item:added", function(event, item) {
    $scope.item = item;
  });
})


//service
.factory('ItemsService', function(){
  var is = {},
    _items = ['hat', 'book', 'pen'];

  is.get = function() {
    return _items;
  }

  return is;
})

//service with server-side promise
.factory('ItemsServiceServer', ['$http', '$q', function($http, $q){
  var is = {};
  is.get = function() {
    var deferred = $q.defer();
    $http.get('items.json') //'items.json will be mocked in the test'
    .then(function(response){
        deferred.resolve(response);
     })
    .catch(function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  }
  return is;
}])



//directive
.directive('userProfile', function(){
  return {
    restrict: 'E',
    template: '<div>{{user.name}}</div>',
    scope: {
        user: '=data'
    },
    replace: true
  };
})


//broadcaster
.factory("appBroadcaster", ['$rootScope', function($rootScope) {
  var abc = {};

  abc.itemAdded = function(item) {
    $rootScope.$broadcast("item:added",item);
  };

  return abc;
}])


;
