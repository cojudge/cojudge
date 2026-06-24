# Cojudge Go Runner Image
#
# WHY: The official golang:1.22-alpine compiles the entire standard library
# from source on every `go build`. On memory-constrained machines (<1GB RAM),
# this takes >50s for even a hello world program.
#
# WHAT: Pre-compiles every stdlib package into the build cache during image
# build. Runtime `go build` skips stdlib and only compiles the user's code,
# cutting total time from ~53s to ~2s.
#
# USAGE:
#
#   1) Build the image:
#      docker build -t cojudge-go:latest -f docker/go/Dockerfile .
#
#   2) Point cojudge to it via the env var (cleanest — works with CLI & Docker):
#      # CLI (env var is read at runtime by goUtil.ts)
#      COJUDGE_GO_IMAGE=cojudge-go:latest cojudge
#
#      # Docker (pass -e to the cojudge server container)
#      docker run -e COJUDGE_GO_IMAGE=cojudge-go:latest ... 
#
#      # docker.sh (add -e to the docker run inside the script, or set IMAGE)
#      IMAGE=cojudge-go:latest COJUDGE_GO_IMAGE=cojudge-go:latest ./docker.sh
#
#   3) Or retag as golang:1.22-alpine (no env var needed, but masks the original):
#      docker tag cojudge-go:latest golang:1.22-alpine

FROM golang:1.22-alpine

# go install std compiles every standard library package and stores the
# results in $GOPATH/pkg/<os>_<arch> and $GOCACHE. Subsequent go build
# commands find these pre-compiled artifacts and skip recompilation.
RUN go install std
