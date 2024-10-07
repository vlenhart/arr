describe("Random Examples", function() {

  it("FizzBuzz", function() {
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

  it("Basic Math", function() {
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

  it("String Reverse", function() {
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


describe("Structure and Interpretation of Computer Programs", function() {
  // several examples taken from the holy text (SICP)
  // http://mitpress.mit.edu/sicp/full-text/book/book-Z-H-4.html

  it("1.1.1 Expressions", function() {
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

    for(let test of tests) {
      let [expression, expectedResult] = test;
      var actualResult = arr(environment, expression);
      expect(environment).toEqual({});
      expect(actualResult).toEqual(expectedResult);
    };
  });

  it("1.1.2 Naming and the Environment", function() {
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

  it("1.1.2 Naming and the Environment (variant)", function() {
    var R = function(expression) {
      return arr(this, expression);
    };

    R.define = function(name, expression) {
      return define.apply(R, arguments);
    }

    R.mul = function() {
      var args = map(arguments, function(arg) {
        return arr(R, arg);
      })
      return mul.apply(R, args);
    }

    R.define('size', 2);
    expect(R.size).toEqual(2);

    expect(R.mul(5, 'size')).toEqual(10);

    R.define('pi', 3.14159);
    expect(R.pi).toEqual(3.14159);

    R.define('radius', 10);
    expect(R.radius).toEqual(10);

    expect(R(
      R.mul(
        'pi',
        R.mul(
          'radius',
          'radius')))
    ).toEqual(314.159);

    R.define('circumference',
      R.mul(
        2,
        'pi',
        'radius'));
    expect(R.circumference).toEqual(62.8318);
  });

  it("1.1.3 Evaluating Combinations", function() {
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

  it("1.1.3 Evaluating Combinations (variant)", function() {
    var R = function(expression) {
      return arr(this, expression);
    };

    R.define = function(name, expression) {
      return define.apply(R, arguments);
    }

    R.mul = function() {
      var args = map(arguments, function(arg) {
        return arr(R, arg);
      })
      return mul.apply(R, args);
    }

    R.add = function() {
      var args = map(arguments, function(arg) {
        return arr(R, arg);
      })
      return add.apply(R, args);
    }

    expect(R(
      R.mul(
        R.add(
          2,
          R.mul(
            4,
            6)),
        R.add(
          3,
          5,
          7)))
    ).toEqual(390);
  });

  it("1.1.4 Compound Procedures", function() {
    var environment = {};

    /*
    R.define(['square', 'x'],
      [R.mul, 'x', 'x']); // quoted syntax
    */
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

  describe("1.1.6 Conditional Expressions and Predicates", function() {

    it("Expressions and Predicates", function() {
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

    it("Excercise 1.1", function() {
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
      for(let test of tests) {
        let [expression, expectedResult] = test;
        var actualResult = arr(environment, expression);
        expect(actualResult).toEqual(expectedResult);
      };
    });

    it("Excercise 1.2", function() {
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

    it("Excercise 1.3", function() {
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

    it("Excercise 1.4", function() {
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

    it("Excercise 1.5", function() {
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
  });

  describe("1.1.7 Example: Square Roots by Newton's Method", function() {
    it("Newton's Method", function() {
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

      for(let expression of expressions) {
        var actualResult = arr(environment, expression);
        expect(actualResult).toEqual(jasmine.any(Function));
      }

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

      for(let test of tests) {
        let [expression, expectedResult] = test;
        var actualResult = arr(environment, expression);
        expect(actualResult).toEqual(expectedResult);
      };

    });

    // i'm skipping excercise 1.6, as it's just a variant of 1.5

    it("Excercise 1.7", function() {
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

      for(let expression of expressions) {
        var actualResult = arr(environment, expression);
        expect(actualResult).toEqual(jasmine.any(Function));
      }

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

      for(let test of tests) {
        let [expression, expectedResult] = test;
        var actualResult = arr(environment, expression);
        expect(actualResult).toEqual(expectedResult);
      };

      expect(function() {
        environment.sqrt(90000000000000); // this just crashes because of a stack overflow
      }).toThrow();

      // now we change the isGoogEnough function

      expressions = [
        [define, ['isGoodEnough', 'guess', 'x'],
          [lt, [abs, [sub, 1.0, [div, ['improve', 'guess', 'x'], 'guess']]], 0.001]]
      ];

      for(let expression of expressions) {
        var actualResult = arr(environment, expression);
        expect(actualResult).toEqual(jasmine.any(Function));
      }

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

      for(let test of tests) {
        let [expression, expectedResult] = test;
        var actualResult = arr(environment, expression);
        expect(actualResult).toEqual(expectedResult);
      };
    });

    it("Excercise 1.8", function() {
      var environment = {
        square: function(a) { return a*a; }
      };

      // same algorithm as above with the improved isGoodEnough and the new improve function
      var expressions = [
        [define, ['cubeRootIter', 'guess', 'x'],
          [iff, ['isGoodEnough', 'guess', 'x'],
          'guess',
          ['cubeRootIter', ['improve', 'guess', 'x'], 'x']]],
        [define, ['improve', 'guess', 'x'],
          [div,
            [add,
              [div,
                'x',
                ['square', 'guess']],
              [mul,
                2,
                'guess']],
            3]],
        [define, ['average', 'x', 'y'],
          [div, [add, 'x', 'y'], 2]],
        [define, ['isGoodEnough', 'guess', 'x'],
          [lt, [abs, [sub, 1.0, [div, ['improve', 'guess', 'x'], 'guess']]], 0.001]],
        [define, ['cubeRoot', 'x'],
          ['cubeRootIter', 1.0, 'x']]
      ];

      for(let expression of expressions) {
        var result = arr(environment, expression);
        expect(result).toEqual(jasmine.any(Function));
      }

      var tests = [
        [['cubeRoot', 8],
         2.000004911675504], // should be 2 (good enough)
        [['cubeRoot', 27],
         3.001274406506175], // should be 3 (good enough)
        [['cubeRoot', 64],
         4.000017449510739], // should be 4 (good enough)
        [['cubeRoot', 125],
         5.00003794283566]   // should be 5 (good enough)
      ];

      for(let test of tests) {
        let [expression, expectedResult] = test;
        var actualResult = arr(environment, expression);
        expect(actualResult).toEqual(expectedResult);
      }
    });

  });

  describe("1.1.8 Procedures as Black-Box Abstractions", function() {

    it("square variant", function() {
      var environment = {};
      var expressions = [
        [define, ['square', 'x'],
          [exp, ['double', [log, 'x']]]],
        [define, ['double', 'x'],
          [add, 'x', 'x']]
      ];

      for(let expression of expressions) {
        var result = arr(environment, expression);
        expect(result).toEqual(jasmine.any(Function));
      }

      // due to the use of logarithms, squares of negative numbers cannot be generated (the absolute value should be used in that case)
      var epsilon = 0.0000000000001;
      for(var i=0; i<10; i++) {
        var approximation = environment.square(i);
        var reference = i * i;
        var error = Math.abs(approximation - reference);

        expect(error).toBeLessThan(epsilon);
      }

    });

    it("block structure", function() {
      var environment = {
        square: function(x) { return x*x; }
      };
      var expression =
        [define, ['sqrt', 'x'],
          [define, ['isGoodEnough', 'guess', 'x'],
            [lt, [abs, [sub, ['square', 'guess'], 'x']], 0.001]],
          [define, ['improve', 'guess', 'x'],
            ['average', 'guess', [div, 'x', 'guess']]],
          [define, ['sqrtIter', 'guess', 'x'],
            [iff, ['isGoodEnough', 'guess', 'x'],
              'guess',
              ['sqrtIter', ['improve', 'guess', 'x'], 'x']]],
          [define, ['average', 'x', 'y'],
            [div, [add, 'x', 'y'], 2]],
          ['sqrtIter', 1.0, 'x']
        ];

      var result = arr(environment, expression);
      expect(result).toEqual(jasmine.any(Function));

      var epsilon = 0.001;
      for(var i=0; i<10; i++) {
        var approximation = environment.sqrt(i);
        var error = Math.abs((approximation * approximation) - i);

        expect(error).toBeLessThan(epsilon);
      }

    });

    it("lexical scoping (minimal example)", function() {
      var environment = {};
      var expression =
        [define, ['test1', 'a'], //  function test1(a) {
          [define, ['test2'],    //    function test2() {
            [add, 'a', 1]        //      return a + 1;
          ],                     //    }
          ['test2']              //    return test2(a);
        ];                       //  }

        var inc = arr(environment, expression);
        expect(inc(0)).toEqual(1);
    });

    it("lexical scoping", function() {
      var environment = {
        square: function square (x) { return x*x; }
      };
      var epsilon = 0.001;
      var expression =
        [define, ['sqrt', 'x'],
          [define, ['isGoodEnough', 'guess'],
            [lt, [abs, [sub, ['square', 'guess'], 'x']], epsilon]],
          [define, ['improve', 'guess'],
            ['average', 'guess', [div, 'x', 'guess']]],
          [define, ['sqrtIter', 'guess'],
            [iff, ['isGoodEnough', 'guess'],
              'guess',
              ['sqrtIter', ['improve', 'guess']]]],
          [define, ['average', 'x', 'y'],
            [div, [add, 'x', 'y'], 2]],
          ['sqrtIter', 1.0]
        ];

      var result = arr(environment, expression);
      expect(result).toEqual(jasmine.any(Function));

      for(var i = 0; i < 10; ++i) {
        var approximation = environment.sqrt(i);
        var error = Math.abs((approximation * approximation) - i);

        expect(error).toBeLessThan(epsilon);
      }
    });

  });

  describe("1.2.1 Linear Recursion and Iteration", function() {

    it("recursive variant", function () {
      var environment = {};
      var expression =
        [define, ['factorial', 'n'],
          [iff, [eq, 'n', 1],
            1,
            [mul, 'n', ['factorial', [sub, 'n', 1]]]
          ]
        ];
      var result = arr(environment, expression);
      expect(result).toEqual(jasmine.any(Function));
      expect(environment.factorial(6)).toEqual(720);
    });

    it("iterative variant preparation", function () {

      var environment = {};
      var expressions = [
        [define, ['identity', 'n'],
          ['identity2', 1, 'n']
        ],
        [define, ['identity2', 'a', 'n2'],
          [add, 10, 'n2'],
        ]
      ];

      for(let expression of expressions) {
        var result = arr(environment, expression);
        expect(result).toEqual(jasmine.any(Function));
      }

      expect(environment.identity(6)).toEqual(16);

    });

    it("iterative variant", function () {
      var environment = {};
      var expressions = [
        [define, ['factorial', 'n'],
          ['fact-iter', 1, 1, 'n']
        ],
        [define, ['fact-iter', 'product', 'counter', 'max-count'],
          [iff, [gt, 'counter', 'max-count'],
            'product',
            ['fact-iter',
              [mul, 'counter', 'product'],
              [add, 'counter', 1],
              'max-count'
            ]
          ]
        ]
      ];

      for(let expression of expressions) {
        var result = arr(environment, expression);
        expect(result).toEqual(jasmine.any(Function));
      }

      expect(environment.factorial(6)).toEqual(720);
    });

    it("Exercise 1.9 a", function () {
      var environment = {};
      var expressions = [
        [define, ['+', 'a', 'b'],
          [iff, [eq, 'a', 0],
            'b',
            ['inc', ['+', ['dec', 'a'], 'b']]]],

        [define, ['inc', 'a'],
          [add, 'a', 1]],

        [define, ['dec', 'a'],
          [sub, 'a', 1]],
      ];

      for(let expression of expressions) {
        var result = arr(environment, expression);
        expect(result).toEqual(jasmine.any(Function));
      }

      expect(environment['+'](3, 2)).toEqual(5);
    });

    it("Exercise 1.9 b", function () {
      var environment = {};
      var expressions = [
        [define, ['+', 'a', 'b'],
          [iff, [eq, 'a', 0],
              'b',
              ['+', ['dec', 'a'], ['inc', 'b']]]],

        [define, ['inc', 'a'],
          [add, 'a', 1]],

        [define, ['dec', 'a'],
          [sub, 'a', 1]],
      ];

      for(let expression of expressions) {
        var result = arr(environment, expression);
        expect(result).toEqual(jasmine.any(Function));
      }

      expect(environment['+'](3, 2)).toEqual(5);
    });

    it("Exercise 1.10", function () {
      var environment = {};
      var expression =
        [define, ['A', 'x', 'y'],
          [cond,
            [[eq, 'y', 0], 0],
            [[eq, 'x', 0], [mul, 2, 'y']],
            [[eq, 'y', 1], 2],
            [true, ['A',
              [sub, 'x', 1], // "else" would work aswell because it is truthy
              ['A', 'x', [sub, 'y', 1]]]]]];

      var result = arr(environment, expression);
      expect(result).toEqual(jasmine.any(Function));

      // base cases
      expect(environment.A(0, 10)).toEqual(20);
      expect(environment.A(0, 100)).toEqual(200);

      expect(environment.A(1, 0)).toEqual(0); // 0
      expect(environment.A(1, 1)).toEqual(2); // 2
      expect(environment.A(1, 2)).toEqual(4); // A(1,2) = A(0, A(1,1)) = A(0, 2) = 4
      expect(environment.A(1, 3)).toEqual(8); // A(1,3) = A(0, A(1,2)) = A(0, 4) = 8
      expect(environment.A(1, 10)).toEqual(1024); // A(1,10) = A(0, A(1, 9)) = 2 * A(1, 9) = ... = 2^10

      // this is not the same function that is described in wikepedia or the one used by wolfram alpha!
      // have not yet figured out the values for this
      expect(environment.A(2, 1)).toEqual(2); // A(2,1) = 2
      expect(environment.A(2, 2)).toEqual(4); // A(2,2) = A(1, A(2,1)) = A(1, 2) = 4
      expect(environment.A(2, 3)).toEqual(16); // A(2,3) = A(1, A(2,2)) = A(1, A(1, A(2,1))) = A(1, 4) = 2^2^2 = 16
      expect(environment.A(2, 4)).toEqual(65536); // A(2,4) = A(1, A(2, 3) = A(1, 16) = 2^2^2^2 = 2^16

      // these are the actual tests from sicp
      expect(function() {environment.A(4, 4)}).toThrow();

      // concise definitions
      // i'm reinterpreting the assignment to mean: give concise scheme expressions and
      // give a few examples that evaluate to the same result
      let expressions = [
        {
          original: [define, ['f', 'n'], ['A', 0, 'n']], // 2 * n
          concise:  [define, ['f2', 'n'], [mul, 2, 'n']],
        },
        {
          original: [define, ['g', 'n'], ['A', 1, 'n']], //  2 ^ n
          concise:  [define, ['g2', 'n'], [Math.pow, 2, 'n']],
        },
        // {
        //   original: [define, ['h', 'n'], ['A', 2, 'n']], // 2 ^ 2 ^ n
        //   concise:  [define, ['h2', 'n'], [Math.pow, 2, [Math.pow, 2, 'n']]],
        // },
        // well this is awkward, the concise mathematical definition is 2^2^...^2^2 (as many twos as n),
        // but writing that in schema requires recursion
        {
          original: [define, ['k', 'n'], [mul, 5, 'n', 'n']], // 5*n^2
          concise:  [define, ['k2', 'n'], [mul, 5, [Math.pow, 'n', 2]]], // 5*n^2
        },
      ];

      for(let expression of expressions) {
        let originalFn = arr(environment, expression.original);
        expect(originalFn).toEqual(jasmine.any(Function));

        let conciseFn = arr(environment, expression.concise);
        expect(conciseFn).toEqual(jasmine.any(Function));

        for(let n = 1; n < 5; ++n) {
          expect(originalFn(n)).toEqual(conciseFn(n));
        }
      }
    });
  });

  describe("1.2.2 Tree Recursion", function () {
    it("Fibbonacci recursive", function() {
      var environment = {};
      let expression = 
        [define, ['fib', 'n'],
          [cond,
            [[eq, 'n', 0], 0],
            [[eq, 'n', 1], 1],
            [true, [add, ['fib', [sub, 'n', 1]],
                   ['fib', [sub, 'n', 2]]]]]];
      arr(environment, expression);

      let expected = [0,1,1,2,3,5,8,13,21];
      expect(arr(environment, [map, [range, expected.length], "fib"])).toEqual(expected);
    });

    it("Fibbonacci iterative", function() {
      var environment = {};
      let expressions = [
        [define, ['fib', 'n'],
          ['fib-iter', 1, 0, 'n']],

        [define, ['fib-iter', 'a', 'b', 'count'],
          [iff, [eq, 'count', 0],
              'b',
              ['fib-iter', [add, 'a', 'b'], 'a', [sub, 'count', 1]]]]
      ];

      for(let expression of expressions) {
        arr(environment, expression);
      }

      let expected = [0,1,1,2,3,5,8,13,21];
      expect(arr(environment, [map, [range, expected.length], "fib"])).toEqual(expected);
    });

    it("Example: Counting change", function() {
      var environment = {};
      let expressions = [
        [define, ['count-change', 'amount'],
          ['cc', 'amount', 5]],
        [define, ['cc', 'amount', 'kinds-of-coins'],
          [cond, [[eq, 'amount', 0], 1],
                [[or, [lt, 'amount', 0], [eq, 'kinds-of-coins', 0]], 0],
                [true, [add, ['cc', 'amount',
                             [sub, 'kinds-of-coins', 1]],
                         ['cc', [sub, 'amount',
                                ['first-denomination', 'kinds-of-coins']],
                             'kinds-of-coins']]]]],

        [define, ['first-denomination', 'kinds-of-coins'],
          [cond, [[eq, 'kinds-of-coins', 1], 1],
                [[eq, 'kinds-of-coins', 2], 5],
                [[eq, 'kinds-of-coins', 3], 10],
                [[eq, 'kinds-of-coins', 4], 25],
                [[eq, 'kinds-of-coins', 5], 50]]]
      ];
      for(let expression of expressions) {
        arr(environment, expression);
      }

      expect(arr(environment, ['count-change', 100])).toEqual(292);
    });

    it("Exercise 1.11 recursive", function() {
      var environment = {};
      let expression =
        [define, ['f', 'n'],
          [iff, [lt, 'n', 3],
            'n',
            [add,
              ['f', [sub, 'n', 1]],
              [mul, 2, ['f', [sub, 'n', 2]]],
              [mul, 3, ['f', [sub, 'n', 3]]]]]];

      arr(environment, expression);

      let expected = [ 0, 1, 2, 4, 11, 25, 59, 142, 335, 796 ];
      expect(arr(environment, [map, [range, 10], 'f'])).toEqual(expected);
    });

    it("Exercise 1.11 iterative", function() {
      var environment = {};
      let expressions = [
        [define, ['f', 'n'],
          ['f-iter', 0, 1, 2, 'n']],

        [define, ['f-iter', 'a', 'b', 'c', 'count'],
          [cond,
            [[eq, 'count', 0], 'a'],
            [[eq, 'count', 1], 'b'],
            [[eq, 'count', 2], 'c'],
            [true, ['f-iter',
                'b',
                'c',
                [add,
                  'c',
                  [mul, 2, 'b'],
                  [mul, 3, 'a']],
                [sub, 'count', 1]]]]]
      ];

      for(let expression of expressions) {
        arr(environment, expression);
      }

      let expected = [ 0, 1, 2, 4, 11, 25, 59, 142, 335, 796 ];
      expect(arr(environment, [map, [range, 10], 'f'])).toEqual(expected);
    });

    // it("Exercise 1.12", function() {
    // });

    // skipping Exercise 1.13 because no programming is involved

    // TODO: do excercises https://web.archive.org/web/20070221002707/http://mitpress.mit.edu/sicp/chapter1/node13.html
    // TODO: implement tail recursion

  });
});

