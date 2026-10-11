Turn power and tokens into the highest achievable score.

You start with `power` energy and score zero, plus a bag of token values. Each token can be spent at most once in one of two directions: playing it face-up costs its value in power and earns one score point (needs enough power), while playing it face-down spends one score point to gain its value in power (needs a point to spend). You may stop whenever you like.

Given `tokens` and `power`, return the greatest score reachable at any moment.

**Example 1:**
```
Input: tokens = [100], power = 150
Output: 1
Explanation: Spend 100 power face-up: power 50, score 1, then stop.
```

**Example 2:**
```
Input: tokens = [100,200,300,400], power = 200
Output: 2
Explanation: Beat 100 (score 1), beat 200 (score 2), then optionally trade 400 for power and beat 300; the peak score seen is 2.
```

**Example 3:**
```
Input: tokens = [71,55,82], power = 54
Output: 0
Explanation: No token is affordable and no point exists to trade, so the score stays zero.
```

**Constraints:**
- `0 <= tokens.length <= 1000`
- `0 <= tokens[i], power <= 10^4`
