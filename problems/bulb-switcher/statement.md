There are `n` lamps, all switched off at the start. In round 1 every lamp is flipped on. In round 2 every second lamp is flipped, in round 3 every third lamp is flipped, and so on: during round `i`, each lamp whose 1-based position is a multiple of `i` changes state. After completing all `n` rounds, report how many lamps remain lit.

**Example 1:**
```
Input: n = 3
Output: 1
Explanation: After round 1 the lit lamps are [on,on,on]; after round 2 [on,off,on]; after round 3 [on,off,off], so 1 lamp stays on.
```

**Example 2:**
```
Input: n = 0
Output: 0
Explanation: With no lamps, none can be on.
```

**Example 3:**
```
Input: n = 1
Output: 1
Explanation: The single lamp is flipped once and stays on.
```

**Constraints:**
- `0 <= n <= 10^9`
