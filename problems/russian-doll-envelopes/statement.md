You are given envelopes described by `[width, height]` pairs. One envelope can
hold another exactly when both its width and its height are strictly larger.
Turning envelopes is not allowed.

Find the largest number of envelopes that can be nested one inside another in a
single chain.

**Example 1:**
```
Input: envelopes = [[5,4],[6,4],[6,7],[2,3]]
Output: 3
Explanation: The chain [2,3] -> [5,4] -> [6,7] nests three envelopes.
```

**Example 2:**
```
Input: envelopes = [[1,1],[1,1],[1,1]]
Output: 1
Explanation: Equal envelopes never fit inside each other.
```

**Constraints:**
- `1 <= envelopes.length <= 10^5`
- `envelopes[i].length == 2`
- `1 <= width, height <= 10^5`
