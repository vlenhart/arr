describe("arr", function() {
  var environment = {};

  it("should be able to do FizzBuzz", function() {
    var toTest = arr(environment,
      [map,
        [range, 1, 101],
        [lambda, 'number',
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
    var toTest = arr(environment,
      [map,
        [range, 10],
        [lambda, 'n',
          [mul, 'n', 'n', 'n']]]
    );

    var correct = [0, 1, 8, 27, 64, 125, 216, 343, 512, 729];

    expect(environment).toEqual({});
    expect(toTest).toEqual(correct);
  });

  it("should be able to reverse strings", function() {
    var stringReverse = arr(environment,
      [defun, 'reverse', 'original', 'reversed',
        [cond,
          [[not, 'reversed'], ['reverse', 'original', '']],
          [[not, 'original'], 'reversed'],
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