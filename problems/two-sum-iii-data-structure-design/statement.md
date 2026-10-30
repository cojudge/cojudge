Design a data structure that supports adding numbers and finding whether any pair of previously added numbers sums to a target value.

Implement the `TwoSum` class:

- `TwoSum()` Initializes the `TwoSum` object.
- `void add(int number)` Adds `number` to the data structure.
- `boolean find(int value)` Returns `true` if there exist two stored entries (two different additions) whose sum equals `value`, and `false` otherwise. A single stored copy cannot pair with itself: `find` needs two copies of `x` to report `true` for `value = 2 * x`.

The class keeps its LeetCode name `TwoSum` (the harness reserves `Solution` for the driver); the constructor and methods match the original.

**Constraints:**
- `-10^5 <= number, value <= 10^5`
- At most `10^4` calls will be made to `add` and `find`.
- Every trace begins with `TwoSum`; `add` and `find` each take one argument.
