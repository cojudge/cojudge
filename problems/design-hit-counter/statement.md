Design a hit counter that records hits at given timestamps (in seconds) and answers how many hits happened during the 5 minutes (300 seconds) ending now. A hit at time `t` counts for a query at time `T` exactly when `T - 300 < t <= T`.

Implement the `HitCounter` class:

- `HitCounter()` Initializes the object.
- `void hit(int timestamp)` Records a hit at `timestamp`.
- `int getHits(int timestamp)` Returns the number of hits in the past 5 minutes ending at `timestamp`.

All calls are made with non-decreasing `timestamp`.

The class keeps its LeetCode name `HitCounter` here (instead of `Solution`) because the judge harness reserves `Solution` for its driver; the constructor and methods match the original.

Grading is deterministic: every `getHits` answer is compared exactly against a queue-based reference model.

**Constraints:**
- `1 <= timestamp <= 2 * 10^9`
- All calls are made with non-decreasing `timestamp`.
- At most `300` calls will be made to `hit` and `getHits`.
