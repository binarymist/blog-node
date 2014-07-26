'use strict';

module.exports = function nestedCoffee() {

   // We don't do instant coffee ####################################

   var boilJug = function () {
      // Perform long running action, delegating async tasks passing callback and returning immediately.
   };
   var addInstantCoffeePowder = function () {
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      console.log('Crappy instant coffee powder is being added.');
   };
   var addSugar = function () {
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      console.log('Sugar is being added.');
   };
   var addBoilingWater = function () {
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      console.log('Boiling water is being added.');
   };
   var stir = function () {
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      console.log('Coffee is being stirred. Hmm...');
   };

   // We only do real coffee ########################################

   var heatEspressoMachine = function (state, callback) {
      var error = undefined;
      var wrappedCallback = function () {
         console.log('Espresso machine heating cycle is done.');
         if(!error) {
            callback(error, state);
         } else
            console.log('wrappedCallback encountered an error. The following are the error details: ' + error);
      };
      // Flick switch, check water.
      console.log('Espresso machine has been turned on and is now heating.');
      // Mutate state.
      // If there is an error, wrap callback with our own error function

      // Even if you call setTimeout with a time of 0 ms, the callback you pass is placed on the event queue to be called on a subsequent turn of the event loop.
      // Also be aware that setTimeout has a minimum granularity of 4ms for timers nested more than 5 deep. For several reasons we prefer to use setImmediate if we don't want a 4ms minimum wiat.
      // setImmediate will schedule your callbacks on the next turn of the event loop, but it goes about it in a smarter way. Read more about it here: https://developer.mozilla.org/en-US/docs/Web/API/Window.setImmediate
      // If you are using setImmediate and it's not available in the browser, use the polyfill: https://github.com/YuzuJS/setImmediate
      // For this, we need to wait for our huge hunk of copper to heat up, which takes a lot longer than a few milliseconds.
      setTimeout(
         // Once espresso machine is hot callback will be invoked on the next turn of the event loop...
         wrappedCallback, espressoMachineHeatTime.milliseconds
      );
   };
   var grindDoseTampBeans = function (state, callback) {
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      console.log('We are now grinding, dosing, then tamping our dose.');
      callback(null, state);
   };
   var mountPortaFilter = function (state, callback) {
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      console.log('Porta filter is now being mounted.');
      callback(null, state);
   };
   var positionCup = function (state, callback) {
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      console.log('Placing cup under portafilter.');
      callback(null, state);
   };
   var preInfuse = function (state, callback) {
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      console.log('10 second preinfuse now taking place.');
      callback(null, state);
   };
   var extract = function (state, callback) {
      // Perform long running action, delegating async tasks passing callback and returning immediately.      
      console.log('Cranking leaver down and extracting pure goodness.');
      state.description = 'beautiful shot!';
      // Uncomment the below to test the error.
      //callback({message: 'Oh no, something has gone wrong!'})
      callback(null, state);
   };
   var espressoMachineHeatTime = {
      // if you don't want to wait for the machine to heat up assign minutes: 0.2.
      // A real coffee machine will take 30 minutes to heat.
      minutes: 0.2,      
      get milliseconds() {
         return this.minutes * 60000;
      }
   };
   var state = {
      description: ''
      // Other properties
   };
   var brew = function (onCompletion) {
      // Some prep work here possibly.
      heatEspressoMachine(state, function (err, resultFromHeatEspressoMachine) {
         if(!err) {
            grindDoseTampBeans(state, function (err, resultFromGrindDoseTampBeans) {
               if(!err) {
                  mountPortaFilter(state, function (err, resultFromMountPortaFilter) {
                     if(!err) {
                        positionCup(state, function (err, resultFromPositionCup) {
                           if(!err) {
                              preInfuse(state, function (err, resultFromPreInfuse) {
                                 if(!err) {
                                    extract(state, function (err, resultFromExtract) {
                                       if(!err)
                                          onCompletion(null, state);
                                       else
                                          onCompletion(err, null);
                                    });
                                 } else
                                    onCompletion(err, null);
                              });
                           } else
                              onCompletion(err, null);
                        });
                     } else
                        onCompletion(err, null);
                  });
               } else
                  onCompletion(err, null);
            });         
         } else
            onCompletion(err, null);
      });
   };
   return {
      // Publicise brew.
      brew: brew
   };
};