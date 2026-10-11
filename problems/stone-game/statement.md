Alice and Bob compete over a single row of stone piles. The row holds an even count of piles, and `piles[i]` records how many stones sit in the `i`-th pile, always a positive integer.

The combined stone count is odd, so the final totals cannot match.

Alice moves first and the two alternate. On every move the player whose turn it is removes one whole pile, choosing freely between the leftmost remaining pile and the rightmost remaining pile. Play proceeds this way until the row is empty; whoever has collected more stones is the winner.

Both sides choose as well as possible. Return `true` when that optimal play leaves Alice ahead, and `false` when it leaves Bob ahead.

**Example 1:**
```
Input: piles = [5,3,4,5]
Output: true
Explanation: Alice opens and must commit to one of the 5s on either side. Suppose she removes the left 5, leaving [3, 4, 5]. If Bob then removes 3, the row is [4, 5] and Alice secures 5 next, finishing ahead 10 to 7. If Bob instead removes the right 5, the row is [3, 4] and Alice secures 4 next, finishing ahead 9 to 8.
```

**Example 2:**
```
Input: piles = [3,7,2,3]
Output: true
```

**Constraints:**
- 2 ≤ piles.length ≤ 500
- piles.length is even.
- 1 ≤ piles[i] ≤ 500
- sum(piles[i]) is odd.
