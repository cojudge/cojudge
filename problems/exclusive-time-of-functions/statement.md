You are given `n` single-threaded functions labeled `0` through `n - 1`, plus a log list describing when each function starts and ends. Every entry looks like `"id:start|end:timestamp"` with an integer timestamp, for example `"0:start:0"`. Exactly one function runs at any moment; a running function pauses while a nested function executes.

For every function, add up only the time slices during which that function itself is on top of the call stack. An `end` stamp covers the whole time unit, so a call from `2` to `5` occupies 4 units (`5 - 2 + 1`).

Implement `exclusiveTime(n, logs)` returning an array where position `i` holds the exclusive total for function `i`. Logs arrive in timestamp order and always form valid nesting.

**Example 1:**
```
Input: n = 2, logs = ["0:start:0","1:start:2","1:end:5","0:end:6"]
Output: [3,4]
Explanation: Function 0 runs during [0,1] and [6,6] (3 units); function 1 runs during [2,5] (4 units).
```

**Example 2:**
```
Input: n = 1, logs = ["0:start:0","0:start:2","0:end:5","0:start:6","0:end:6","0:end:7"]
Output: [8]
Explanation: Nested and sequential self-calls merge to 8 units over [0,7].
```

**Example 3:**
```
Input: n = 2, logs = ["0:start:0","0:end:0","1:start:1","1:end:1"]
Output: [1,1]
```

**Constraints:**
- `1 <= n <= 100`
- `1 <= logs.length <= 500`
- Each log is `"id:start|end:timestamp"`, `0 <= id < n`, `0 <= timestamp <= 10^9`.
- Logs are sorted by timestamp and describe properly nested, non-crossing calls.
