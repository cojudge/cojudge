Each running program has an id in `pid` and its parent id in `ppid` at the same index; a parent id of `0` means no parent. Ending a program also ends every program below it in the parent-child tree.

Given `pid`, `ppid` and `kill`, return all ids that stop, starting with `kill` itself. The order of the remaining ids does not matter.

**Example 1:**
```
Input: pid = [1,3,10,5], ppid = [3,0,5,3], kill = 5
Output: [5,10]
Explanation: Ending 5 also ends its child 10.
```

**Example 2:**
```
Input: pid = [1,3,10,5], ppid = [3,0,5,3], kill = 3
Output: [3,1,5,10]
Explanation: Ending 3 ends the whole tree underneath it in some order.
```

**Example 3:**
```
Input: pid = [1], ppid = [0], kill = 1
Output: [1]
```

**Constraints:**
- `1 <= pid.length <= 2000`
- All `pid` values are distinct and each appears as the kill target in tests.
- Each `ppid` entry is `0` or another `pid` value.
