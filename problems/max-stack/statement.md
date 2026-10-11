Design a stack that can also report and remove its maximum in addition to the usual push, pop and top.

Supported steps, encoded as parallel lists `operations` and `values` (use `0` when a step takes no argument):

- `push(x)`: place `x` on top.
- `pop()`: remove and return the top value.
- `top()`: return the top value without removing it.
- `peekMax()`: return the largest value in the stack.
- `popMax()`: remove and return the largest value; when several copies share the maximum, remove the one nearest the top.

Only the last four actions produce output; collect those answers in call order.

*Adaptation note:* the entry point is `runMaxStack(operations, values)` returning the answer list.

**Example 1:**
```
Input: operations = ["push","push","push","top","popMax","top","peekMax","pop","top"], values = [5,1,5,0,0,0,0,0,0]
Output: [5,5,1,5,1,5]
Explanation: Stack becomes [5,1,5]. Top is 5, popMax drops the upper 5 leaving [5,1], top is 1, max is 5, pop drops 1, top is 5.
```

**Example 2:**
```
Input: operations = ["push","push","popMax","top"], values = [1,2,0,0]
Output: [2,1]
Explanation: Push 1 then 2; popMax removes 2; top is 1.
```

**Example 3:**
```
Input: operations = ["push","push","top","pop","top"], values = [4,4,0,0,0]
Output: [4,4,4]
Explanation: Duplicate tops behave like any other values.
```

**Constraints:**
- `1 <= operations.length <= 2000`
- Values fit in a 32-bit signed integer.
- Every pop, top, peekMax or popMax call has at least one element present.
