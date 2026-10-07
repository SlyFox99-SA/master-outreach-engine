# SHELLS

Sellable storefront designs. Each is a complete standalone project.

## Current shells

| Shell | Price | For | Look |
|---|---|---|---|
| Editorial | R9,500 | Fragrance, jewellery, art | Cream, serif, considered |
| Hype | R6,500 | Sneakers, IG clothing, young sellers | Black + lime, ticker, badges |
| Spec-first | R6,500 | Phones, electronics, tools | Dark, monospace, spec tables |
| Lookbook | R9,500 | Clothing, fashion, accessories | White, tall cards, size chips |

## Structure

templates/shells/name/
  README.md    who it is for, screenshots, notes
  index.html   the storefront

## New client from a shell

./scripts/New-Client.ps1 -Name sipho-sneakers -Shell hype

Copies shell into clients/sipho-sneakers/src/, adds shared engine files, creates config.json with placeholders.

## Adding a new shell

1. Freeze it in templates/shells/name/
2. Write README.md (who it is for, price, screenshots)
3. Add it to the pitch page as a new tile
4. Now sellable

## Shell to tier matrix

           Starter R5k   Shop R6.5-9.5k   Pro R12-15k
Editorial   -            yes              yes + animations
Hype        -            yes              yes + animations
Spec-first  -            yes              -
Lookbook    -            yes              -

Pro variants add the animations pack on top.
