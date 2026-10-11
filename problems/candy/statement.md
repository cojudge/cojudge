`n` youngsters form a single queue.

An integer array `ratings` assigns each youngster a score.

Sweets are handed out under both of these stipulations:

- Every youngster collects at least one sweet.
- Whenever one youngster's score exceeds an immediate neighbour's score, the higher-scored youngster collects strictly more sweets than that neighbour.

Report the least total quantity of sweets sufficient to satisfy the whole queue.

**Example 1:**

```
Input: ratings = [1,0,2]
Output: 5
Explanation: Hand the first, second and third youngster 2, 1 and 2 sweets in turn.
```

**Example 2:**

```
Input: ratings = [1,2,2]
Output: 4
Explanation: Hand the first, second and third youngster 1, 2 and 1 sweets in turn.
```

**Constraints:**

- `1 <= n == ratings.length <= 5 * 10^4`
- `0 <= ratings[i] <= 5 * 10^4`
