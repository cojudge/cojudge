You are given an array `coins` where `coins[i]` is the price of standing on cell `i+1` (cells are numbered from 1). A value of `-1` means the cell is blocked and can never be used.

Start on cell 1 paying `coins[0]`. From cell `i` you may jump forward between 1 and `maxJump` cells. Each visited cell adds its price. Reach cell `n` (the last cell) as cheaply as possible.

Return the visited cell numbers in order, from 1 to `n`. When several cheapest routes exist, return the lexicographically smallest list. When the last cell cannot be reached, return an empty list.

**Constraints:**
- `1 <= coins.length <= 1000`
- `-1 <= coins[i] <= 100`
- `1 <= maxJump <= 100`
