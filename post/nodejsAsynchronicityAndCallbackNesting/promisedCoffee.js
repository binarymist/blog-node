'use strict';

var when = require('when');
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
   errors: [],
   stepResults: []
};
function CustomError(message) {
   this.message = message;
   // return false 
   return false;
}

function heatEspressoMachine(resolve, reject) {
   state.stepResults.push('Espresso machine has been turned on and is now heating.');
   function espressoMachineHeated() {
      var result;
      // result will be wrapped in a new promise and provided as the parameter in the promises then methods first argument.
      result = 'Espresso machine heating cycle is done.';
      // result could also be assigned another promise
      resolve(result);
      // Or call the reject
      //reject(new Error('Something screwed up here')); // You'll know where it originated from. You'll get full stack trace.
   }
   // Flick switch, check water.
   console.log('Espresso machine has been turned on and is now heating.');
   // Mutate state.
   setTimeout(
      // Once espresso machine is hot, heatEspressoMachineDone will be invoked on the next turn of the event loop...
      espressoMachineHeated, espressoMachineHeatTime.milliseconds
   );
}

// The promise takes care of all the asynchronous stuff without a lot of thought required.
var promisedCoffee = when.promise(heatEspressoMachine).then(
   function fulfillGrindDoseTampBeans(result) {      
      state.stepResults.push(result);
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      return 'We are now grinding, dosing, then tamping our dose.';
      // Or if something goes wrong:
      // throw new Error('Something screwed up here'); // You'll know where it originated from. You'll get full stack trace.
   },
   function rejectGrindDoseTampBeans(error) {
      // Deal with the error. Possibly augment some additional insight and re-throw.
      if(state.errors[state.errors.length -1] !== error.message)
         state.errors.push(error.message);
      throw new CustomError(error.message);      
   }
).then(
   function fulfillMountPortaFilter(result) {
      state.stepResults.push(result);
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      return 'Porta filter is now being mounted.';
   },
   function rejectMountPortaFilter(error) {
      // Deal with the error. Possibly augment some additional insight and re-throw.
      if(state.errors[state.errors.length -1] !== error.message)
         state.errors.push(error.message);
      throw new Error(error.message);
   }
).then(
   function fulfillPositionCup(result) {
      state.stepResults.push(result);
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      return 'Placing cup under portafilter.';
   },
   function rejectPositionCup(error) {
      // Deal with the error. Possibly augment some additional insight and re-throw.
      if(state.errors[state.errors.length -1] !== error.message)
         state.errors.push(error.message);
      throw new CustomError(error.message);
   }
).then(
   function fulfillPreInfuse(result) {
      state.stepResults.push(result);
      // Perform long running action, delegating async tasks passing callback and returning immediately.
      return '10 second preinfuse now taking place.';
   },
   function rejectPreInfuse(error) {
      // Deal with the error. Possibly augment some additional insight and re-throw.
      if(state.errors[state.errors.length -1] !== error.message)
         state.errors.push(error.message);
      throw new CustomError(error.message);
   }
).then(
   function fulfillExtract(result) {
      state.stepResults.push(result);
      state.description = 'beautiful shot!';
      state.stepResults.push('Cranking leaver down and extracting pure goodness.');
      // Perform long running action, delegating async tasks passing callback and returning immediately.      
      return state;
   },
   function rejectExtract(error) {
      // Deal with the error. Possibly augment some additional insight and re-throw.
      if(state.errors[state.errors.length -1] !== error.message)
         state.errors.push(error.message);      
      throw new CustomError(error.message);
      
   }
).catch(CustomError, function (e) {
      // Only deal with the error type that we know about.
      // All other errors will propagate to the next catch. whenjs also has a finally if you need it.
      // Todo: KimC. Do the dealing with e.
      e.newCustomErrorInformation = 'Ok, so we have now dealt with the error in our custom error handler.';
      return e;
   }
).catch(function (e) {
      // Handle other errors
      e.newUnknownErrorInformation = 'Hmm, we have an unknown error.';
      return e;
   }
);

function brew() {
   return promisedCoffee;
}

// when's promise.catch is only supposed to catch errors derived from the native Error (etc) functions.
// Although in my tests, my catch(CustomError func) wouldn't catch it. I'm assuming there's a bug as it kept giving me a TypeError instead.
// Looks like it came from within the library. So this was a little disappointing.
CustomError.prototype = Error;

module.exports = function promisedCoffee() {
   return {
      // Publicise brew.
      brew: brew
   };
};