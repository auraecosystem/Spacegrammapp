FROM rockylinux:9

# Core system tools
RUN dnf -y update && dnf -y install \
    gcc gcc-c++ make cmake ninja-build \
    clang clang-tools-extra lldb \
    git curl wget unzip \
    python3 python3-pip \
    openssl-devel zlib-devel \
    && dnf clean all

# Create dev user (IMPORTANT: no root dev workflow)
RUN useradd -m dev

# Python tooling (AI + dev ready)
RUN pip3 install --upgrade pip && \
    pip3 install numpy pandas requests fastapi uvicorn

# clangd symlink stability
RUN ln -s /usr/bin/clangd /usr/local/bin/clangd || true

WORKDIR /usr/src/spacegrammdesktop

USER dev
