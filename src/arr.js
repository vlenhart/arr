function cond() {
  var environment = this;
  var resultClause = _.find(arguments, function(clause) {
    return arr(environment, clause[0]);
  });
  return arr(environment, resultClause[1]);
}

function eq(a, b) {
  return a === b;
}

function mod(a, b) {
  return a % b;
}

function print(str) {
  document.writeln(str+'<br />');
}

function lambda() {
  var environment = this;
  var argNames = _.initial(arguments);
  var array = _.last(arguments);

  return function() {
    // add arguments to the local environment
    var localEnvironment = _.clone(environment);
    var args = _.object(argNames, arguments);
    _.extend(localEnvironment, args);
    debugger;
    return arr(localEnvironment, array);
  };
}

function arr(environment, array) {
  if(typeof array == 'undefined') {
    array = environment;
    environment = {};
  }
  if(array instanceof Array) {
    if(array[0] != lambda && array[0] != defun && array[0] != cond) { // do not evaluate the body of a lambda expression (yet)
      array = _.map(array, function(value) {
        return arr(environment, value);
      });
    }
  } else if(typeof array == 'string') {
    // return empty strings
    if(array=='') return array;
    // lookup string in environment
    if(environment.hasOwnProperty(array)) return environment[array];
    // fallback to eval
    try { return eval(array); } catch(e) {}
  }

  var first = _.first(array);

  if(typeof first == 'string') {
    if(environment[first]) {
      first = environment[first];
    } else {
      return array;
    }
  }
  if(typeof first == 'function') {
    var rest = _.rest(array);
    return first.apply(environment, rest);
  }
  return array;
}

var each = _.each;
var map = _.map;
var range = _.range;

function mul() {
  return _.reduce(arguments, function(a,b) {
    return a*b;
  });
}

function defun() {
  var environment = this;
  var functionName = arguments[0];
  var restArgs = Array.prototype.slice.call(arguments, 1, arguments.length);
  return environment[functionName] = lambda.apply(environment, restArgs);
}

var first = _.first;
var last  = _.last;
var butfirst = _.rest;
var butlast  = _.initial;

function append(string1, string2) {
  return string1+string2;
}

function iff(predicate, consequent, alternative) {
  return predicate ? consequent : alternative;
}

function not(a) {
  return typeof a == 'undefined' || (a instanceof Array && a.length==0);
}
