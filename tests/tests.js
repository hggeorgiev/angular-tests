

//Testing a filter
describe('Testing reverse filter',function(){
    var reverse;
    beforeEach(function(){
      module('ItemsApp');
      inject(function($filter){ //initialize your filter
        reverse = $filter('reverse',{});
     });
    });


    it('Should reverse a string', function(){
        expect(reverse('rahil')).toBe('lihar');
        expect(reverse('don')).toBe('nod');
        //expect(reverse('jam')).toBe('oops'); // this test should fail
    });
});



//Testing a controller
describe('Testing a Hello Pluralsight controller', function() {
  var $controller;

  // Setup for all tests
  beforeEach(function(){
    // loads the app module
    module('ItemsApp');
    inject(function(_$controller_){
      // inject removes the underscores and finds the $controller Provider
      $controller = _$controller_;
    });
  });

  // Test (spec)
  it('should say \'Hello World\'', function() {
    var $scope = {};
    // $controller takes an object containing a reference to the $scope
    var controller = $controller('MainCtrl', { $scope: $scope });
    // the assertion checks the expected result
    expect($scope.title).toEqual('Hello Pluralsight');
  });

  // ... Other tests here ...
});


describe('Testing Languages Service', function(){
  var LanguagesService;

  beforeEach(function(){
    module('ItemsApp');
    inject(function($injector){
      ItemsService = $injector.get('ItemsService');
    });
  });

  it('should return all items', function() {
    var items = ItemsService.get();
    expect(items).toContain('hat');
    expect(items).toContain('book');
    expect(items).toContain('pen');
    expect(items.length).toEqual(3);
  });
});



//Testing a directive
describe('Testing user-profile directive', function() {
  var $rootScope, $compile, element, scope;

  beforeEach(function(){
    module('ItemsApp');
    inject(function($injector){
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      element = angular.element('<user-profile data="user"></user-profile>');
      scope = $rootScope.$new();
      // wrap scope changes using $apply
      scope.$apply(function(){
        scope.user = { name: "John" };
        $compile(element)(scope);
      });
    });
  });

  it('Name should be rendered', function() {
    expect(element[0].innerText).toEqual('John');
  });
});


//Testing a promise
describe('Testing Items Service - server-side', function(){
  var ItemsServiceServer,
    $httpBackend,
    jsonResponse = ['hat', 'book', 'pen'];//this is what the mock service is going to return

  beforeEach(function(){
    module('ItemsApp');
    inject(function($injector){
       ItemsServiceServer = $injector.get('ItemsServiceServer');
      // set up the mock http service
      $httpBackend = $injector.get('$httpBackend');

      // backend definition response common for all tests
      $httpBackend.whenGET('items.json') //must match the 'url' called by $http in the code
        .respond( jsonResponse );
    });
  });

  it('should return all items', function(done) {
    // service returns a promise
    var promise = ItemsServiceServer.get();
    // use promise as usual
    promise.then(function(items){
      // same tests as before
      expect(items.data).toContain('hat');
      expect(items.data).toContain('book');
      expect(items.data).toContain('pen');
      expect(items.data.length).toEqual(3);
      // Spec waits till done is called or Timeout kicks in
      done();
    });
    // flushes pending requests
    $httpBackend.flush();
  });
});



//Testing an event
describe("appBroadcaster", function() {
    var appBroadcaster, $rootScope, $scope, $controller,
      item = { name: "Pillow", id: 1 };//what is going to be broadcast

    beforeEach(function() {
      module("ItemsApp");
      inject(function($injector) {
          appBroadcaster = $injector.get("appBroadcaster");//get the service
          $rootScope = $injector.get("$rootScope");//get the $rootScope
          $controller = $injector.get('$controller');
          $scope = $rootScope.$new();
      });
      spyOn($rootScope, '$broadcast').and.callThrough();//spy on $rootScope $broadcast event
      spyOn($rootScope, '$on').and.callThrough();//spy on $rootScope $on event
    });

    it("should broadcast 'item:added' message", function() {
        // avoid calling $broadcast implementation
        $rootScope.$broadcast.and.stub();
        appBroadcaster.itemAdded(item);
        expect($rootScope.$broadcast).toHaveBeenCalled();//check if there was a broadcast
        expect($rootScope.$broadcast).toHaveBeenCalledWith("item:added", item);//check if the broadcasted message is right
    });

    it("should trigger 'item:added' listener", function() {
        // instantiate controller
        $controller('MainCtrl', { $scope: $scope });
        // trigger event
        appBroadcaster.itemAdded(item);//pass the item variable for broadcasting
        expect($rootScope.$on).toHaveBeenCalled();
        expect($rootScope.$on).toHaveBeenCalledWith('item:added', jasmine.any(Function));
        expect($scope.item).toEqual(item);//match the broadcasted message with the received message
    });
});
