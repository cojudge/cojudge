You receive an integer array `arr`. Report the extent of the largest **turbulent subarray** inside `arr`.

Call a subarray **turbulent** when the direction of comparison reverses at every neighboring pair within it.

In precise terms, a slice `[arr[i], arr[i + 1], ..., arr[j]]` of `arr` counts as turbulent exactly when one of these patterns holds:

- For `i <= k < j`:
  - `arr[k] > arr[k + 1]` when `k` is **odd**, and
  - `arr[k] < arr[k + 1]` when `k` is **even**.
- Or, for `i <= k < j`:
  - `arr[k] > arr[k + 1]` when `k` is **even**, and
  - `arr[k] < arr[k + 1]` when `k` is **odd**.

**Constraints:**

- `1 <= arr.length <= 4 * 10^4`
- `0 <= arr[i] <= 10^9`
