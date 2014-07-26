'use strict';

var events = require('events'); // Core node module.
var util = require('util'); // Core node module.

var eventEmittedCoffee;
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
   error: {}
};

function EventEmittedCoffee() {
   
   var eventEmittedCoffee = this;

   function heatEspressoMachine(state) {
      // No need for callbacks. We can emit a failedOrder event at any stage and any subscribers will be notified.

      function emitEspressoMachineHeated() {
         console.log('Espresso machine heating cycle is done.');
         eventEmittedCoffee.emit('espressoMachineHeated', state);
      }
      // Flick switch, check water.
      console.log('Espresso machine has been turned on and is now heating.');
      // Mutate state.
      setTimeout(
         // Once espresso machine is hot event will be emitted on the next turn of the event loop...
         emitEspressoMachineHeated, espressoMachineHeatTime.milliseconds
      );
   }

   function grindDoseTampBeans(state) {
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      console.log('We are now grinding, dosing, then tamping our dose.');
      eventEmittedCoffee.emit('groundDosedTampedBeans', state);
   }

   function mountPortaFilter(state) {
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      console.log('Porta filter is now being mounted.');
      eventEmittedCoffee.emit('portaFilterMounted', state);
   }

   function positionCup(state) {
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      console.log('Placing cup under portafilter.');
      eventEmittedCoffee.emit('cupPositioned', state);
   }

   function preInfuse(state) {
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      console.log('10 second preinfuse now taking place.');
      eventEmittedCoffee.emit('preInfused', state);
   }

   function extract(state) {
      // Perform long running action, delegating async tasks passing callback and returning immediately.      
      console.log('Cranking leaver down and extracting pure goodness.');
      state.description = 'beautiful shot!';
      eventEmittedCoffee.emit('successfulOrder', state);
      // If you want to fail the order, replace the above two lines with the below two lines.
      // state.error.message = 'Oh no! That extraction came out far to fast :-('.
      // this.emit('failedOrder', state.error);
   }

   eventEmittedCoffee.on('timeToHeatEspressoMachine', heatEspressoMachine).
   on('espressoMachineHeated', grindDoseTampBeans).
   on('groundDosedTampedBeans', mountPortaFilter).
   on('portaFilterMounted', positionCup).
   on('cupPositioned', preInfuse).
   on('preInfused', extract);
}

// Make sure util.inherits is before any prototype augmentations, as it seems it clobbers the prototype if it's the other way around.
util.inherits(EventEmittedCoffee, events.EventEmitter);

// Only public method.
EventEmittedCoffee.prototype.brew = function () {
   this.emit('timeToHeatEspressoMachine', state);
};

eventEmittedCoffee = new EventEmittedCoffee();

module.exports = eventEmittedCoffee;




