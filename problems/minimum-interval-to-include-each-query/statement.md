You are given a collection of closed intervals with `intervals[i] = [left, right]`, plus an array `queries`. Define the length of an interval as `right - left + 1`.

For every query value, identify the shortest interval from the collection that covers it (that is, `left <= query <= right`). When several intervals cover the same query, keep the one with the smallest length; when none covers it, record `-1` for that query. Collect these answers in an array that preserves the incoming order of `queries`.

**Constraints:**

- `1 <= intervals.length, queries.length <= 100000`
- Every interval row has the form `[left, right]` with `1 <= left <= right <= 10000000`.
- `1 <= queries[i] <= 10000000`
