var assert = require('assert');
var should = require('should');
var requireFrom = require('requirefrom');
var sUTDirectory = requireFrom('post/nodejsAsynchronicityAndCallbackNesting');
var nestedCoffee = sUTDirectory('nestedCoffee');
var eventEmittedCoffee = sUTDirectory('eventEmittedCoffee');
var asyncCoffee = sUTDirectory('asyncCoffee');
var promisedCoffee = sUTDirectory('promisedCoffee');

describe('nodejsAsynchronicityAndCallbackNesting post integration test suite', function () {
   // if you don't want to wait for the machine to heat up assign minutes: 2.
   var minutes = 2;
   this.timeout(60000 * minutes);
   it('Test the ugly nested callback coffee machine', function (done) {
      
      var result = function (error, state) {
         var stateOutCome;
         var expectedErrorOutCome = null;
         if(!error) {
            stateOutCome = 'The state of the ordered coffee is: ' + state.description;
            stateOutCome.should.equal('The state of the ordered coffee is: beautiful shot!');
         } else {            
            assert.fail(error, expectedErrorOutCome, 'brew encountered an error. The following are the error details: ' + error.message)
         }
         done();
      };

      nestedCoffee().brew(result);      
   });

   it('Test the event emitted coffee machine', function (done) {
      
      function handleSuccess(state) {
         var stateOutCome = 'The state of the ordered coffee is: ' + state.description;
         stateOutCome.should.equal('The state of the ordered coffee is: beautiful shot!');
         done();
      }

      function handleFailure(error) {
         assert.fail(error, 'brew encountered an error. The following are the error details: ' + error.message);
         done();
      }

      // We could even assign multiple event handlers to the same event. We're not here, but we could.
      eventEmittedCoffee.on('successfulOrder', handleSuccess).on('failedOrder', handleFailure);

      eventEmittedCoffee.brew();
   });
   
   it('Test the async coffee machine', function (done) {
      
      var result = function (error, resultsFromAllAsyncSeriesFunctions) {
         var stateOutCome;
         var expectedErrorOutCome = null;
         if(!error) {
            stateOutCome = 'The state of the ordered coffee is: '
               + resultsFromAllAsyncSeriesFunctions[resultsFromAllAsyncSeriesFunctions.length - 1].description;
            stateOutCome.should.equal('The state of the ordered coffee is: beautiful shot!');
         } else {            
            assert.fail(
               error,
               expectedErrorOutCome,
               'brew encountered an error. The following are the error details. message: '
                  + error.message
                  + '. The finished state of the ordered coffee is: '
                  + resultsFromAllAsyncSeriesFunctions[resultsFromAllAsyncSeriesFunctions.length - 1].description
            );
         }
         done();
      };

      asyncCoffee().brew(result)      
   });

   it('Test the coffee machine of promises', function (done) {
      
      var numberOfSteps = 7;
      // We could use a then just as we've used the promises done method, but done is semantically the better choice. It makes a bigger noise about handling errors. Read the docs for more info.
      promisedCoffee().brew().done(
         function handleValue(valueOrErrorFromPromiseChain) {
            console.log(valueOrErrorFromPromiseChain);
            valueOrErrorFromPromiseChain.errors.should.have.length(0);
            valueOrErrorFromPromiseChain.stepResults.should.have.length(numberOfSteps);            
            done();            
         }                  
      );      
   });

});
