Alice and Bob play another take-away contest on a row of piles, where `piles[i]` gives the stone count of the `i`-th pile, a positive integer. Whoever gathers the most stones by the end wins.

Alice opens and the two alternate moves.

A move always consumes piles from the front of what is left. If `M` is the current limit, the player selects some `X` with `1 <= X <= 2M` and collects the first `X` piles. Afterwards the limit becomes `M = max(M, X)`. The limit starts at `M = 1`.

Removal continues until no pile remains.

Both competitors choose optimally. Return the largest total Alice can finish with.

**Example 1:**
```
Input: piles = [2,7,9,4,4]
Output: 10
Explanation: Opening with one pile lets Bob respond with two piles, after which Alice collects two more piles, giving her 2 + 4 + 4 = 10 in all. Opening with two piles lets Bob answer with three piles, holding Alice to 2 + 7 = 9. Opening with three piles lets Bob sweep the last four piles, again holding Alice to 9. Hence 10 is the best Alice can secure.
```

**Example 2:**
```
Input: piles = [1,2,3,4,5,100]
Output: 104
```

**Constraints:**
- 1 ≤ piles.length ≤ 100
- 1 ≤ piles[i] ≤ 10<sup>4</sup>
