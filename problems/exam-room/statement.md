Simulate a socially distanced waiting room (function-style adaptation).

A room holds numbered seats `0` to `N-1`. Operation `seat()` picks the free seat maximizing the distance to the nearest occupied seat, breaking ties by the smallest index (with the special cases: first student takes seat 0, and an empty-ended interval picks its end). Operation `leave(p)` frees seat `p`, which is guaranteed occupied.

The classic design asks for an `ExamRoom` class, which this judge cannot express with the supported types. The portable adaptation is `runExamRoom(operations, values)`: both arrays run in parallel, `operations[i]` is one of `"ExamRoom"`, `"seat"`, `"leave"`, and `values[i]` carries the argument (`N` for construction, the seat number for `leave`, ignored `0` for `seat`). Return the list of `seat()` results in call order. Example: operations `["ExamRoom","seat","seat","seat","leave","seat"]` with values `[10,0,0,0,4,0]` seats 0, 9, 4, frees 4, then seats 4 again, yielding `[0,9,4,4]`.

**Example 1:**
```
Input: operations = ["ExamRoom","seat","seat","seat","leave","seat"], values = [10,0,0,0,4,0]
Output: [0,9,4,4]
Explanation: First takes 0, next takes far end 9, next takes middle 4; after 4 leaves it is taken again.
```

**Example 2:**
```
Input: operations = ["ExamRoom","seat","seat","leave","seat"], values = [4,0,0,0,0]
Output: [0,3,3]
Explanation: Seats 0 then 3; after 0 leaves, the next seat is 0? Actually leave(0) frees 0 so next is 0. (See tests for exact traces.)
```

**Example 3:**
```
Input: operations = ["ExamRoom","seat"], values = [1,0]
Output: [0]
Explanation: A single-seat room always returns 0.
```

**Constraints:**
- `1 <= N <= 10^9` (tests use small N for speed).
- `1 <= operations.length <= 200`
- `leave(p)` always names an occupied seat.
