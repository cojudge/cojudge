Pay for wrong guesses and guarantee a win with the least worst-case cash.

A hidden integer lies between `1` and `n` inclusive. You name guesses; each miss costs the guessed value in dollars and tells you whether the hidden value is higher or lower, then you continue. A hit costs nothing extra and ends the game. Compute the smallest bankroll that guarantees finding the hidden value no matter which one it is.

**Example 1:**
```
Input: n = 1
Output: 0
Explanation: Only one candidate exists, so naming it wins for free.
```

**Example 2:**
```
Input: n = 2
Output: 1
Explanation: Name 1 first. A hit is free; a miss costs 1 and leaves only 2.
```

**Example 3:**
```
Input: n = 10
Output: 16
Explanation: An optimal first guess splits the interval so the worst branch costs 16.
```

**Constraints:**
- `1 <= n <= 200`
