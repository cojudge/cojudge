// JDI-based debug driver for Java debug sessions.
// Communicates via the same file protocol as the Python debug wrapper:
// writes state to /tmp/cojudge_debug_state.json, reads commands from /tmp/cojudge_debug_cmd.json.
export const JAVA_DEBUG_DRIVER: string = String.raw`import com.sun.jdi.*;
import com.sun.jdi.connect.*;
import com.sun.jdi.event.*;
import com.sun.jdi.request.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;

public class DebugDriver {
    static final String STATE_FILE = "/tmp/cojudge_debug_state.json";
    static final String CMD_FILE = "/tmp/cojudge_debug_cmd.json";
    static String MAIN_CLASS = "Main";
    static String SOURCE_FILE = "Main.java";

    static Set<Integer> breakpoints = new LinkedHashSet<>();
    static final StringBuffer outputBuffer = new StringBuffer();
    static final Set<Integer> resolved = new HashSet<>();

    static VirtualMachine vm;
    static EventRequestManager erm;
    static StepRequest activeStep = null;
    static volatile boolean userStopped = false;

    public static void main(String[] args) throws Exception {
        if (args.length > 0 && !args[0].isEmpty()) {
            for (String s : args[0].split(",")) {
                s = s.trim();
                if (!s.isEmpty()) {
                    try { breakpoints.add(Integer.parseInt(s)); } catch (NumberFormatException ignore) {}
                }
            }
        }
        if (args.length > 1 && !args[1].isEmpty()) MAIN_CLASS = args[1];
        if (args.length > 2 && !args[2].isEmpty()) SOURCE_FILE = args[2];

        writeState("running", -1, null, null);

        LaunchingConnector connector = Bootstrap.virtualMachineManager().defaultConnector();
        Map<String, Connector.Argument> a = connector.defaultArguments();
        a.get("main").setValue(MAIN_CLASS);
        a.get("options").setValue("-cp /app");
        try {
            vm = connector.launch(a);
        } catch (Exception e) {
            writeState("error", -1, null, "Failed to launch VM: " + e.getMessage());
            return;
        }

        erm = vm.eventRequestManager();
        redirect(vm.process().getInputStream());
        redirect(vm.process().getErrorStream());

        ClassPrepareRequest cpr = erm.createClassPrepareRequest();
        cpr.setSuspendPolicy(EventRequest.SUSPEND_ALL);
        cpr.enable();

        for (ReferenceType rt : vm.allClasses()) trySetBreakpoints(rt);

        EventQueue queue = vm.eventQueue();
        boolean connected = true;
        while (connected) {
            EventSet set;
            try { set = queue.remove(); } catch (Exception e) { break; }
            boolean resume = true;
            for (Event ev : set) {
                if (ev instanceof ClassPrepareEvent) {
                    trySetBreakpoints(((ClassPrepareEvent) ev).referenceType());
                } else if (ev instanceof BreakpointEvent) {
                    resume = handlePause(((BreakpointEvent) ev).thread(), ((BreakpointEvent) ev).location());
                } else if (ev instanceof StepEvent) {
                    resume = handlePause(((StepEvent) ev).thread(), ((StepEvent) ev).location());
                } else if (ev instanceof VMDeathEvent) {
                    writeState("completed", -1, null, null);
                } else if (ev instanceof VMDisconnectEvent) {
                    connected = false;
                }
            }
            if (connected && resume) {
                try { set.resume(); } catch (Exception ignore) {}
            }
        }
        if (!userStopped) writeState("completed", -1, null, null);
    }

    static void trySetBreakpoints(ReferenceType rt) {
        try {
            if (!SOURCE_FILE.equals(rt.sourceName())) return;
        } catch (AbsentInformationException e) {
            return;
        } catch (Exception e) {
            return;
        }
        for (int line : breakpoints) {
            if (resolved.contains(line)) continue;
            try {
                List<Location> locs = rt.locationsOfLine(line);
                if (locs != null && !locs.isEmpty()) {
                    BreakpointRequest bp = erm.createBreakpointRequest(locs.get(0));
                    bp.setSuspendPolicy(EventRequest.SUSPEND_ALL);
                    bp.enable();
                    resolved.add(line);
                }
            } catch (AbsentInformationException | ClassNotPreparedException ignore) {
            } catch (Exception ignore) {}
        }
    }

    // returns whether to resume the event set
    static boolean handlePause(ThreadReference thread, Location loc) {
        int line = loc.lineNumber();
        Map<String, String> vars = collectVars(thread);
        writeState("paused", line, vars, null);

        Map<String, Object> cmd = waitForCmd();
        String action = String.valueOf(cmd.get("action"));

        if (activeStep != null) {
            try { erm.deleteEventRequest(activeStep); } catch (Exception ignore) {}
            activeStep = null;
        }

        if ("stop".equals(action)) {
            userStopped = true;
            writeState("stopped", -1, null, null);
            try { vm.dispose(); } catch (Exception ignore) {}
            return false;
        } else if ("step".equals(action)) {
            try {
                activeStep = erm.createStepRequest(thread, StepRequest.STEP_LINE, StepRequest.STEP_OVER);
                activeStep.addClassExclusionFilter("java.*");
                activeStep.addClassExclusionFilter("javax.*");
                activeStep.addClassExclusionFilter("sun.*");
                activeStep.addClassExclusionFilter("jdk.*");
                activeStep.addClassExclusionFilter("com.sun.*");
                activeStep.setSuspendPolicy(EventRequest.SUSPEND_ALL);
                activeStep.addCountFilter(1);
                activeStep.enable();
            } catch (Exception ignore) {}
        }
        return true;
    }

    static Map<String, String> collectVars(ThreadReference thread) {
        Map<String, String> out = new LinkedHashMap<>();
        try {
            StackFrame frame = thread.frame(0);
            List<LocalVariable> locals;
            try {
                locals = frame.visibleVariables();
            } catch (AbsentInformationException e) {
                return out;
            }
            for (LocalVariable lv : locals) {
                try {
                    Value v = frame.getValue(lv);
                    out.put(lv.name(), render(v, 0));
                } catch (Exception e) {
                    out.put(lv.name(), "<error>");
                }
            }
        } catch (Exception ignore) {}
        return out;
    }

    static String render(Value v, int depth) {
        if (v == null) return "null";
        if (v instanceof StringReference) return "\"" + ((StringReference) v).value() + "\"";
        if (v instanceof PrimitiveValue || v instanceof VoidValue) return v.toString();
        if (v instanceof ArrayReference) {
            if (depth > 2) return "[...]";
            ArrayReference arr = (ArrayReference) v;
            int len = arr.length();
            StringBuilder sb = new StringBuilder("[");
            int limit = Math.min(len, 100);
            for (int i = 0; i < limit; i++) {
                if (i > 0) sb.append(", ");
                sb.append(render(arr.getValue(i), depth + 1));
            }
            if (len > limit) sb.append(", ...");
            sb.append("]");
            return sb.toString();
        }
        if (v instanceof ObjectReference) {
            ObjectReference obj = (ObjectReference) v;
            String tn = obj.referenceType().name();
            if (tn.startsWith("java.lang.") && !tn.equals("java.lang.String")) {
                try {
                    Field f = obj.referenceType().fieldByName("value");
                    if (f != null) return render(obj.getValue(f), depth + 1);
                } catch (Exception ignore) {}
            }
            return "<" + simpleName(tn) + ">";
        }
        return v.toString();
    }

    static String simpleName(String tn) {
        int i = tn.lastIndexOf('.');
        return i >= 0 ? tn.substring(i + 1) : tn;
    }

    static Map<String, Object> waitForCmd() {
        while (true) {
            try {
                File f = new File(CMD_FILE);
                if (f.exists()) {
                    String content = new String(Files.readAllBytes(f.toPath())).trim();
                    Map<String, Object> cmd = parseCmd(content);
                    String action = String.valueOf(cmd.get("action"));
                    if ("set_breakpoints".equals(action)) {
                        Object bps = cmd.get("breakpoints");
                        if (bps instanceof List) {
                            breakpoints.clear();
                            resolved.clear();
                            for (BreakpointRequest br : erm.breakpointRequests()) {
                                try { erm.deleteEventRequest(br); } catch (Exception ignore) {}
                            }
                            for (Object o : (List<?>) bps) {
                                try { breakpoints.add(Integer.parseInt(String.valueOf(o).trim())); } catch (Exception ignore) {}
                            }
                            for (ReferenceType rt : vm.allClasses()) trySetBreakpoints(rt);
                        }
                        f.delete();
                        continue;
                    }
                    if ("continue".equals(action) || "step".equals(action) || "stop".equals(action)) {
                        f.delete();
                        return cmd;
                    }
                    f.delete();
                }
            } catch (Exception ignore) {}
            try { Thread.sleep(100); } catch (InterruptedException ignore) {}
        }
    }

    // minimal JSON parse for {"action":"..","breakpoints":[..]}
    static Map<String, Object> parseCmd(String s) {
        Map<String, Object> m = new HashMap<>();
        int ai = s.indexOf("\"action\"");
        if (ai >= 0) {
            int c = s.indexOf(':', ai);
            int q1 = s.indexOf('"', c + 1);
            int q2 = s.indexOf('"', q1 + 1);
            if (q1 >= 0 && q2 > q1) m.put("action", s.substring(q1 + 1, q2));
        }
        int bi = s.indexOf("\"breakpoints\"");
        if (bi >= 0) {
            int lb = s.indexOf('[', bi);
            int rb = s.indexOf(']', lb);
            if (lb >= 0 && rb > lb) {
                List<Object> list = new ArrayList<>();
                String inner = s.substring(lb + 1, rb).trim();
                if (!inner.isEmpty()) {
                    for (String p : inner.split(",")) {
                        p = p.trim();
                        if (!p.isEmpty()) list.add(p);
                    }
                }
                m.put("breakpoints", list);
            }
        }
        return m;
    }

    static void redirect(final InputStream in) {
        Thread t = new Thread(() -> {
            byte[] buf = new byte[4096];
            int n;
            try {
                while ((n = in.read(buf)) != -1) {
                    outputBuffer.append(new String(buf, 0, n));
                }
            } catch (IOException ignore) {}
        });
        t.setDaemon(true);
        t.start();
    }

    static synchronized void writeState(String status, int line, Map<String, String> vars, String error) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\"status\":").append(jstr(status));
        if (line >= 0) sb.append(",\"line\":").append(line);
        if (vars != null) {
            sb.append(",\"vars\":{");
            boolean first = true;
            for (Map.Entry<String, String> e : vars.entrySet()) {
                if (!first) sb.append(",");
                first = false;
                sb.append(jstr(e.getKey())).append(":").append(jstr(e.getValue()));
            }
            sb.append("}");
        }
        sb.append(",\"output\":").append(jstr(outputBuffer.toString()));
        if (error != null) sb.append(",\"error\":").append(jstr(error));
        sb.append("}");
        try {
            Path tmp = Paths.get(STATE_FILE + ".tmp");
            Files.write(tmp, sb.toString().getBytes());
            Files.move(tmp, Paths.get(STATE_FILE), StandardCopyOption.REPLACE_EXISTING, StandardCopyOption.ATOMIC_MOVE);
        } catch (Exception e) {
            try { Files.write(Paths.get(STATE_FILE), sb.toString().getBytes()); } catch (Exception ignore) {}
        }
    }

    static String jstr(String s) {
        if (s == null) return "\"\"";
        StringBuilder sb = new StringBuilder("\"");
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (c < 0x20) sb.append(String.format("\\u%04x", (int) c));
                    else sb.append(c);
            }
        }
        sb.append("\"");
        return sb.toString();
    }
}
`;
