# Cojudge Rust Debugger Runner Image
#
# WHY: The default rust:1.78-slim image lacks GDB and Python3 (needed for
# the debugger) and the GNU `time` binary (needed for run metrics).
# Installing packages at runtime via apt-get is slow and requires internet —
# offline it hangs the "Preparing / Compiling" step on network timeouts.
# This image pre-installs everything during build so debug sessions and runs
# start instantly, online or off.
#
# USAGE (debug): used automatically when present as cojudge-debugger-rust:latest.
# USAGE (runs): point cojudge at this image so regular runs skip runtime
# apt-get entirely:
#   docker build -t cojudge-debugger-rust:latest -f docker/rust/Dockerfile .
#   COJUDGE_RUST_IMAGE=cojudge-debugger-rust:latest ...

FROM rust:1.78-slim

RUN apt-get update -qq && apt-get install -y -qq gdb python3 time && \
    rm -rf /var/lib/apt/lists/*
