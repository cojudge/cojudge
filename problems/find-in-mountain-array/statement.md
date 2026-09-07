You are given a mountain array `arr` and an integer `target`.

A mountain array satisfies `arr.length >= 3` and there exists an index `i`
with `0 < i < arr.length - 1` such that `arr[0] < arr[1] < ... < arr[i]`
and `arr[i] > arr[i+1] > ... > arr[arr.length - 1]`.

This is a self-contained adaptation of the interactive problem: instead of
a `MountainArray` API, you receive the array directly. Return the minimum
index `k` such that `arr[k] == target`, or `-1` if `target` does not occur.
A solution that uses `O(log n)` comparisons is expected.

**Constraints:**

- `3 <= arr.length <= 10^4`
- `0 <= arr[i], target <= 10^9`
- `arr` is a valid mountain array.
