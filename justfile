set working-directory := 'frontend'

alias i := install
alias b := build
alias p := preview
alias s := serve

install:
    pnpm install
build:
    pnpm build
preview:
    pnpm preview
serve:
    pnpm dev
