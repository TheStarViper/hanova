set working-directory := 'frontend'

alias i := install
alias b := build
alias p := preview
alias s := serve
alias h := health

install:
    pnpm install
build:
    pnpm build
preview:
    pnpm preview
serve:
    pnpm dev
health:
	pnpm check
