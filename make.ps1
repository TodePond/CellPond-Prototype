clang --target=wasm32 -nostdlib "-Wl,--allow-undefined" "-Wl,--no-entry" "-Wl,--export-all" -o script.wasm script.c
