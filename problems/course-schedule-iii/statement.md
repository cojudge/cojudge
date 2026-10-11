You are given course pairs `[duration, lastDay]`: a course consumes `duration` consecutive days and must end no later than `lastDay`. You may take courses in any order, one at a time, starting on day 1 (a course needing `d` days taken first ends on day `d`).

Return the greatest number of courses you can complete without missing any chosen deadline.

**Example 1:**
```
Input: courses = [[100,200],[200,1300],[1000,1250],[2000,3200]]
Output: 3
```

**Example 2:**
```
Input: courses = [[1,2]]
Output: 1
```

**Example 3:**
```
Input: courses = [[3,2],[4,3]]
Output: 0
```

**Constraints:**
- Between 1 and 10000 courses.
- Each duration and deadline lies in [1, 10000].

*Adaptation: the nested input maps to `int_array_2d` in this judge.*
