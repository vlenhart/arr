// basic math functions

var abs = Math.abs;
var exp = Math.exp;
var log = Math.log;

var neg = function neg (n) {
    return -n;
};

var argsFn = function argsFn (fn) {
    var result = function result () {
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

var add = argsFn(function add (a, b) {
    return a + b;
});

var sub = argsFn(function sub (a, b) {
    return a - b;
});

var mul = argsFn(function mul (a, b) {
    return a * b;
});

var div = argsFn(function div (a, b) {
    return a / b;
});

var mod = argsFn(function mod (a, b) {
    return a % b;
});


// comparison functions

var lt = function lt (a, b) {
    return a < b;
};

var eq = function eq (a, b) {
    return a === b;
};

var gt = function gt (a, b) {
    return a > b;
};


// logic functions

var not = function not (a) {
    return !a;
};

var and = argsFn(function and (a, b) {
    return a && b;
});

var or = argsFn(function or (a, b) {
    return a || b;
});


// string functions

var print = function print (str) {
    console.log(str);
};

var stringFirst = function stringFirst (a, n) {
    if(!n) {
        n = 1;
    }

    var result = a.slice(0, n);
    return result;
};

var stringButFirst = function stringButFirst (a, n) {
    if(!n) {
        n = 1;
    }

    var result = a.slice(n, a.length);
    return result;
};

var stringLast = function stringLast (a, n) {
    if(!n) {
        n = 1;
    }

    var result = a.slice(a.length - n, a.length);
    return result;
};

var stringButLast = function stringButLast (a, n) {
    if(!n) {
        n = 1;
    }

    var result = a.slice(0, a.length - n);
    return result;
};

var stringAppend = function stringAppend (a, b) {
    var result = a + b;
    return result;
};

var stringLength = function stringLength (a) {
    var result = a.length;
    return result;
};

var isStringEmpty = function isStringEmpty (a) {
    var result = a.length === 0;
    return result;
};


// array functions

var map = _.map;
var range = _.range;


// core functions

var iff = function iff (predicate, consequent, alternative) {
    var environment = this;
    var newPredicate = arr(environment, predicate);
    var result;

    if (newPredicate) {
        result = arr(environment, consequent);
    } else {
        result = arr(environment, alternative);
    }

    return result;
};

var cond = function cond () {
    var environment = this;
    var resultClause = _.find(arguments, function(clause) {
        return arr(environment, clause[0]);
    });
    return arr(environment, resultClause[1]);
};

var define = function define () {
    var environment = this;
    var name = _.first(arguments);
    var expression = _.last(arguments);

    var isBlockStructure = arguments.length > 2;
    if(isBlockStructure) {
        // skip the name (first) and expression (last)
        for (var i = 1; i < arguments.length - 1; ++i) {
            var internal = arguments[i];
            arr(environment, internal);
        }
    }

    if(name instanceof Array) {
        var argNames = _.rest(name);
        name = _.first(name);

        environment[name] = lambda.call(environment, argNames, expression);
    } else {
        environment[name] = arr(environment, expression);
    }

    return environment[name];
};

var lambda = function lambda (names, body) {
    var environment = this;

    return function() {
        if(this != window) {
            environment = this;
        }
        // add arguments to the local environment
        var localEnvironment = _.clone(environment);
        var args = _.object(names, arguments);
        _.extend(localEnvironment, args);
        
        return arr(localEnvironment, body);
    };
};

var arr = function arr (environment, body) {
    var bodyMaybeVarName = typeof body == 'string';
    var bodyIsVarName = bodyMaybeVarName && environment.hasOwnProperty(body);

    if(bodyIsVarName) {
        var variable = environment[body];
        return variable;
    }

    var isScalar = !(body instanceof Array);
    if(isScalar) {
        return body;
    }

    var fn = _.first(body);
    var args = _.rest(body);

    // do not yet evaluate the body of some constructs
    var specialForms = [define, lambda, cond, iff];
    var fnIsSpecialForm = specialForms.indexOf(fn) >= 0;
    //_.contains(specialForms, fn)
    if(!fnIsSpecialForm) {
        var newBody = _.map(body, function(value) {
            return arr(environment, value);
        });
        fn = _.first(newBody);
        args = _.rest(newBody);
    }

    return fn.apply(environment, args);
};
