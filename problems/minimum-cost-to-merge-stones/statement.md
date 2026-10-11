You are given a row of stone piles `stones`, where `stones[i]` counts the stones
in pile `i`, and an integer `k`. One move merges exactly `k` consecutive piles
into a single pile, and the cost of that move equals the total number of
stones in those `k` piles. The merged pile keeps the summed count and takes
part in later moves.

Repeat moves until a single pile remains. Return the smallest achievable total
cost. When the piles can never collapse into one, return `-1`.

**Example 1:**
```
Input: stones = [3,2,4,1], k = 2
Output: 20
Explanation: Merge pairwise from the left: costs 5, 9 and 6 accumulate to 20.
```

**Example 2:**
```
Input: stones = [3,2,4,1], k = 3
Output: -1
Explanation: Four piles cannot shrink to one by removing two piles per move.
```

**Example 3:**
```
Input: stones = [3,5,1,2,6], k = 3
Output: 25
Explanation: First merge [5,1,2] at cost 8, then merge everything at cost 17.
```

**Constraints:**
- `1 <= stones.length <= 30`
- `1 <= stones[i] <= 100`
- `2 <= k <= 30`
