A counter receives calls over time. Each call `ping(t)` reports how many calls arrived in the inclusive window `[t - 3000, t]`, counting the current call.

Instead of building a class, implement a replay function: given the strictly increasing call times `pings`, return an array where entry `i` is the answer `ping(pings[i])` would have produced if the calls arrived in order.

**Example 1:**
```
Input: pings = [1,100,3001,3002]
Output: [1,2,3,3]
Explanation: The third call still sees the first one (3001 - 3000 = 1), while the fourth drops it.
```

**Example 2:**
```
Input: pings = [1,2,3,4]
Output: [1,2,3,4]
Explanation: All four fit inside one window.
```

**Example 3:**
```
Input: pings = [1,4000,8000]
Output: [1,1,1]
Explanation: Gaps exceed the window, so each call stands alone.
```

**Constraints:**
- `1 <= pings.length <= 10000`
- `1 <= pings[i] <= 10^9`, strictly increasing.

Adaptation: the original design problem is replayed through `runRecentCalls` using `int_array` input and output.
