A company stores its staff as a table. Each row describes one person as `[id, importance, sub1, sub2, ...]`, where `id` is the unique number of the employee, `importance` is their personal score, and any remaining entries list the ids of their direct reports. A row with only two entries has no direct reports.

Given the whole table `employees` and a starting `id`, add up the importance of that person together with everyone reachable below them through direct and indirect reporting lines.

This is a portable adaptation: the original object list is flattened into integer rows so that only `int_array_2d` plus `int` are needed. Ids are positive and distinct; every subordinate id appears as some row's id.

**Example 1:**
```
Input: employees = [[1,5,2,3],[2,3],[3,3]], id = 1
Output: 11
Explanation: Person 1 scores 5 and supervises 2 and 3 (3 each), totalling 11.
```

**Example 2:**
```
Input: employees = [[1,2,2],[2,3]], id = 2
Output: 3
Explanation: Person 2 has no reports, so only their own 3 counts.
```

**Example 3:**
```
Input: employees = [[10,4,20,30],[20,2],[30,6,40],[40,1]], id = 10
Output: 13
Explanation: 10 links to 20 and 30, and 30 links onward to 40: 4 + 2 + 6 + 1 = 13.
```

**Constraints:**
- `1 <= employees.length <= 2000`
- Each row has at least two numbers; `1 <= id <= 2000`
- `-100 <= importance <= 100`
- Each employee has at most `100` direct reports.
