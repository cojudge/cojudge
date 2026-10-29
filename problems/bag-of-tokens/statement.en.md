Turn power and tokens into the highest achievable score.

You start with `power` energy and score zero, plus a bag of token values. Each token can be spent at most once in one of two directions: playing it face-up costs its value in power and earns one score point (needs enough power), while playing it face-down spends one score point to gain its value in power (needs a point to spend). You may stop whenever you like.

Given `tokens` and `power`, return the greatest score reachable at any moment.

**Constraints:**
- `0 <= tokens.length <= 1000`
- `0 <= tokens[i], power <= 10^4`
