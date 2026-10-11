An `n`-bit Gray sequence lists every number from `0` to `2^n - 1` exactly once so that consecutive values differ in precisely one binary digit. Build any such ordering starting from `0`.

One classic construction mirrors the previous sequence: prefix the old order with `0`, then append its reverse prefixed with `1`. Equivalently, entry `i` can be written directly as `i ^ (i >> 1)`.

**Example 1:**
```
Input: n = 2
Output: [0,1,3,2]
Explanation: Binary forms 00, 01, 11, 10 change one bit at each step.
```

**Example 2:**
```
Input: n = 1
Output: [0,1]
Explanation: With one bit, 0 then 1 differ in the only position.
```

**Example 3:**
```
Input: n = 0
Output: [0]
Explanation: Zero bits still produce the single value 0.
```

**Constraints:**
- `0 <= n <= 16`
- Any valid Gray ordering is accepted.

> **Adaptation note:** the original LeetCode return type is `List<Integer>`; this problem uses the portable `int_list` output type with the same values.
