Simulate an iterator with lookahead over an integer array.

**Adaptation:** the original design asks for a `PeekingIterator` class with
`next`, `peek`, and `hasNext`; here implement `runPeek(nums, operations)`
where `operations` lists the calls to run in order. Return one integer per
operation: the value for `next`/`peek`, and `1`/`0` for `hasNext`
true/false. Calls are guaranteed valid (peek/next only when data remains).

**Examples:**
```
Input: nums = [1,2,3], operations = ["next","peek","next","next","hasNext"]
Output: [1,2,2,3,0]
```
```
Input: nums = [1], operations = ["hasNext","next","hasNext"]
Output: [1,1,0]
```
```
Input: nums = [1,2], operations = ["peek","peek","next","hasNext"]
Output: [1,1,1,1]
```

**Constraints:**
- `1 <= nums.length <= 1000`
- At most `1000` operations.
