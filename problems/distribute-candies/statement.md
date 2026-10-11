Given an array `candyType` where each entry records the type of one candy, Alice may take exactly half of the candies. She wants as many distinct types as possible. Return the greatest number of different types she can hold.

She cannot exceed half the pile, and she cannot exceed the number of distinct types present — the answer is simply the smaller of those two numbers.

**Example 1:**
```
Input: candyType = [1,1,2,2,3,3]
Output: 3
Explanation: Three types exist and Alice takes three candies, so she can hold one of each.
```

**Example 2:**
```
Input: candyType = [1,1,2,3]
Output: 2
Explanation: She takes two candies, covering at most two of the three types.
```

**Example 3:**
```
Input: candyType = [6,6,6,6]
Output: 1
Explanation: Only one type exists no matter how she picks.
```

**Constraints:**
- `2 <= candyType.length <= 10^4`, even length.
- `-10^5 <= candyType[i] <= 10^5`
