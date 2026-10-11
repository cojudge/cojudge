Maintain a set of half-open number ranges `[left, right)` supporting three actions:

- `addRange(left, right)`: start tracking every number from `left` up to but not including `right`.
- `queryRange(left, right)`: report whether every number in that span is currently tracked.
- `removeRange(left, right)`: stop tracking numbers in that span.

Because the judge works with plain functions, calls are encoded as two parallel lists: `operations` names each step (starting with `RangeModule`) and `args` gives its `[left, right]` pair (`[]` for construction). Only `queryRange` produces an answer, recorded as `1` for covered and `0` otherwise, in call order.

*Adaptation note:* the entry point is `runRangeModule(operations, args)` returning the list of query answers.

**Example 1:**
```
Input: operations = ["RangeModule","addRange","queryRange","removeRange","queryRange"], args = [[],[10,20],[10,14],[14,16],[10,14]]
Output: [1,1]
Explanation: 10-14 is covered before and after trimming 14-16.
```

**Example 2:**
```
Input: operations = ["RangeModule","addRange","addRange","queryRange"], args = [[],[10,15],[15,20],[10,20]]
Output: [1]
Explanation: Adjacent ranges join, so 10-20 reads as covered.
```

**Example 3:**
```
Input: operations = ["RangeModule","addRange","removeRange","queryRange"], args = [[],[5,10],[5,10],[5,10]]
Output: [0]
Explanation: Removing everything that was added leaves the query uncovered.
```

**Constraints:**
- `1 <= operations.length <= 2000`
- Each `args[i]` has length 0 or 2 with `0 <= left < right <= 10^9`.
