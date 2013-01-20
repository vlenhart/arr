// basic math functions

var abs = Math.abs;

function neg(n) {
  return -n;
}

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

// comparison functions

function lt(a, b) {
  return a < b;
}

function eq(a, b) {
  return a === b;
}

function gt(a, b) {
  return a > b;
}

// logic functions

function not(a) {
  return !a;
}

function and(a, b) {
  return a && b;
}

function or(a, b) {
  return a || b;
}

// string functions

function print(str) {
  document.writeln(str+'<br />');
}

function stringFirst(a, n) {
  if(!n) n = 1;
  return a.slice(0, n);
}

function stringButFirst(a, n) {
  if(!n) n = 1;
  return a.slice(n, n.length);
}

function stringLast(a, n) {
  if(!n) n = 1;
  return a.slice(a.length-n, a.length);
}

function stringButLast(a, n) {
  if(!n) n = 1;
  return a.slice(0, a.length-n);
}

function stringAppend(a, b) {
  return a+b;
}

function stringLength(a) {
  return a.length;
}

function isStringEmpty(a) {
  return a.length === 0;
}

// array functions

var map = _.map;
var range = _.range;


// core functions

function iff(predicate, consequent, alternative) {
  var environment = this;
  return arr(environment, predicate) ? arr(environment, consequent) : arr(environment, alternative);
}

function cond() {
  var environment = this;
  var resultClause = _.find(arguments, function(clause) {
    if(clause[0] == 'else') return true;
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
  }

  return environment[name] = arr(environment, body);
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

function arr(environment, body) {
  if(typeof body == 'string') {
    // return empty strings
    if(body==='') return body;
    // lookup string in environment
    if(environment.hasOwnProperty(body)) return environment[body];
    // if all fails return the string
    return body;
  }

  if(typeof body == 'undefined' || typeof body == 'boolean' || typeof body == 'number' || typeof body == 'function') {
    return body;
  }

  if(body instanceof Array) {
    if(body[0] != define && body[0] != lambda && body[0] != cond && body[0] != iff) { // do not yet evaluate the body of some constructs
      body = _.map(body, function(value) {
        return arr(environment, value);
      });
    }
  }

  var first = _.first(body);

  if(typeof first == 'string') {
    if(environment[first]) {
      first = environment[first];
    } else {
      return body;
    }
  }
  if(typeof first == 'function') {
    var rest = _.rest(body);
    return first.apply(environment, rest);
  }
  return body;
}
