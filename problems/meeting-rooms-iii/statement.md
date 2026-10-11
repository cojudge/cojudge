There are `n` meeting rooms labelled `0` through `n - 1`.

A 2D integer array `meetings` lists the bookings, with `meetings[i] = [starti, endi]` denoting a booking that occupies the half-open span `[starti, endi)` (it includes `starti` and excludes `endi`). Every `starti` value occurs only once.

Bookings occupy rooms according to these rules:
1. A booking goes to the currently free room with the smallest label.
2. When every room is occupied, the booking waits until some room is released; the postponed booking keeps its original length.
3. Whenever a room is released, it is offered to the waiting booking whose original `starti` is earliest.

Count how many bookings each room hosts, and output the label of the room with the highest count. Break ties toward the smaller label.

**Example 1:**
```
Input: n = 2, meetings = [[0,10],[1,5],[2,7],[3,4]]
Output: 0
```

**Example 2:**
```
Input: n = 3, meetings = [[1,20],[2,10],[3,5],[4,9],[6,8]]
Output: 1
```

**Constraints:**
- `1 <= n <= 100`
- `1 <= meetings.length <= 10^5`
- `meetings[i].length == 2`
- `0 <= starti < endi <= 5 * 10^5`
- All the values of `starti` are unique
