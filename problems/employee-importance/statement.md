A company stores its staff as a table. Each row describes one person as `[id, importance, sub1, sub2, ...]`, where `id` is the unique number of the employee, `importance` is their personal score, and any remaining entries list the ids of their direct reports. A row with only two entries has no direct reports.

Given the whole table `employees` and a starting `id`, add up the importance of that person together with everyone reachable below them through direct and indirect reporting lines.

This is a portable adaptation: the original object list is flattened into integer rows so that only `int_array_2d` plus `int` are needed. Ids are positive and distinct; every subordinate id appears as some row's id.

**Constraints:**
- `1 <= employees.length <= 2000`
- Each row has at least two numbers; `1 <= id <= 2000`
- `-100 <= importance <= 100`
- Each employee has at most `100` direct reports.
