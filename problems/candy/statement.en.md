`n` youngsters form a single queue.

An integer array `ratings` assigns each youngster a score.

Sweets are handed out under both of these stipulations:

- Every youngster collects at least one sweet.
- Whenever one youngster's score exceeds an immediate neighbour's score, the higher-scored youngster collects strictly more sweets than that neighbour.

Report the least total quantity of sweets sufficient to satisfy the whole queue.

**Constraints:**

- `1 <= n == ratings.length <= 5 * 10^4`
- `0 <= ratings[i] <= 5 * 10^4`
