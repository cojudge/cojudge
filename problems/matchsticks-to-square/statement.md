A collection of sticks is described by the integer array `matchsticks`, where the entry `matchsticks[i]` records how long the `ith` stick is. The goal is to arrange every single stick into the border of one square: sticks may be joined end to end, but none may be snapped or shortened, and each stick has to appear in the construction precisely once.

Decide whether such an arrangement exists: produce `true` when the whole set can form a square, and `false` when it cannot.

**Constraints:**

- `1 <= matchsticks.length <= 15`
- `1 <= matchsticks[i] <= 10^8`
