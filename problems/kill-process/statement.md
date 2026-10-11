Each running program has an id in `pid` and its parent id in `ppid` at the same index; a parent id of `0` means no parent. Ending a program also ends every program below it in the parent-child tree.

Given `pid`, `ppid` and `kill`, return all ids that stop, starting with `kill` itself. The order of the remaining ids does not matter.

**Constraints:**
- `1 <= pid.length <= 2000`
- All `pid` values are distinct and each appears as the kill target in tests.
- Each `ppid` entry is `0` or another `pid` value.
