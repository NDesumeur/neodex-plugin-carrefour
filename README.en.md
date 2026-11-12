# Crossroads

A pixel art reflex game: you run the traffic lights of a crossroads where cars and buses arrive from all four sides. Get as many through as you can, without crashes or gridlock.

*Version française : [README.md](README.md)*

## Controls

- **Click** or **tap** a light (or near its lane): it switches from green to red, or back.
- **Arrows**: the arrow shows the side the cars come from. **←** switches the light of cars arriving from the left, **↑** from the top, **→** from the right, **↓** from the bottom. WASD works too.
- **P** or **Esc**: pause.

## How it works

- Traffic drives on the right. At the start, the left-right road is green and the top-bottom road is red.
- A car stops at the stop line when its light is red, and keeps its distance from the car in front. A car already in the crossroads keeps going.
- **Two cars crossing in the middle: crash**, the game stops.
- A stopped car gets impatient: a yellow, then red dot lights up above it. After 10 seconds, it honks and you lose **a star**. At 0 stars, it's **gridlock**.
- **Buses** are long and slow: they need more time to clear the crossroads.
- More and more cars arrive, faster and faster.

## Stats

The Records panel keeps your **best** number of cars through, the number of **games**, the total **cars through** and **crashes**.

## Data and sync

Your best score and totals are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Crossroads → Install**.

Making a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
