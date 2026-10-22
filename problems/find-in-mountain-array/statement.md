A mountain array satisfies `arr.length >= 3` with values strictly increasing to a peak then strictly decreasing. You cannot access it directly — interact with the judge object `mountainArr`:

- `get(index)` returns the element at `index`,
- `length()` returns the array length.

Implement `findInMountainArray(target, mountainArr)` returning the minimum index `k` with `get(k) == target`, or `-1` if `target` never occurs. Binary search the peak first, then each side; the judge counts your `get` calls and reports Wrong Answer if you exceed **100** calls on a test case.

Method names per language: Java `mountainArr.get(i)` / `mountainArr.length()`, Python `mountainArr.get(i)` / `mountainArr.length()`, C++ `mountainArr.get(i)` / `mountainArr.length()`, C# `mountainArr.Get(i)` / `mountainArr.Length()`, Rust `mountain_arr.get(i)` / `mountain_arr.length()`, Go `mountainArr.Get(i)` / `mountainArr.Length()`, TypeScript `mountainArr.get(i)` / `mountainArr.length()`, PHP `$mountainArr->get($i)` / `$mountainArr->length()`.

**Constraints:**

- `3 <= mountainArr.length() <= 10^4`
- `0 <= target <= 10^9`
- `0 <= get(index) <= 10^9`
- The hidden array is a valid mountain array.
- At most 100 `get` calls per test case.
