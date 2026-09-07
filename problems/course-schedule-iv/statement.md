There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `ai` first if you want to take course `bi`.

Prerequisites can also be indirect. If course `a` is a prerequisite of `b`, and `b` is a prerequisite of `c`, then `a` is a prerequisite of `c`.

You are also given an array `queries` where `queries[j] = [uj, vj]`. For the `j`-th query, you should answer whether course `uj` is a prerequisite of course `vj` or not.

Return a boolean array `answer`, where `answer[j]` is the answer to the `j`-th query.

**Note:** In Cojudge the return type is a list of strings `"true"` / `"false"`.

**Example 1:**
```
Input: numCourses = 2, prerequisites = [[1,0]], queries = [[0,1],[1,0]]
Output: ["false","true"]
```

**Example 2:**
```
Input: numCourses = 2, prerequisites = [], queries = [[1,0],[0,1]]
Output: ["false","false"]
```

**Example 3:**
```
Input: numCourses = 3, prerequisites = [[1,2],[1,0],[2,0]], queries = [[1,0],[1,2]]
Output: ["true","true"]
```

**Constraints:**
- `2 <= numCourses <= 100`
- `0 <= prerequisites.length <= (numCourses * (numCourses - 1) / 2)`
- `prerequisites[i].length == 2`
- `0 <= ai, bi <= numCourses - 1`
- `ai != bi`
- All pairs `[ai, bi]` are unique
- The prerequisites graph has no cycles
- `1 <= queries.length <= 10^4`
- `0 <= ui, vi <= numCourses - 1`
- `ui != vi`
