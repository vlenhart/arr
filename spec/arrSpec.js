describe("arr", function() {
  // several examples taken from the holy text (SICP)
  // http://mitpress.mit.edu/sicp/full-text/book/book-Z-H-4.html

  it("allows me to evaluate all programs from sicp chapter 1.1.1 Expressions", function() {
    var environment = {};
    var tests = [
      [486,
       486],
      [[add, 137, 349],
       486],
      [[sub, 1000, 334],
       666],
      [[mul, 5, 99],
       495],
      [[div, 10, 5],
       2],
      [[add, 2.7, 10],
       12.7]
    ];

    _.each(tests, function(test) {
      var expression = _.first(test);
      var expectedResult = _.last(test);
      var actualResult = arr(environment, expression);
      expect(environment).toEqual({});
      expect(actualResult).toEqual(expectedResult);
    });
  });

  it("allows me to evaluate all programs from sicp chapter 1.1.2 Naming and the Environment", function() {
    var environment = {};

    var expression = [define, 'size', 2];
    var result = arr(environment, expression);
    expect(environment.size).toEqual(2);

    expression = [mul, 5, 'size'];
    var expectedResult = 10;
    var actualResult = arr(environment, expression);
    expect(actualResult).toEqual(expectedResult);

    expression = [define, 'pi', 3.14159];
    result = arr(environment, expression);
    expect(environment.pi).toEqual(3.14159);

    expression = [define, 'radius', 10];
    result = arr(environment, expression);
    expect(environment.radius).toEqual(10);

    expression = [mul, 'pi', [mul, 'radius', 'radius']];
    expectedResult = 314.159;
    actualResult = arr(environment, expression);
    expect(actualResult).toEqual(expectedResult);

    expression = [define, 'circumference', [mul, 2, 'pi', 'radius']];
    result = arr(environment, expression);
    expect(environment.circumference).toEqual(62.8318);
  });

  it("allows me to evaluate all programs from sicp chapter 1.1.3 Evaluating Combinations", function() {
    var environment = {};

    var expression =
      [mul,
        [add, 2,
          [mul, 4, 6]],
        [add, 3, 5, 7]];
    var expectedResult = 390;
    var actualResult = arr(environment, expression);
    expect(actualResult).toEqual(expectedResult);
  });

  it("allows me to evaluate all programs from sicp chapter 1.1.4 Compound Procedures", function() {
    var environment = {};

    var expression =
      [define, ['square', 'x'],
        [mul, 'x', 'x']];
    var result = arr(environment, expression);
    expect(environment.square).toEqual(jasmine.any(Function));

    expression = ['square', 21];
    var expectedResult = 441;
    var actualResult = arr(environment, expression);
    expect(actualResult).toEqual(expectedResult);

    expression = ['square', [add, 2, 5]];
    expectedResult = 49;
    actualResult = arr(environment, expression);
    expect(actualResult).toEqual(expectedResult);

    expression = ['square', ['square', 3]];
    expectedResult = 81;
    actualResult = arr(environment, expression);
    expect(actualResult).toEqual(expectedResult);

    expression =
      [define, ['sumOfSquares', 'x', 'y'],
        [add, ['square', 'x'], ['square', 'y']]];
    result = arr(environment, expression);
    expect(environment.sumOfSquares).toEqual(jasmine.any(Function));

    expression = ['sumOfSquares', 3, 4];
    expectedResult = 25;
    actualResult = arr(environment, expression);
    expect(actualResult).toEqual(expectedResult);

    expression =
      [define, ['f', 'a'],
        ['sumOfSquares', [add, 'a', 1], [mul, 'a', 2]]];
    result = arr(environment, expression);
    expect(environment.sumOfSquares).toEqual(jasmine.any(Function));

    expression = ['f', 5];
    expectedResult = 136;
    actualResult = arr(environment, expression);
    expect(actualResult).toEqual(expectedResult);
  });

  it("allows me to evaluate all programs from sicp chapter 1.1.6 Conditional Expressions and Predicates", function() {
    var environment = {};

    var expression =
      [define, ['abs', 'x'],
        [cond,
          [[gt, 'x', 0], 'x'],
          [[eq, 'x', 0], 0],
          [[lt, 'x', 0], [neg, 'x']]]];
    var result = arr(environment, expression);
    expect(environment.abs).toEqual(jasmine.any(Function));
    for(var i=-5; i<=5; i++) {
      expect(environment.abs(i)).toEqual(Math.abs(i));
    }

    expression =
      [define, ['abs', 'x'],
        [cond,
          [[lt, 'x', 0], [neg, 'x']],
          [true, 'x']]];
    result = arr(environment, expression);
    expect(environment.abs).toEqual(jasmine.any(Function));
    for(var i=-5; i<=5; i++) {
      expect(environment.abs(i)).toEqual(Math.abs(i));
    }

    expression =
      [define, ['abs', 'x'],
        [iff, [lt, 'x', 0],
            [neg, 'x'],
            'x']];
    result = arr(environment, expression);
    expect(environment.abs).toEqual(jasmine.any(Function));
    for(var i=-5; i<=5; i++) {
      expect(environment.abs(i)).toEqual(Math.abs(i));
    }

    expression =
      [lambda, ['x'],
        [and,
          [gt, 'x', 5],
          [lt, 'x', 10]
        ]
      ];
    result = arr(environment, expression);
    expect(result).toEqual(jasmine.any(Function));
    for(var i=0; i<15; i++) {
      expect(result(i)).toEqual(i>5 && i<10);
    }

    expression =
      [define, ['ge', 'x', 'y'],
        [or,
          [gt, 'x', 'y'],
          [eq, 'x', 'y']
        ]
      ];
    result = arr(environment, expression);
    expect(environment.ge).toEqual(jasmine.any(Function));
    for(var i=-5; i<=5; i++) {
      for(var j=-5; j<=5; j++) {
        expect(environment.ge(i, j)).toEqual(i>=j);
      }
    }

    expression =
      [define, ['ge', 'x', 'y'],
        [not, [lt, 'x', 'y']]
      ];
    result = arr(environment, expression);
    expect(environment.ge).toEqual(jasmine.any(Function));
    for(var i=-5; i<=5; i++) {
      for(var j=-5; j<=5; j++) {
        expect(environment.ge(i, j)).toEqual(i>=j);
      }
    }
  });

  it("allows me to do excercise 1.1 from sicp", function() {
    var environment = {};
    var tests = [
      [10,
       10],
      [[add, 5, 3, 4],
       12],
      [[sub, 9, 1],
       8],
      [[div, 6, 2],
       3],
      [[add, [mul, 2, 4], [sub, 4, 6]],
       6],
      [[define, 'a', 3],
       3],
      [[define, 'b', [add, 'a', 1]],
       4],
      [[add, 'a', 'b', [mul, 'a', 'b']],
       19],
      [[eq, 'a', 'b'],
       false],
      [[iff, [and, [gt, 'b', 'a'], [lt, 'b', [mul, 'a', 'b']]],
             'b',
             'a'],
       4],
      [[cond,
        [[eq, 'a', 4], 6],
        [[eq, 'b', 4], [add, 6, 7, 'a']],
        [true, -1]],
       16],
      [[add, 2, [iff, [gt, 'b', 'a'], 'b', 'a']],
       6],
      [[mul, [cond,
               [[gt, 'a', 'b'], 'a'],
               [[lt, 'a', 'b'], 'b'],
               [true, -1]],
             [add, 'a', 1]],
       16]
    ];
    _.each(tests, function(test) {
      var expression = _.first(test);
      var expectedResult = _.last(test);
      var actualResult = arr(environment, expression);
      expect(actualResult).toEqual(expectedResult);
    });
  });

  it("allows me to do excercise 1.2 from sicp", function() {
    var expression =
      [div,
        [add,
          5,
          4,
          [sub, 2,
            [sub, 3,
              [add, 6,
                [div,
                  4,
                  5]]]]],
        [mul, 3, [sub, 6, 2], [sub, 2, 7]]];
    var expectedResult = -37/150;
    var actualResult = arr(null, expression);
    expect(actualResult).toEqual(expectedResult);
  });

  it("allows me to do excercise 1.3 from sicp", function() {
    var environment = {
      square: function(a) { return a*a; }
    };

    var expression =
      [define, ['sumOfThreeSquares', 'x', 'y', 'z'],
        [add, ['square', 'x'], ['square', 'y'], ['square', 'z']]];
    arr(environment, expression);
    expect(environment.sumOfThreeSquares).toEqual(jasmine.any(Function));
    expect(environment.sumOfThreeSquares(1, 2, 3)).toEqual(1+4+9);
    expect(environment.sumOfThreeSquares(-5, 0, 10)).toEqual(25+0+100);

    expression = // returns the first number or zero if it is the smallest of the three
      [define, ['zeroWhenSmallest', 'a', 'b', 'c'],
        [iff, [and, [lt, 'a', 'b'], [lt, 'a', 'c']],
          0,
          'a']];
    arr(environment, expression);
    expect(environment.zeroWhenSmallest).toEqual(jasmine.any(Function));
    expect(environment.zeroWhenSmallest(1, 2, 3)).toEqual(0);
    expect(environment.zeroWhenSmallest(3, 2, 1)).toEqual(3);
    expect(environment.zeroWhenSmallest(2, 1, 3)).toEqual(2);
    expect(environment.zeroWhenSmallest(-5, 0, 10)).toEqual(0);
    expect(environment.zeroWhenSmallest(0, -5, 10)).toEqual(0);
    expect(environment.zeroWhenSmallest(10, 0, 5)).toEqual(10);

    expression = // returns the sum of the squares of the two largest numbers
      [define, ['sumOfTwoLargestSquares', 'x', 'y', 'z'],
        ['sumOfThreeSquares',
          ['zeroWhenSmallest', 'x', 'y', 'z'],
          ['zeroWhenSmallest', 'y', 'x', 'z'],
          ['zeroWhenSmallest', 'z', 'x', 'y']
    ]];
    arr(environment, expression);
    expect(environment.sumOfTwoLargestSquares).toEqual(jasmine.any(Function));
    expect(environment.sumOfTwoLargestSquares(1, 2, 3)).toEqual(0+4+9);
    expect(environment.sumOfTwoLargestSquares(3, 2, 1)).toEqual(9+4+0);
    expect(environment.sumOfTwoLargestSquares(2, 1, 3)).toEqual(4+0+9);
    expect(environment.sumOfTwoLargestSquares(-5, 0, 10)).toEqual(0+0+100);
    expect(environment.sumOfTwoLargestSquares(0, -5, 10)).toEqual(0+0+100);
    expect(environment.sumOfTwoLargestSquares(10, 0, -5)).toEqual(100+0+0);
  });

  it("allows me to do excercise 1.4 from sicp", function() {
    var environment = {};
    var expression =
      [define, ['aPlusAbsB', 'a', 'b'],
        [[iff, [gt, 'b', 0], add, sub], 'a', 'b']];
    arr(environment, expression);
    expect(environment.aPlusAbsB).toEqual(jasmine.any(Function));
    expect(environment.aPlusAbsB(1, 3)).toEqual(4);
    expect(environment.aPlusAbsB(1, -3)).toEqual(4);
    expect(environment.aPlusAbsB(1, 9)).toEqual(10);
    expect(environment.aPlusAbsB(1, -9)).toEqual(10);
  });

  it("allows me to do excercise 1.5 from sicp", function() {
    var environment = {};
    var expression =
      [define, ['p'],
        ['p']];
    arr(environment, expression);
    expect(environment.p).toEqual(jasmine.any(Function));

    expression =
      [define, ['test', 'x', 'y'],
        [iff, [eq, 'x', 0],
          0,
          'y'
        ]];
    arr(environment, expression);
    expect(environment.test).toEqual(jasmine.any(Function));

    expression = ['test', 0 , ['p']];

    expect(function() {
      arr(environment, expression);
    }).toThrow();
  });

  it("allows me to evaluate all programs from sicp chapter 1.1.7 Example: Square Roots by Newton's Method", function() {
    var environment = {
      square: function(a) { return a*a; }
    };

    var expressions = [
      [define, ['sqrtIter', 'guess', 'x'],
        [iff, ['isGoodEnough', 'guess', 'x'],
        'guess',
        ['sqrtIter', ['improve', 'guess', 'x'], 'x']]],
      [define, ['improve', 'guess', 'x'],
        ['average', 'guess', [div, 'x', 'guess']]],
      [define, ['average', 'x', 'y'],
        [div, [add, 'x', 'y'], 2]],
      [define, ['isGoodEnough', 'guess', 'x'],
        [lt, [abs, [sub, ['square', 'guess'], 'x']], 0.001]],
      [define, ['sqrt', 'x'],
        ['sqrtIter', 1.0, 'x']]
    ];
    _.each(expressions, function(expression) {
      var actualResult = arr(environment, expression);
      expect(actualResult).toEqual(jasmine.any(Function));
    });

    var tests = [
      [['sqrt', 9],
       3.00009155413138],
      [['sqrt', [add, 100, 37]],
       11.704699917758145],
      [['sqrt', [add, ['sqrt', 2], ['sqrt', 3]]],
       1.7739279023207892],
      [['square', ['sqrt', 1000]],
       1000.000369924366]
    ];

    _.each(tests, function(test) {
      var expression = _.first(test);
      var expectedResult = _.last(test);
      var actualResult = arr(environment, expression);
      expect(actualResult).toEqual(expectedResult);
    });

  });

  // i'm skipping excercise 1.6, as it's just a variant of 1.5

  it("allows me to do excercise 1.7 from sicp", function() {
    var environment = {
      square: function(a) { return a*a; }
    };

    // these are the same as above
    var expressions = [
      [define, ['sqrtIter', 'guess', 'x'],
        [iff, ['isGoodEnough', 'guess', 'x'],
        'guess',
        ['sqrtIter', ['improve', 'guess', 'x'], 'x']]],
      [define, ['improve', 'guess', 'x'],
        ['average', 'guess', [div, 'x', 'guess']]],
      [define, ['average', 'x', 'y'],
        [div, [add, 'x', 'y'], 2]],
      [define, ['isGoodEnough', 'guess', 'x'],
        [lt, [abs, [sub, ['square', 'guess'], 'x']], 0.001]],
      [define, ['sqrt', 'x'],
        ['sqrtIter', 1.0, 'x']]
    ];
    _.each(expressions, function(expression) {
      var actualResult = arr(environment, expression);
      expect(actualResult).toEqual(jasmine.any(Function));
    });

    var tests = [
      [['sqrt', 9],
       3.00009155413138], // should be 3
      [['sqrt', 0.09],
       0.3000299673226795], // should be 0.3
      [['sqrt', 0.0009],
       0.04030062264654547], // should be 0.03 (a bit off)
      [['sqrt', 0.000009],
       0.03134584760656851], // should be 0.003 (way off)
      [['sqrt', 0.00000009],
       0.031250959056630584] // should be 0.0003 (way off)
    ];

    _.each(tests, function(test) {
      var expression = _.first(test);
      var expectedResult = _.last(test);
      var actualResult = arr(environment, expression);
      expect(actualResult).toEqual(expectedResult);
    });

    expect(function() {
      environment.sqrt(90000000000000); // this just crashes because of a stack overflow
    }).toThrow();

    // now we change the isGoogEnough function

    expressions = [
      [define, ['isGoodEnough', 'guess', 'x'],
        [lt, [abs, [sub, 1.0, [div, ['improve', 'guess', 'x'], 'guess']]], 0.001]]
    ];

    _.each(expressions, function(expression) {
      var actualResult = arr(environment, expression);
      expect(actualResult).toEqual(jasmine.any(Function));
    });

    tests = [
      [['sqrt', 9],
       3.00009155413138], // should be 3 (close enough)
      [['sqrt', 0.09],
       0.3000299673226795], // should be 0.3 (close enough)
      [['sqrt', 0.0009],
       0.03002766742182557], // should be 0.03 (close enough)
      [['sqrt', 0.000009],
       0.0030000276392750298], // should be 0.003 (close enough)
      [['sqrt', 0.00000009],
       0.0003000322764683917], // should be 0.0003 (close enough)

      [['sqrt', 90000000000000], // should be 9486832.980505139 (close enough and definitely better than a stack overflow)
       9486846.590065714]
    ];

    _.each(tests, function(test) {
      var expression = _.first(test);
      var expectedResult = _.last(test);
      var actualResult = arr(environment, expression);
      expect(actualResult).toEqual(expectedResult);
    });
  });

  it("should be able to do FizzBuzz", function() {
    var environment = {};
    var toTest = arr(environment,
      [map,
        [range, 1, 101],
        [lambda, ['number'],
          [cond,
            [[eq, [mod, 'number', 15], 0], 'FizzBuzz'],
            [[eq, [mod, 'number',  3], 0], 'Fizz'],
            [[eq, [mod, 'number',  5], 0], 'Buzz'],
            [true, 'number']
          ]
        ]
      ]
    );
    expect(environment).toEqual({});

    var correct = [1,2,"Fizz",4,"Buzz","Fizz",7,8,"Fizz","Buzz",11,"Fizz",13,14,"FizzBuzz",16,17,"Fizz",19,"Buzz","Fizz",22,23,"Fizz","Buzz",26,"Fizz",28,29,"FizzBuzz",31,32,"Fizz",34,"Buzz","Fizz",37,38,"Fizz","Buzz",41,"Fizz",43,44,"FizzBuzz",46,47,"Fizz",49,"Buzz","Fizz",52,53,"Fizz","Buzz",56,"Fizz",58,59,"FizzBuzz",61,62,"Fizz",64,"Buzz","Fizz",67,68,"Fizz","Buzz",71,"Fizz",73,74,"FizzBuzz",76,77,"Fizz",79,"Buzz","Fizz",82,83,"Fizz","Buzz",86,"Fizz",88,89,"FizzBuzz",91,92,"Fizz",94,"Buzz","Fizz",97,98,"Fizz","Buzz"];

    expect(environment).toEqual({});
    expect(toTest).toEqual(correct);
  });

  it("should be able to use basic math", function() {
    var environment = {};
    var toTest = arr(environment,
      [map,
        [range, 10],
        [lambda, ['n'],
          [mul, 'n', 'n', 'n']]]
    );

    var correct = [0, 1, 8, 27, 64, 125, 216, 343, 512, 729];

    expect(environment).toEqual({});
    expect(toTest).toEqual(correct);
  });

  it("should be able to reverse strings", function() {
    var environment = {};
    var stringReverse = arr(environment,
      [define, ['reverse', 'original', 'reversed'],
        [cond,
          [[eq, 'reversed', undefined], ['reverse', 'original', '']],
          [[eq, [stringLength, 'original'], 0], 'reversed'],
          [true, ['reverse',
            [stringButLast, 'original', 1],
            [stringAppend, 'reversed', [stringLast, 'original', 1]]]]
        ]
      ]
    );
    expect(environment.reverse('abc')).toEqual('cba');
    expect(stringReverse('this is a test')).toEqual('tset a si siht');
  });
});