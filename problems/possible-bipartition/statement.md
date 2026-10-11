There are `n` people numbered `1` to `n`. Each pair in `dislikes` holds two people who refuse to sit in the same group. Decide whether everyone can be split into two groups so that every rival pair lands in different groups.

Return `true` when such a split exists and `false` otherwise.

**Example 1:**
```
Input: n = 4, dislikes = [[1,2],[1,3],[2,4]]
Output: true
Explanation: Put 1 and 4 in one group and 2 and 3 in the other; every rival pair is separated.
```

**Example 2:**
```
Input: n = 3, dislikes = [[1,2],[1,3],[2,3]]
Output: false
Explanation: All three people pairwise dislike each other, so two groups can never separate every pair.
```

**Example 3:**
```
Input: n = 5, dislikes = [[1,2],[2,3],[3,4],[4,5],[1,5]]
Output: false
Explanation: The rivalries form a ring of five, an odd cycle that no two-group split can satisfy.
```

**Constraints:**
- `1 <= n <= 2000`
- `1 <= dislikes.length <= 10^4`
- `dislikes[i] = [a, b]` with `1 <= a, b <= n` and `a != b`
