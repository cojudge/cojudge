Answer quietness queries over a richer-than hierarchy.

`richer[i] = [a, b]` means person `a` is richer than person `b`. Separately, `quiet[i]` scores how quiet person `i` is (smaller means quieter). For every person `x`, consider `x` together with everyone richer than `x`, directly or transitively. Return an array `answer` where `answer[x]` is the person in that set with the smallest quiet value (ties cannot happen since quiet values are distinct in tests, otherwise pick the smallest index among minima).

**Example 1:**
```
Input: richer = [[1,0],[2,1],[3,1],[3,7],[4,2],[5,3],[6,3]], quiet = [3,2,5,4,6,1,7,0]
Output: [5,5,2,5,4,5,6,7]
Explanation: Person 0's richer set includes 5 (quietest via 5 richer than 3, 3 richer than 1, 1 richer than 0); person 7's set is {7,3,4,5,6} with 7 quietest.
```

**Example 2:**
```
Input: richer = [], quiet = [0]
Output: [0]
Explanation: Only the person themselves qualifies.
```

**Example 3:**
```
Input: richer = [[1,0]], quiet = [1,0]
Output: [1,1]
Explanation: Person 0's set is {0,1} with 1 quieter; person 1's set is {1}.
```

**Constraints:**
- `1 <= quiet.length <= 500`
- `0 <= richer.length <= quiet.length * (quiet.length - 1) / 2`
- `0 <= richer[i][0], richer[i][1] < quiet.length`
- `quiet` values are a permutation of `0..n-1` in tests (distinct).
