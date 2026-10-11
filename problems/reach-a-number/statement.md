You start at position `0` on an endless number line and want to reach `target`, which is never zero.

On move number `i` (counting from 1), you must walk exactly `i` steps either to the left or to the right. Moves accumulate: after three moves you have walked 1 + 2 + 3 steps split by direction choices.

Return the smallest number of moves that can land exactly on `target`.

**Example 1:**
```
Input: target = 2
Output: 3
Explanation: Go right 1 to reach 1, left 2 to reach -1, then right 3 to reach 2.
```

**Example 2:**
```
Input: target = 3
Output: 2
Explanation: Go right 1 to reach 1, then right 2 to reach 3.
```

**Example 3:**
```
Input: target = 4
Output: 3
Explanation: Steps of 1, 2 and 3 can combine as -1 - 2 + 3 = 0? No. One working choice is right 1, left 2, right 3? That gives 2. Actually right 1, right 2, left 3 gives 0. The optimum uses left 1, left 2, right 3? That is 0 too. A valid 3-move route is -1 + 2 + 3 = 4 by going left, then right, then right.
```

**Constraints:**
- `-10^9 <= target <= 10^9`
- `target != 0`
