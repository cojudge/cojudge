Maintain a set of half-open number ranges `[left, right)` supporting three actions:

- `addRange(left, right)`: start tracking every number from `left` up to but not including `right`.
- `queryRange(left, right)`: report whether every number in that span is currently tracked.
- `removeRange(left, right)`: stop tracking numbers in that span.

Because the judge works with plain functions, calls are encoded as two parallel lists: `operations` names each step (starting with `RangeModule`) and `args` gives its `[left, right]` pair (`[]` for construction). Only `queryRange` produces an answer, recorded as `1` for covered and `0` otherwise, in call order.

*Adaptation note:* the entry point is `runRangeModule(operations, args)` returning the list of query answers.

**Constraints:**
- `1 <= operations.length <= 2000`
- Each `args[i]` has length 0 or 2 with `0 <= left < right <= 10^9`.
