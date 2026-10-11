Check whether a pop order could have come from a push order through one stack.

Items are pushed onto an empty stack in the order listed by `pushed`, and at any moment the top item may be popped. The popped items, in order, should equal `popped`. All values are distinct and `popped` is a rearrangement of `pushed`.

Given both orders, return `true` when the pop sequence is achievable and `false` otherwise.

**Example 1:**
```
Input: pushed = [1,2,3,4,5], popped = [4,5,3,2,1]
Output: true
Explanation: Push 1, 2, 3, 4, pop 4, push 5, pop 5, then pop 3, 2, 1 from the top down.
```

**Example 2:**
```
Input: pushed = [1,2,3,4,5], popped = [4,3,5,1,2]
Output: false
Explanation: After popping 4 and 3, the value 1 sits buried under 2, so it cannot leave before 2.
```

**Constraints:**
- `1 <= pushed.length <= 1000`
- `0 <= pushed[i] <= 1000`
- Values in `pushed` are pairwise distinct.
- `popped` holds exactly the same values in some order.
