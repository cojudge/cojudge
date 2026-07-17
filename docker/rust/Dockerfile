# Cojudge Rust Debugger Runner Image
#
# WHY: The default rust:1.78-slim image lacks GDB and Python3, which are
# needed for the debugger. Installing them at runtime via apt-get is slow
# and requires internet. This image pre-installs them during build so
# debug sessions start instantly.

FROM rust:1.78-slim

RUN apt-get update -qq && apt-get install -y -qq gdb python3 && \
    rm -rf /var/lib/apt/lists/*
