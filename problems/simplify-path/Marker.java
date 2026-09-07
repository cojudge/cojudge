class Marker {
    public String simplifyPath(String path) {
        java.util.Deque<String> stack = new java.util.ArrayDeque<>();
        for (String part : path.split("/")) {
            if (part.isEmpty() || part.equals(".")) continue;
            if (part.equals("..")) {
                if (!stack.isEmpty()) stack.pop();
            } else {
                stack.push(part);
            }
        }
        if (stack.isEmpty()) return "/";
        java.util.List<String> list = new java.util.ArrayList<>(stack);
        java.util.Collections.reverse(list);
        StringBuilder sb = new StringBuilder();
        for (String dir : list) sb.append('/').append(dir);
        return sb.toString();
    }

    public boolean isCorrect(String path, String output) {
        String expected = simplifyPath(path);
        return expected.equals(output);
    }
}
