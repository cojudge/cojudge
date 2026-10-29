You observe a stream of non-negative integers one at a time. After each batch of
arrivals you want a compact summary: the set of distinct values seen so far,
written as a sorted list of disjoint closed intervals that covers exactly those
values.

Two values belong to the same interval when everything between them has also
been seen. For example, seeing `1, 3, 7, 2, 6` leaves the covered set
`{1, 2, 3, 6, 7}`, summarized as `[[1, 3], [6, 7]]`.

**Adaptation note:** instead of a stateful class, implement a single function
`runSummaryRanges(values)` that consumes the whole arrival sequence and returns
the final summary intervals, sorted by start.

**Constraints:**
- `0 <= values.length <= 10000`
- `0 <= values[i] <= 10000`
- Values may repeat; repeats change nothing.
