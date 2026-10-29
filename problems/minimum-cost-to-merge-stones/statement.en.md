You are given a row of stone piles `stones`, where `stones[i]` counts the stones
in pile `i`, and an integer `k`. One move merges exactly `k` consecutive piles
into a single pile, and the cost of that move equals the total number of
stones in those `k` piles. The merged pile keeps the summed count and takes
part in later moves.

Repeat moves until a single pile remains. Return the smallest achievable total
cost. When the piles can never collapse into one, return `-1`.

**Constraints:**
- `1 <= stones.length <= 30`
- `1 <= stones[i] <= 100`
- `2 <= k <= 30`
