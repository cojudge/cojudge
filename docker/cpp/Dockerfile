# Cojudge C++ Debugger Runner Image
#
# WHY: The default gcc:13 image lacks GDB (needed for the debugger) and the
# GNU `time` binary (needed for run metrics). Installing packages at runtime
# via apt-get is slow and requires internet — offline it hangs the
# "Preparing / Compiling" step on network timeouts. This image pre-installs
# both during build so debug sessions and runs start instantly, online or off.
#
# USAGE (debug): used automatically when present as cojudge-debugger-cpp:latest.
# USAGE (runs): point cojudge at this image so regular runs skip runtime
# apt-get entirely:
#   docker build -t cojudge-debugger-cpp:latest -f docker/cpp/Dockerfile .
#   COJUDGE_CPP_IMAGE=cojudge-debugger-cpp:latest ...

FROM gcc:13

RUN apt-get update -qq && apt-get install -y -qq gdb time && \
    rm -rf /var/lib/apt/lists/*
