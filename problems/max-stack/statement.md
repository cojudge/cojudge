Design a stack that can also report and remove its maximum in addition to the usual push, pop and top.

Implement the `MaxStack` class:

- `MaxStack()` Initializes the stack object.
- `void push(int x)` Pushes `x` onto the stack.
- `int pop()` Removes the element on top of the stack and returns it.
- `int top()` Returns the element on top of the stack without removing it.
- `int peekMax()` Returns the maximum element in the stack without removing it.
- `int popMax()` Returns the maximum element in the stack and removes it. If there are multiple copies of the maximum, only the one closest to the top is removed.

The class keeps its LeetCode name `MaxStack` (the harness reserves `Solution` for the driver); the constructor and methods match the original.

**Example 1:**
```
Input: operations = ["MaxStack","push","push","push","top","popMax","top","peekMax","pop","top"], values = [[],[5],[1],[5],[],[],[],[],[],[]]
Output: [null,null,null,null,5,5,1,5,1,5]
Explanation: Push 5, 1, 5. Top is 5; popMax removes the upper 5; top is 1; peekMax is 5; pop removes 1; top is 5.
```

**Example 2:**
```
Input: operations = ["MaxStack","push","push","popMax","top"], values = [[],[1],[2],[],[]]
Output: [null,null,null,2,1]
Explanation: Push 1 then 2; popMax removes 2; top is 1.
```

**Example 3:**
```
Input: operations = ["MaxStack","push","push","peekMax","pop","peekMax"], values = [[],[2],[7],[],[],[]]
Output: [null,null,null,7,7,2]
Explanation: Push 2 then 7; the max is 7; pop removes 7; the max becomes 2.
```

**Constraints:**
- Values fit in a 32-bit signed integer.
- At most `10^4` calls will be made to `push`, `pop`, `top`, `peekMax` and `popMax` in total.
- Every `pop`, `top`, `peekMax` or `popMax` call has at least one element present; every trace begins with `MaxStack`.
