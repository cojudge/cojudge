You are given inclusive intervals where `intervals[i] = [left, right]` and an array `queries`. The size of an interval is `right - left + 1`.

For each query, return the size of the smallest interval that contains it. If no interval contains a query, return `-1` for that position. Answers must follow the original order of `queries`.

**Constraints:**

- `1 <= intervals.length, queries.length <= 100000`
- Every interval row has the form `[left, right]` with `1 <= left <= right <= 10000000`.
- `1 <= queries[i] <= 10000000`
