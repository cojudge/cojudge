A knockout tournament starts with `n` ranked squads numbered `1` through `n`, where `1` is strongest and `n` is weakest. The count `n` is always a power of two.

In every round, the remaining entries are paired strongest-with-weakest: the first remaining entry meets the last, the second meets the second-last, and so on. Each pair is written as `(a,b)`. Winners advance, keeping their bracket text, and the process repeats until one bracket remains.

Build and return the final bracket string directly from `n` (this task is a plain function of `n`, not a class-design simulation).

**Example 1:**
```
Input: n = 4
Output: "((1,4),(2,3))"
Explanation: Round one gives (1,4) and (2,3); the final wraps them together.
```

**Example 2:**
```
Input: n = 8
Output: "(((1,8),(4,5)),((2,7),(3,6)))"
Explanation: Pair outer entries repeatedly, nesting each round in parentheses.
```

**Example 3:**
```
Input: n = 2
Output: "(1,2)"
```

**Constraints:**
- `n` is a power of two, `n == 2^k`
- `1 <= k <= 12` (so `2 <= n <= 4096`)
