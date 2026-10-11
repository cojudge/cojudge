A collection of sticks is described by the integer array `matchsticks`, where the entry `matchsticks[i]` records how long the `ith` stick is. The goal is to arrange every single stick into the border of one square: sticks may be joined end to end, but none may be snapped or shortened, and each stick has to appear in the construction precisely once.

Decide whether such an arrangement exists: produce `true` when the whole set can form a square, and `false` when it cannot.

**Example 1:**

```
Input: matchsticks = [1,1,2,2,2]
Output: true
Explanation: A square of side length 2 is possible, with three sides each built from one stick of length 2 and the remaining side built from two sticks of length 1.
```

**Example 2:**

```
Input: matchsticks = [3,3,3,3,4]
Output: false
Explanation: There is no way to group the complete set of sticks into four sides of equal length.
```

**Constraints:**

- `1 <= matchsticks.length <= 15`
- `1 <= matchsticks[i] <= 10^8`
