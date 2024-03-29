# quantumCompute

Quantum computation simulator in Typescript

## Qubit

A [qubit](https://en.wikipedia.org/wiki/Qubit) represents a quantum bit which is the basic unit of computation.

A qubit is represented in array notation as [a, b],
where `a^2` is the probability of finding the qubit in 0 state
and `b^2` is the probability of finding the qubit in 1 state.

It can be created initially in 0 or 1 state.

In array notation,

```
0 state: [1, 0]
1 state: [0, 1]
```

When `measure` method is called on a qubit, it collapses into either 0 or 1 based on its internal probability distribution.

## Gates

A qubit can be passed through multiple [logic gates](https://en.wikipedia.org/wiki/Quantum_logic_gate). All gates must be reversible.

### Not gate

A not gate inverts the state of a qubit.

```
const qubit = new Qubit(0);
qubit.appy(new Not());
qubit.measure(); // This will return 1 always

qubit.apply(new Not());
qubit.measure(); // This will return 0 always
```

### Hadamard gate

A [hadamard](https://en.wikipedia.org/wiki/Quantum_logic_gate#Hadamard_(H)_gate) gate puts a qubit into superimposition. A hadamard gate is also reversible. Applying a hadamard gate on an already superimposed qubit will give back the original state of the qubit before superimposition.

In matrix notation, it is equivalent to multiplying the internal state of a qubit by `[[1/√2, 1/√2], [1/√2, -1/√2]]`

Eg:

Passing a 0 state qubit through a hadamard gate and passing the superimposed qubit through the hadamard gate
again to get the initial 0 state:

```
[[1/√2, 1/√2], [1/√2, -1/√2]] * [1, 0] = [1/√2, 1/√2]
[[1/√2, 1/√2], [1/√2, -1/√2]] * [1/√2, 1/√2] = [1, 0]

```

Passing a 1 state qubit through a hadamard gate and passing the superimposed qubit through the hadamard gate
again to get the initial 1 state:

```
[[1/√2, 1/√2], [1/√2, -1/√2]] * [0, 1] = [1/√2, -1/√2]
[[1/√2, 1/√2], [1/√2, -1/√2]] * [1/√2, -1/√2] = [0, 1]

```

Example
```
const qubit1 = new Qubit(0);
qubit1.appy(new Hadamard());
qubit1.measure(); // 50/50 chance either 0 or 1

const qubit2 = new Qubit(1);
qubit2.appy(new Hadamard());
qubit2.measure(); // 50/50 chance either 0 or 1

const aQubit = new Qubit(0).apply(new Hadamard()).apply(new Hadamard());
aQubit.measure() // This will return 0 again

const bQubit = new Qubit(0).apply(new Hadamard()).apply(new Hadamard());
bQubit.measure() // This will return 1 again
```

### Z

[Pauli's Z gate](https://en.wikipedia.org/wiki/Pauli_matrices) shifts the phase of a qubit by pi radians along z-axis.

It is equivalent to multiplying this 2*2 matrix to qubit state [[1, 0], [0, -1]]

```
const qubit = new Qubit(0)
qubit.apply(new Hadamard()); // puts to a superposition [1/√2, 1/√2]
qubit.apply(new Z()); // shifts by pi across z-axiz [1/√2, -1/√2]
qubit.apply(new Hadamard()); // takes it back from superposition to [0, 1]
qubit.measure() // this will always return 1
```

### Cnot

A [Cnot](https://en.wikipedia.org/wiki/Portal:Current_events) - control not, gate works on two qubit - an input and a control qubit.

If the control qubit is 1, it inverts the state of input qubit.
If the control qubit is 0, it preserves the state of input qubit as is.

In matrix notation, a cnot on two qubits `[a0, b0]` and `[a1, b1]` is denoted as,
`[[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]]
  ✕
 ([a0, b0] ⍟ [a1, b1]`
⍟ : [Tensort product](https://en.wikipedia.org/wiki/Tensor_product) of two matrices

This is also akin to the inversion of input qubit when the control qubit is one.

Notes:

1. This framework only allows cnot to be performed between two non entangled qubits.

2. Also, cnot on a superimposed qubit and a non-superimposed qubit results in entanglement. See #Entanglement section for more details.

Eg:

Cnot between non-superimposed qubits when control input is 0

```
Cnot([1, 0], [1, 0]) = [1, 0], [1, 0]
Cnot([0, 1], [1, 0]) = [0, 1], [1, 0]
```

Cnot between non-superimposed qubits when control input is 1

```
Cnot([1, 0], [0, 1]) = [0, 1], [0, 1]
Cnot([0, 1], [0, 1]) = [1, 0], [0, 1]
```


Cnot between superimposed qubits when control input is 0

```
Cnot([1/√2, 1/√2], [1/√2, 1/√2]) = [1/√2, 1/√2], [1/√2, 1/√2]
Cnot([1/√2, -1/√2], [1/√2, 1/√2]) = [1/√2, -1/√2], [1/√2, 1/√2]
```


Cnot between superimposed qubits when control input is 1

```
Cnot([1/√2, 1/√2], [1/√2, -1/√2]) = [1/√2, -1/√2], [1/√2, -1/√2]
Cnot([1/√2, -1/√2], [1/√2, -1/√2]) = [1/√2, 1/√2], [1/√2, -1/√2]
```

## Entanglement

Two qubits are said to be in [entanglement](https://en.wikipedia.org/wiki/Quantum_entanglement), if the qubits state are not independent. The effects of entanglement are non-local and can also take place across huge spatial distance.

Qubits entanglement can be achieved by applying CNOT on a superposed qubit and an absolute qubit.

```
const superPosedQubit = new Qubit(0).apply(new Hadamard());
const absoluteQubit = new Qubit(0);

superPosedQubit.cnot(absoluteQubit)

This effects to CNOT(superPosed ⍟ absoluteQubit)

= CNOT([1/√2, 1/√2] ⍟ [1, 0])
= CNOT([1/√2, 0, 1/√2, 0])
= ([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]) * ([1/√2, 0, 1/√2, 0])
= [1/√2, 0, 0, 1/√2]

If we have to apply tensor product to two qubit states to get the above value
= [a, b] ⍟ [c, d]
Then,
ac = 1/√2
ad = 0
bc = 0
bd =  1/√2

If a = 0, then ac != 1/√2
If d = 0, then bd != 1/√2

Hence, we can see that there are no two qubit states that can independently achieve the resulting 4 state vector [1/√2, 0, 0, 1/√2]. Hence, mathematically superPosedQubit and absoluteQubit are in entanglement.

In this example, there is 50 % probaility of both qubits to be in |00> or |11> but 0% probability to be in |01> or |10>

we can also achieve [0, 1/√2, 1/√2, 0] where there is 50 % probaility of both qubits to be in |10> or |01>  but 0% probability to be in |00> or |11>
by appliying CNOT on superposed qubit and abosulte qubit in state |1>, i.e, new Qubit(0).apply(new Hadamard()).cnot(new Qubit(1))
```

When two qubits are in entaglement, measuring one qubit will also collapse the other qubit to a state according to its probability.

```
In the above example of entangled qubits, entangled at [1/√2, 0, 0, 1/√2],
measuring superposedQubit or absoluteQubit will also collapse other qubit to the same value.

If superPosedQubit.measure() === 0 then absoluteQubit.measure() === 0
If superPosedQubit.measure() === 1 then absoluteQubit.measure() === 1

Hence, superPosedQubit.measure() === absoluteQubit.measure() is true no matter how many times you repeat the experiment.
```

# How to contribute

Check linting `yarn lint`

Run tests `yarn test`

Create Pull request.

Pull requests for new features, bug fixes, and suggestions are welcome!

# License

[MIT](https://en.wikipedia.org/wiki/MIT_License)
