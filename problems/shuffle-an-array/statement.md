Given an integer array `nums`, design an algorithm to randomly shuffle the array. All permutations of the array should be equally likely as a result of the shuffling.

Implement the `Shuffler` class:

- `Shuffler(int[] nums)` Initializes the object with the integer array `nums`.
- `int[] reset()` Resets the array to its original configuration and returns it.
- `int[] shuffle()` Returns a random shuffling of the array.

The class is named `Shuffler` here instead of LeetCode's `Solution` because the judge harness reserves `Solution` for its driver; the constructor and methods match the original.

Grading: each `shuffle` must return a permutation of the original array (same multiset), and each `reset` must return the original configuration exactly. Any valid trace is accepted — uniformity over permutations is not statistically tested.

**Constraints:**
- `1 <= nums.length <= 50`
- `-10^6 <= nums[i] <= 10^6`
- All values of `nums` are unique.
