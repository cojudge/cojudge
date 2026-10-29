Given an array of meeting time intervals `intervals`, where
`intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms
required to host every meeting.

Meetings that overlap must use different rooms. If one meeting ends at the exact
time another begins, the two meetings may use the same room.


**Constraints:**

- `0 <= intervals.length <= 10^4`
- `intervals[i].length == 2`
- `0 <= start_i < end_i <= 10^6`
