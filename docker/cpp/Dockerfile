# Cojudge C++ Debugger Runner Image
#
# WHY: The default gcc:13 image lacks GDB, which is needed for the debugger.
# Installing GDB at runtime via apt-get is slow and requires internet.
# This image pre-installs GDB during build so debug sessions start instantly.


FROM gcc:13

RUN apt-get update -qq && apt-get install -y -qq gdb && \
    rm -rf /var/lib/apt/lists/*
