You are given an array `nums` of positive integers that will be divided in order, like `nums[0] / nums[1] / nums[2] / ...`. You may insert any number of parenthesis pairs to force evaluation order.

Parentheses change the result because division is not associative. Add them so the final value is as large as possible, then return the corresponding expression as a string. Do not include redundant parentheses: a single number needs none, two numbers need none, and longer inputs need exactly one outer pair around everything after the first number.

**Constraints:**
- `1 <= nums.length <= 10`
- `2 <= nums[i] <= 1000`
- The optimum is unique for every input
