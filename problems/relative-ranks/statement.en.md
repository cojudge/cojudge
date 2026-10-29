Competitors finish a race with pairwise different scores, where a larger score means a better placement. Rank the competitors from best (rank 1) to worst (rank n) and label each original position: rank 1 becomes `"Gold Medal"`, rank 2 becomes `"Silver Medal"`, rank 3 becomes `"Bronze Medal"`, and every later rank `k` becomes the plain number `"k"`.

Given the scores in starting order, return the label for each competitor in that same order.

**Constraints:**
- `1 <= score.length <= 10^4`
- `0 <= score[i] <= 10^6`
- All values in `score` are distinct
