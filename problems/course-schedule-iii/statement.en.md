You are given course pairs `[duration, lastDay]`: a course consumes `duration` consecutive days and must end no later than `lastDay`. You may take courses in any order, one at a time, starting on day 1 (a course needing `d` days taken first ends on day `d`).

Return the greatest number of courses you can complete without missing any chosen deadline.

**Constraints:**
- Between 1 and 10000 courses.
- Each duration and deadline lies in [1, 10000].

*Adaptation: the nested input maps to `int_array_2d` in this judge.*
