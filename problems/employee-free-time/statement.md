You are given every employee's busy periods in `schedule`. Because the judge has no interval objects, each employee's timetable is flattened into one integer row: `[start0, end0, start1, end1, ...]` holding consecutive `[start, end]` pairs in increasing order with no overlaps.

For example, an employee busy during `[1,2]` and `[5,6]` appears as `[1,2,5,6]`, so the whole input `[[[1,2],[5,6]],[[1,3]],[[4,10]]]` is encoded as `[[1,2,5,6],[1,3],[4,10]]`.

Combine all busy blocks, merge overlaps, and return the finite gaps where everyone is free, ordered by start time. Zero-length touching points do not count, and the endless stretches before the first meeting and after the last one are ignored.

Adaptation for this judge: the original signature uses nested interval objects; here both the input rows and the output use plain integer arrays, with the output type `int_list_2d` (a list of `[start, end]` pairs).

**Example 1:**
```
Input: schedule = [[1,2,5,6],[1,3],[4,10]]
Output: [[3,4]]
Explanation: Together the busy cover is [1,3] plus [4,10]; the only finite common gap is 3 to 4.
```

**Example 2:**
```
Input: schedule = [[1,3,6,7],[2,4],[2,5,9,12]]
Output: [[5,6],[7,9]]
Explanation: Merged busy cover is [1,5],[6,7],[9,12]; gaps 5-6 and 7-9 are the shared free time.
```

**Constraints:**
- `1 <= schedule.length <= 50`
- Each row holds an even count of entries forming `[start, end]` pairs.
- `0 <= start < end <= 10^8`
- Pairs inside one row are sorted and non-overlapping.
