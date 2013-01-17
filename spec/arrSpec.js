describe("arr", function() {
  // several examples taken from the holy text (SICP)
  // http://mitpress.mit.edu/sicp/full-text/book/book-Z-H-4.html

  it("allows me to evaluate all programs from sicp chapter 1.1.1 Expressions", function() {
    var environment = {};

    var expression = 486;
    var expectedResult = 486;
    var actualResult = arr(environment, expression);
    expect(environment).toEqual({});
    expect(actualResult).toEqual(expectedResult);
    
    expression = [add, 137, 349];
    expectedResult = 486;
    actualResult = arr(environment, expression);
    expect(environment).toEqual({});
    expect(actualResult).toEqual(expectedResult);

    expression = [sub, 1000, 334];
    expectedResult = 666;
    actualResult = arr(environment, expression);
    expect(environment).toEqual({});
    expect(actualResult).toEqual(expectedResult);

    expression = [mul, 5, 99];
    expectedResult = 495;
    actualResult = arr(environment, expression);
    expect(environment).toEqual({});
    expect(actualResult).toEqual(expectedResult);

    expression = [div, 10, 5];
    expectedResult = 2;
    actualResult = arr(environment, expression);
    expect(environment).toEqual({});
    expect(actualResult).toEqual(expectedResult);

    expression = [add, 2.7, 10];
    expectedResult = 12.7;
    actualResult = arr(environment, expression);
    expect(environment).toEqual({});
    expect(actualResult).toEqual(expectedResult);
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
      [define, ['sum-of-squares', 'x', 'y'],
        [add, ['square', 'x'], ['square', 'y']]];
    result = arr(environment, expression);
    expect(environment.square).toEqual(jasmine.any(Function));

    expression = ['sum-of-squares', 3, 4];
    expectedResult = 25;
    actualResult = arr(environment, expression);
    expect(actualResult).toEqual(expectedResult);

    expression =
      [define, ['f', 'a'],
        ['sum-of-squares', [add, 'a', 1], [mul, 'a', 2]]];
    result = arr(environment, expression);
    expect(environment.square).toEqual(jasmine.any(Function));

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
    for (var i = -5; i <= 5; i++) {
      expect(environment.abs(i)).toEqual(Math.abs(i));
    };

    expression =
      [define, ['abs', 'x'],
        [cond,
          [[lt, 'x', 0], [neg, 'x']],
          ['else', 'x']]];
    result = arr(environment, expression);
    expect(environment.abs).toEqual(jasmine.any(Function));
    for (var i = -5; i <= 5; i++) {
      expect(environment.abs(i)).toEqual(Math.abs(i));
    };

    expression =
      [define, ['abs', 'x'],
        [iff, [lt, 'x', 0],
            [neg, 'x'],
            'x']];
    result = arr(environment, expression);
    expect(environment.abs).toEqual(jasmine.any(Function));
    for (var i = -5; i <= 5; i++) {
      expect(environment.abs(i)).toEqual(Math.abs(i));
    };
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
          [[eq, [length, 'original'], 0], 'reversed'],
          [true, ['reverse',
            [butlast, 'original', 1],
            [append, 'reversed', [last, 'original', 1]]]]
        ]
      ]
    );
    expect(environment.reverse('abc')).toEqual('cba');
    expect(stringReverse('this is a test')).toEqual('tset a si siht');
  });
});