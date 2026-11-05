Given an integer array `nums` that may contain duplicate values, implement the `RandomPickIndex` class:

- `RandomPickIndex(int[] nums)` initializes the object with the array `nums`.
- `int pick(int target)` returns a random index `i` such that `nums[i] == target`.

Every index whose value equals `target` must have the same probability of being returned. The given `target` is guaranteed to occur at least once in `nums`.

**Constraints:**
- `1 <= nums.length <= 2 * 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`
- `target` occurs at least once in `nums`
- At most `10^4` calls will be made to `pick`

**Judge note:** the checker validates each returned index and runs long traces against the same object. A long trace must produce every valid index at least once, and the checker rejects fixed or short repeating sequences. Always returning the first match therefore fails even though it is a valid index.
