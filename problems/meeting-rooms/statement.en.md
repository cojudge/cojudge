Determine if a person could attend all meetings given start-end intervals.

Two intervals that only touch at an endpoint are **not** considered overlapping: for interval `i` appearing before interval `j`, `intervals[i].end == intervals[j].start` does not cause overlap (only when `intervals[i].end > intervals[j].start`).

**Constraints:**

- 0 <= intervals.length <= 10^4
- intervals[i].length == 2
- 0 <= starti < endi <= 10^6
