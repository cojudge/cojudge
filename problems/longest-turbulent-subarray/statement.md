You receive an integer array `arr`. Report the extent of the largest **turbulent subarray** inside `arr`.

Call a subarray **turbulent** when the direction of comparison reverses at every neighboring pair within it.

In precise terms, a slice `[arr[i], arr[i + 1], ..., arr[j]]` of `arr` counts as turbulent exactly when one of these patterns holds:

- For `i <= k < j`:
  - `arr[k] > arr[k + 1]` when `k` is **odd**, and
  - `arr[k] < arr[k + 1]` when `k` is **even**.
- Or, for `i <= k < j`:
  - `arr[k] > arr[k + 1]` when `k` is **even**, and
  - `arr[k] < arr[k + 1]` when `k` is **odd**.

**Example 1:**

```
Input: arr = [9,4,2,10,7,8,8,1,9]
Output: 5
Explanation: arr[1] > arr[2] < arr[3] > arr[4] < arr[5]
```

**Example 2:**

```
Input: arr = [4,8,12,16]
Output: 2
```

**Example 3:**

```
Input: arr = [100]
Output: 1
```

**Constraints:**

- `1 <= arr.length <= 4 * 10^4`
- `0 <= arr[i] <= 10^9`
