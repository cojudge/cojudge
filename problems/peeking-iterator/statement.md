Simulate an iterator with lookahead over an integer array.

**Adaptation:** the original design asks for a `PeekingIterator` class with
`next`, `peek`, and `hasNext`; here implement `runPeek(nums, operations)`
where `operations` lists the calls to run in order. Return one integer per
operation: the value for `next`/`peek`, and `1`/`0` for `hasNext`
true/false. Calls are guaranteed valid (peek/next only when data remains).

**Constraints:**
- `1 <= nums.length <= 1000`
- At most `1000` operations.
