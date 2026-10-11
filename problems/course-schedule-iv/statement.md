There are `numCourses` subjects numbered `0` through `numCourses - 1`. An entry `prerequisites[i] = [ai, bi]` declares that subject `ai` has to precede subject `bi`.

Dependence carries transitively: whenever `a` must precede `b` and `b` must precede `c`, then `a` must also precede `c`.

You additionally receive a list `queries`, where each `queries[j] = [uj, vj]` asks whether subject `uj` is a (direct or indirect) requirement of subject `vj`.

Respond with a boolean array `answer`, whose `j`-th slot answers the `j`-th query.

**Note:** In this judge the returned collection uses the strings `"true"` and `"false"`.

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
