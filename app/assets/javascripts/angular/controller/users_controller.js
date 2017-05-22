var myApp = angular.module('myapplication', ['ngRoute','ngResource']); 

//Factory
myApp.factory('Users', ['$resource',function($resource){
  return $resource('/users.json', {},{
    query: { method: 'GET', isArray: true },
    create: { method: 'POST' }
  })
}]);

myApp.factory('User', ['$resource', function($resource){
  return $resource('/users/:id.json', {}, {
    show: { method: 'GET' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  });
}]);

// ************Controllers for de demo ****************************

myApp.controller("UserListCtr", ['$scope', '$http', '$resource', 'Users', 'User', '$location', function($scope, $http, $resource, Users, User, $location) {

  $scope.users = Users.query();

  $scope.deleteUser = function (userId) {
    if (confirm("Seguro que desea eliminar el usuario?")){
      User.delete({ id: userId }, function(){
        $scope.users = Users.query();
        $location.path('/');
      });
    }
  };
}]);

myApp.controller("UserDetailCtr", ['$scope', '$http', '$resource', 'Users', 'User', '$location', function($scope, $http, $resource, Users, User, $location) {

  $scope.users = Users.query();
}]);

myApp.controller("UserUpdateCtr", ['$scope', '$resource', 'User', '$location', '$routeParams', function($scope, $resource, User, $location, $routeParams) {
  $scope.user = User.get({id: $routeParams.id})
  $scope.update = function(){
    if ($scope.userForm.$valid){
      User.update({id: $scope.user.id},{user: $scope.user},function(){
        $location.path('/');
      }, function(error) {
        console.log(error)
      });
    }
  };
  
  $scope.addAddress = function(){
    $scope.user.addresses.push({street1: '', street2: '', city: '', state: '', country: '', zipcode: '' })
  }

}]);

myApp.controller("UserAddCtr", ['$scope', '$resource', 'Users', '$location', function($scope, $resource, Users, $location) {
  $scope.user = {addresses: [{street1: '', street2: '', city: '', state: '', country: '', zipcode: '' }]}
  $scope.save = function () {
    if ($scope.userForm.$valid){
      Users.create({user: $scope.user}, function(){
        $location.path('/');
      }, function(error){
        console.log(error)
      });
    }
  }

  $scope.addAddress = function(){
    $scope.user.addresses.push({street1: '', street2: '', city: '', state: '', country: '', zipcode: '' })
  }

  $scope.removeAddress = function(index, user){
    var address = user.addresses[index];
    if(address.id){
      address._destroy = true;
    }else{
      user.addresses.splice(index, 1);
    }
  };

}]);


// ************ Routes definition for the demo  
 myApp.config([
  '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider.when('/users',{
      templateUrl: '/templates/users/index.html',
      controller: 'UserListCtr'
    });
    $locationProvider.hashPrefix('');
    $routeProvider.when('/users/new', {
      templateUrl: '/templates/users/new.html',
      controller: 'UserAddCtr'
    });
    $locationProvider.hashPrefix('');
    $routeProvider.when('/users/:id/edit', {
      templateUrl: '/templates/users/edit.html',
      controller: "UserUpdateCtr"
    });
    $locationProvider.hashPrefix('');
    $routeProvider.when('/users/:id/edit', {
      templateUrl: '/templates/users/detail.html',
      controller: "UserDetailCtr"
    });
    $locationProvider.hashPrefix('');
    $routeProvider.otherwise({
      redirectTo: '/users'
    });
  }
]);
