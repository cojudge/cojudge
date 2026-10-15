# Cojudge PHP Runner Image
#
# WHY: The default php:8.3-cli image lacks the GNU `time` binary (needed for
# run metrics). Installing it at runtime via apt-get is slow and requires
# internet — offline it hangs the "Preparing / Compiling" step on network
# timeouts. This image pre-installs it during build so runs start instantly,
# online or off.
#
# USAGE (runs): point cojudge at this image so regular runs skip runtime
# apt-get entirely:
#   docker build -t cojudge-php:latest -f docker/php/Dockerfile .
#   COJUDGE_PHP_IMAGE=cojudge-php:latest ...

FROM php:8.3-cli

RUN apt-get update -qq && apt-get install -y -qq time && \
    rm -rf /var/lib/apt/lists/*
