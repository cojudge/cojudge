You hold a string `s` and a number `k`. One step lets you pick any of the first `k` characters and relocate it to the very end, preserving the order of everything else. Repeating steps can shuffle the string in restricted ways.

Describe the smallest string (in dictionary order) that can be reached.

When `k` equals one, only rotations are possible, so examine each rotation. When `k` exceeds one, any rearrangement becomes reachable, so the sorted characters form the optimum.

**Example 1:**
```
Input: s = "cba", k = 1
Output: "acb"
Explanation: Rotations are "cba", "bac" and "acb"; the last is the tiniest.
```

**Example 2:**
```
Input: s = "baaca", k = 3
Output: "aaabc"
Explanation: With three choices per step the letters can be fully sorted.
```

**Example 3:**
```
Input: s = "aabbcc", k = 2
Output: "aabbcc"
Explanation: The string is already sorted, which is optimal for k larger than one.
```

**Constraints:**
- `1 <= k <= s.length <= 1000`
- `s` holds only lowercase English letters.
