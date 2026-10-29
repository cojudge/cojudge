Design a hit counter that records hits at given timestamps (in seconds) and answers how many hits happened during the 5 minutes (300 seconds) ending now. A hit at time `t` counts for a query at time `T` exactly when `T - 300 < t <= T`.

Implement the `HitCounter` class:

- `HitCounter()` Initializes the object.
- `void hit(int timestamp)` Records a hit at `timestamp`.
- `int getHits(int timestamp)` Returns the number of hits in the past 5 minutes ending at `timestamp`.

All calls are made with non-decreasing `timestamp`.

The class keeps its LeetCode name `HitCounter` here (instead of `Solution`) because the judge harness reserves `Solution` for its driver; the constructor and methods match the original.

Grading is deterministic: every `getHits` answer is compared exactly against a queue-based reference model.

**Example 1:**
```
Input: operations = ["HitCounter","hit","hit","hit","getHits"], values = [[],[1],[2],[3],[4]]
Output: [null,null,null,null,3]
Explanation: Hits at 1, 2 and 3 are all inside the window (4-300, 4], so getHits(4) returns 3.
```

**Example 2:**
```
Input: operations = ["HitCounter","hit","hit","getHits","getHits"], values = [[],[1],[2],[301],[302]]
Output: [null,null,null,1,0]
Explanation: At time 301 the window is (1, 301]: the hit at 1 has expired but the hit at 2 still counts. At 302 both hits have expired.
```

**Example 3:**
```
Input: operations = ["HitCounter","getHits"], values = [[],[100]]
Output: [null,0]
Explanation: With no hits recorded, the query returns 0.
```

**Constraints:**
- `1 <= timestamp <= 2 * 10^9`
- All calls are made with non-decreasing `timestamp`.
- At most `300` calls will be made to `hit` and `getHits`.
