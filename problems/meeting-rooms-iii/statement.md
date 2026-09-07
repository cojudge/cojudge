You are given an integer `n`. There are `n` rooms numbered from `0` to `n - 1`.

You are given a 2D integer array `meetings` where `meetings[i] = [starti, endi]` means that a meeting will be held during the half-closed time interval `[starti, endi)`. All the values of `starti` are unique.

Meetings are allocated to rooms in the following manner:
1. Each meeting will take place in the unused room with the lowest number.
2. If there are no available rooms, the meeting will be delayed until a room becomes free. The delayed meeting should have the same duration as the original meeting.
3. When a room becomes unused, meetings that have an earlier original start time should be given the room.

Return the number of the room that held the most meetings. If there are multiple rooms, return the room with the lowest number.

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
