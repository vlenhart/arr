// basic math functions

var abs = Math.abs;
var exp = Math.exp;
var log = Math.log;

var neg = function (n) {
    return -n;
};

var argsFn = function (fn) {
    var result = function () {
        var args = arguments;
        var result = args[0];

        for (
            var i = 1;
            i < args.length;
            ++i
        ) {
            var arg = args[i];
            result = fn(result, arg);
        }
        return result;
    };

    return result;
};

var add = argsFn(function(a, b) {
    return a + b;
});

var sub = argsFn(function(a, b) {
    return a - b;
});

var mul = argsFn(function(a, b) {
    return a * b;
});

var div = argsFn(function(a, b) {
    return a / b;
});

var mod = argsFn(function(a, b) {
    return a % b;
});


// comparison functions

var lt = function (a, b) {
    return a < b;
};

var eq = function (a, b) {
    return a === b;
};

var gt = function (a, b) {
    return a > b;
};


// logic functions

var not = function (a) {
    return !a;
};

var and = function (a, b) {
    return a && b;
};

var or = function (a, b) {
    return a || b;
};


// string functions

var print = function (str) {
    document.writeln(str + '<br />');
};

var stringFirst = function (a, n) {
    if(!n) {
        n = 1;
    }
    
    var result = a.slice(0, n);
    return result;
};

var stringButFirst = function (a, n) {
    if(!n) {
        n = 1;
    }
    
    var result = a.slice(n, n.length);
    return result;
};

var stringLast = function (a, n) {
    if(!n) {
        n = 1;
    }
    
    var result = a.slice(a.length - n, a.length);
    return result;
};

var stringButLast = function (a, n) {
    if(!n) {
        n = 1;
    }
    
    var result = a.slice(0, a.length - n);
    return result;
};

var stringAppend = function (a, b) {
    var result = a + b;
    return result;
};

var stringLength = function (a) {
    var result = a.length;
    return result;
};

var isStringEmpty = function (a) {
    var result = a.length === 0;
    return result;
};


// array functions

var map = _.map;
var range = _.range;


// core functions

var iff = function (predicate, consequent, alternative) {
    var environment = this;
    return arr(environment, predicate) ? arr(environment, consequent) : arr(environment, alternative);
};

var cond = function () {
    var environment = this;
    var resultClause = _.find(arguments, function(clause) {
        return arr(environment, clause[0]);
    });
    return arr(environment, resultClause[1]);
};

var define = function (name, expression) {
    var environment = this;

    // handle block structure
    if(arguments.length > 2) { // when actually have multiple expressions
        // the first ones should all be internal definitions
        var internals = Array.prototype.slice.call(arguments, 1, length-1); // skip the name (first) and expression (last)
        _.each(internals, function(internal) {
            arr(environment, internal);
        });
        // the last one is the actual expression
        expression = _.last(arguments);
    }

    if(name instanceof Array) {
        var argNames = _.rest(name);
        name = _.first(name);

        return environment[name] = lambda.call(environment, argNames, expression);
    }

    return environment[name] = arr(environment, expression);
};

var lambda = function (names, body) {
    var environment = this;

    return function() {
        // add arguments to the local environment
        var localEnvironment = _.clone(environment);
        var args = _.object(names, arguments);
        _.extend(localEnvironment, args);
        
        return arr(localEnvironment, body);
    };
};

var arr = function (environment, body) {
    if(typeof body == 'string' && environment.hasOwnProperty(body)) {
        return environment[body];
    }

    if(!(body instanceof Array)) return body;


    var fn = _.first(body);
    var args = _.rest(body);

    // do not yet evaluate the body of some constructs
    var specialForms = [define, lambda, cond, iff];
    if(!_.contains(specialForms, fn)) {
        var newBody = _.map(body, function(value) {
            return arr(environment, value);
        });
        fn = _.first(newBody);
        args = _.rest(newBody);
    }

    return fn.apply(environment, args);
};
