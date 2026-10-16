alias i := install
alias b := build
alias p := preview
alias s := serve
alias h := health
alias t := test

install:
    pnpm install

[working-directory: "frontend"]
build:
    pnpm build

[working-directory: "frontend"]
preview:
    pnpm preview

[working-directory: "frontend"]
serve:
    pnpm dev

[working-directory: "frontend"]
health:
    pnpm check

[working-directory: "frontend"]
test:
    pnpm test
