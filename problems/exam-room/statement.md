Simulate a socially distanced waiting room (function-style adaptation).

A room holds numbered seats `0` to `N-1`. Operation `seat()` picks the free seat maximizing the distance to the nearest occupied seat, breaking ties by the smallest index (with the special cases: first student takes seat 0, and an empty-ended interval picks its end). Operation `leave(p)` frees seat `p`, which is guaranteed occupied.

The classic design asks for an `ExamRoom` class, which this judge cannot express with the supported types. The portable adaptation is `runExamRoom(operations, values)`: both arrays run in parallel, `operations[i]` is one of `"ExamRoom"`, `"seat"`, `"leave"`, and `values[i]` carries the argument (`N` for construction, the seat number for `leave`, ignored `0` for `seat`). Return the list of `seat()` results in call order. Example: operations `["ExamRoom","seat","seat","seat","leave","seat"]` with values `[10,0,0,0,4,0]` seats 0, 9, 4, frees 4, then seats 4 again, yielding `[0,9,4,4]`.

**Constraints:**
- `1 <= N <= 10^9` (tests use small N for speed).
- `1 <= operations.length <= 200`
- `leave(p)` always names an occupied seat.
