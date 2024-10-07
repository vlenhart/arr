// basic math functions

let abs = Math.abs;
let exp = Math.exp;
let log = Math.log;

let neg = (n) => -n;

let reduce = Array.prototype.reduce;

// partial application of the last argument seems weird  but allows us to use js functions like reduce as is
let partial = function partial (partialFunction, partialArgument) {
    let result = function wrapper () {
        let result = partialFunction.call(arguments, partialArgument);
        return result;
    };

    return result;
};


let add = partial(reduce, (a, b) => a + b);
let sub = partial(reduce, (a, b) => a - b);
let mul = partial(reduce, (a, b) => a * b);
let div = partial(reduce, (a, b) => a / b);
let mod = partial(reduce, (a, b) => a % b);


// comparison functions

let lt = (a, b) => a < b;
let eq = (a, b) => a === b;
let gt = (a, b) => a > b;


// logic functions

let not = (a) => !a;
let and = partial(reduce, (a, b) => a && b);
let or = partial(reduce, (a, b) => a || b);


// string functions

let print = console.log;

let stringFirst = function stringFirst (a, n) {
    if(!n) {
        n = 1;
    }

    let result = a.slice(0, n);
    return result;
};

let stringButFirst = function stringButFirst (a, n) {
    if(!n) {
        n = 1;
    }

    let result = a.slice(n, a.length);
    return result;
};

let stringLast = function stringLast (a, n) {
    if(!n) {
        n = 1;
    }

    let result = a.slice(a.length - n, a.length);
    return result;
};

let stringButLast = function stringButLast (a, n) {
    if(!n) {
        n = 1;
    }

    let result = a.slice(0, a.length - n);
    return result;
};

let stringAppend = function stringAppend (a, b) {
    let result = a + b;
    return result;
};

let stringLength = function stringLength (a) {
    let result = a.length;
    return result;
};

let isStringEmpty = function isStringEmpty (a) {
    let result = a.length === 0;
    return result;
};


// array functions
let map = function(a, fn) {
    let result;

    if(a.length !== undefined) {
        if(fn instanceof Function) {
            result = Array.prototype.map.call(a, fn);
        } else {
            throw new Error(`second argument to map has to be a function, got "${fn}" instead`);
        }
    } else {
        throw new Error(`first argument to map has to be an array-like type, got "${a}" instead`);
    }

    return result;
}

let range = function() {
    let result;

    let start = 0;
    let stop;
    let step = 1;

    if(arguments.length == 1) {
        [stop] = arguments;
    } else if(arguments.length == 2) {
        [start, stop] = arguments;
    } else if(arguments.length == 3) {
        [start, stop, step] = arguments;
    } else {
        throw new Error("the range function takes 1, 2 or 3 arguments, you passed " + arguments.length);
    }

    let valueCount = (stop - start) / step;
    result = new Array(valueCount);
    let i = 0;
    for(let value = start; value < stop; value += step) {
        result[i] = value;
        ++i;
    }

    return result;
}

let rest = function (a) {
    let result = a.slice(1);
    return result;
}

// core functions

let iff = function (PredicateExpression, ConsequentExpression, AlternativeExpression) {
    let Result;

    let Environment = this;
    let Predicate = arr(Environment, PredicateExpression);
    let Expression;

    if (Predicate) {
        Expression = ConsequentExpression;
    } else {
        Expression = AlternativeExpression;
    }

    Result = arr(Environment, Expression);

    return Result;
};

let cond = function cond () {
    let result = null;
    let environment = this;
    let clauses = arguments;

    // process all clauses to find the matching one
    for(let clause of clauses) {
        let test = clause[0];
        let testResult = arr(environment, test);

        if(testResult) {
            // found the correct clause, evaluate it
            result = arr(environment, clause[1]);
            break;
        }
    }

    return result;
};

let define = function define () {
    let environment = this;

    if(arguments.length < 2) {
        throw new Error("define requires at least a name and an expression");
    }

    let isBlockStructure = arguments.length > 2;
    if(isBlockStructure) {
        // evaluate internal definitions between name and expression
        for (let i = 1; i < arguments.length - 1; ++i) {
            let internalDefinition = arguments[i];
            arr(environment, internalDefinition);
        }
    }

    let nameOrNameAndFormals = arguments[0];

    let expression;
    let name;

    if(typeof(nameOrNameAndFormals) == "string") {
        name = nameOrNameAndFormals;
        expression = arguments[arguments.length - 1];
    } else if(nameOrNameAndFormals instanceof Array) {
        name = nameOrNameAndFormals[0];

        let formals = rest(nameOrNameAndFormals);
        expression = [lambda, formals, arguments[arguments.length - 1]];
    } else {
        throw new Error("first arguemnt of \"define\" must be of type string or array");
    }

    environment[name] = arr(environment, expression);

    return environment[name];
};

let lambda = function lambda (names, body) {
    let environment = this;

    return function() {
        if(this != window) {
            environment = this;
        }
        // make a copy of the parent environment and add the arguments to it
        let localEnvironment = {};
        Object.assign(localEnvironment, environment);

        for(let i = 0; i < names.length; ++i) {
            localEnvironment[names[i]] = arguments[i];
        }

        return arr(localEnvironment, body);
    };
};

let arr = function arr (environment, body) {
    let result;

    if(body instanceof Array) {
        let specialForms = [define, lambda, cond, iff];

        if(!specialForms.includes(body[0])) {
            // not a special form, evaluate everything right now
            body = body.map(function(value) {
                return arr(environment, value);
            });
        }

        let fn = body[0];

        if(!(fn instanceof Function)) {
            throw new Error(`${fn} is not a function`);
        }

        let args = rest(body);

        result = fn.apply(environment, args);
    } else if(typeof body == "string" && environment.hasOwnProperty(body)) {
        // just look the value up in the environment
        result = environment[body];
    } else {
        // we are already done
        result = body;
    }

    return result;
};
