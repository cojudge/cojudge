`RandomizedCollection` is a data structure that contains a collection of numbers, possibly duplicates (i.e., a multiset). It should support inserting and removing specific elements and also reporting a random element.

Implement the `RandomizedCollection` class:

- `RandomizedCollection()` Initializes the empty object.
- `bool insert(int val)` Inserts an item `val` into the multiset, even if the item is already present. Returns `true` if the item is not present, `false` otherwise.
- `bool remove(int val)` Removes an item `val` from the multiset if present. Returns `true` if the item is present, `false` otherwise. Note that if `val` has multiple occurrences, only one of them is removed.
- `int getRandom()` Returns a random element from the current multiset. The probability of each element being returned is linearly related to the number of same values it contains (it is guaranteed that at least one element exists when this method is called).

You must implement the functions of the class such that each function works in average O(1) time complexity.

The class keeps its LeetCode name `RandomizedCollection` here (instead of `Solution`) because the judge harness reserves `Solution` for its driver; the constructor and methods match the original.

Grading: `insert`/`remove` booleans are compared exactly against a reference model tracking per-value counts, and each `getRandom` output must have a remaining copy at that point. Only validity is checked — the sampling distribution is not statistically tested.

**Constraints:**
- `-2^31 <= val <= 2^31 - 1`
- At most `2 * 10^5` calls will be made to `insert`, `remove`, and `getRandom`.
- `getRandom` will only be called when at least one copy is held.
