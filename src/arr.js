// basic math functions

function add() {
  return _.reduce(arguments, function(a,b) {
    return a+b;
  });
}

function sub() {
  return _.reduce(arguments, function(a,b) {
    return a-b;
  });
}

function mul() {
  return _.reduce(arguments, function(a,b) {
    return a*b;
  });
}

function div() {
  return _.reduce(arguments, function(a,b) {
    return a/b;
  });
}

function mod() {
  return _.reduce(arguments, function(a,b) {
    return a % b;
  });
}

// core functions

function cond() {
  var environment = this;
  var resultClause = _.find(arguments, function(clause) {
    return arr(environment, clause[0]);
  });
  return arr(environment, resultClause[1]);
}

function define(name, body) {
  var environment = this;

  if(name instanceof Array) {
    var argNames = _.rest(name);
    name = _.first(name);

    return environment[name] = lambda.call(environment, argNames, body);
  } else {
    return environment[name] = arr.call(environment, body);
  }
}

function lambda(names, body) {
  var environment = this;

  return function() {
    // add arguments to the local environment
    var localEnvironment = _.clone(environment);
    var args = _.object(names, arguments);
    _.extend(localEnvironment, args);
    return arr(localEnvironment, body);
  };
}

function arr(environment, array) {
  if(typeof array == 'undefined') {
    array = environment;
    environment = {};
  }
  if(array instanceof Array) {
    if(array[0] != lambda && array[0] != cond) { // do not evaluate the body of a lambda expression (yet)
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

// misc functions

var each = _.each;
var map = _.map;
var range = _.range;

function eq(a, b) {
  return a === b;
}

function print(str) {
  document.writeln(str+'<br />');
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
