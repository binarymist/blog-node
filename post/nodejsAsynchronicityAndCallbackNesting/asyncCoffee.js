'use strict';

var async = require('async');
var espressoMachineHeatTime = {
   // if you don't want to wait for the machine to heat up assign minutes: 0.2.
   // A real coffee machine will take 30 minutes to heat.
   minutes: 0.2,      
   get milliseconds() {
      return this.minutes * 60000;
   }
};
var state = {
   description: '',
   // Other properties
   error: null
};

module.exports = function asyncCoffee() {
   
   var brew = function (onCompletion) {
      async.series([
         function heatEspressoMachine(heatEspressoMachineDone) {
            // No need for callbacks. We can just pass an error to the async supplied callback at any stage and the onCompletion callback will be invoked with the error and the results immediately.

            function espressoMachineHeated() {
               console.log('Espresso machine heating cycle is done.');
               heatEspressoMachineDone(state.error);
            }
            // Flick switch, check water.
            console.log('Espresso machine has been turned on and is now heating.');
            // Mutate state.
            setTimeout(
               // Once espresso machine is hot, heatEspressoMachineDone will be invoked on the next turn of the event loop...
               espressoMachineHeated, espressoMachineHeatTime.milliseconds
            );
         },
         function grindDoseTampBeans(grindDoseTampBeansDone) {
            // Perform long running action, delegating async tasks passing callback and returning immediately.
            console.log('We are now grinding, dosing, then tamping our dose.');
            grindDoseTampBeansDone(state.error);
         },
         function mountPortaFilter(mountPortaFilterDone) {
            // Perform long running action, delegating async tasks passing callback and returning immediately.
            console.log('Porta filter is now being mounted.');
            mountPortaFilterDone(state.error);
         },
         function positionCup(positionCupDone) {
            // Perform long running action, delegating async tasks passing callback and returning immediately.
            console.log('Placing cup under portafilter.');
            positionCupDone(state.error);
         },
         function preInfuse(preInfuseDone) {
            // Perform long running action, delegating async tasks passing callback and returning immediately.
            console.log('10 second preinfuse now taking place.');
            preInfuseDone(state.error);
         },
         function extract(extractDone) {
            // Perform long running action, delegating async tasks passing callback and returning immediately.      
            console.log('Cranking leaver down and extracting pure goodness.');
            // If you want to fail the order, uncomment the below line. May as well change the description too.
            // state.error = {message: 'Oh no! That extraction came out far to fast :-('};
            state.description = 'beautiful shot!';
            extractDone(state.error, state);
            
         }
      ],
      onCompletion);
   };

   return {
      // Publicise brew.
      brew: brew
   };
};
