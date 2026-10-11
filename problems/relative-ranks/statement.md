Competitors finish a race with pairwise different scores, where a larger score means a better placement. Rank the competitors from best (rank 1) to worst (rank n) and label each original position: rank 1 becomes `"Gold Medal"`, rank 2 becomes `"Silver Medal"`, rank 3 becomes `"Bronze Medal"`, and every later rank `k` becomes the plain number `"k"`.

Given the scores in starting order, return the label for each competitor in that same order.

**Example 1:**
```
Input: score = [5,4,3,2,1]
Output: ["Gold Medal","Silver Medal","Bronze Medal","4","5"]
Explanation: The best score 5 earns gold, then 4 silver, 3 bronze, and the rest keep their numeric ranks.
```

**Example 2:**
```
Input: score = [10,3,8,9,4]
Output: ["Gold Medal","5","Bronze Medal","Silver Medal","4"]
Explanation: Sorted best-first the scores are 10, 9, 8, 4, 3, giving ranks 1..5 mapped back to the input order.
```

**Example 3:**
```
Input: score = [1]
Output: ["Gold Medal"]
Explanation: A single competitor wins gold.
```

**Constraints:**
- `1 <= score.length <= 10^4`
- `0 <= score[i] <= 10^6`
- All values in `score` are distinct
