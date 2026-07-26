import java.util.*;

class Marker {
    public int evalRpn(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (String token : tokens) {
            if (token.length() == 1 && "+-*/".indexOf(token.charAt(0)) >= 0) {
                int right = stack.pop();
                int left = stack.pop();
                switch (token.charAt(0)) {
                    case '+': stack.push(left + right); break;
                    case '-': stack.push(left - right); break;
                    case '*': stack.push(left * right); break;
                    default: stack.push(left / right); break;
                }
            } else {
                stack.push(Integer.parseInt(token));
            }
        }
        return stack.pop();
    }

    public boolean isCorrect(String[] tokens, int output) {
        return output == evalRpn(tokens);
    }
}
