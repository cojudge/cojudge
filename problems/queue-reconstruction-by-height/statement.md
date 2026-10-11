A crowd is described by pairs `[h, k]`: person height `h` and the count `k` of people in front who are at least as tall as `h`. The given `people` array holds these pairs in no particular order, and exactly one line ordering satisfies every pair.

Rebuild that line: return the pairs from front to back so that each entry's `k` equals the number of earlier entries whose height is greater than or equal to its own.

**Example 1:**
```
Input: people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
Output: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
Explanation: After sorting tall-first, each person is slotted at position k among those already lined up.
```

**Example 2:**
```
Input: people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]
Output: [[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]
Explanation: The shortest person waits behind four taller-or-equal people, as their k values demand.
```

**Constraints:**
- `1 <= people.length <= 2000`
- `0 <= h <= 10^6`
- `0 <= k < people.length`
- A valid reconstruction always exists.
