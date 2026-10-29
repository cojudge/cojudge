There are `numCourses` subjects numbered `0` through `numCourses - 1`. An entry `prerequisites[i] = [ai, bi]` declares that subject `ai` has to precede subject `bi`.

Dependence carries transitively: whenever `a` must precede `b` and `b` must precede `c`, then `a` must also precede `c`.

You additionally receive a list `queries`, where each `queries[j] = [uj, vj]` asks whether subject `uj` is a (direct or indirect) requirement of subject `vj`.

Respond with a boolean array `answer`, whose `j`-th slot answers the `j`-th query.

**Note:** In this judge the returned collection uses the strings `"true"` and `"false"`.

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
