# Crossroads

A pixel art reflex game: you run the traffic lights of a crossroads where cars, buses, tractors, bikes and ambulances arrive from every side. Four crossroads to unlock, from a simple crossing to the six-way star. Get as many through as you can, without crashes or gridlock.

*Version française : [README.md](README.md)*

## Controls

- **Click** or **tap** a light (or near its lane): it switches from green to red, or back.
- **Arrows**: the arrow shows the side the cars come from. **←** switches the light of cars arriving from the left, **↑** from the top, **→** from the right, **↓** from the bottom. WASD works too.
- **B**: lowers or raises the level-crossing barrier. **1 to 6**: the six lights of the star.
- **P** or **Esc**: pause. **FULLSCREEN**: the crossroads fills the screen.

## How it works

- Traffic drives on the right. At the start, the left-right road is green and the top-bottom road is red.
- A car stops at the stop line when its light is red, and keeps its distance from the car in front. A car already in the crossroads keeps going.
- **Two cars crossing in the middle: crash**, the game stops.
- A stopped car gets impatient: a yellow, then red dot lights up above it. After 10 seconds, it honks and you lose **a star**. At 0 stars, it's **gridlock**.
- **Buses** are long and slow: they need more time to clear the crossroads.
- **Tractors** and **bikes** are very slow. The **ambulance** (blue light, siren) has **priority**: blocked for two seconds at a red light, it costs you a star ("PRIORITY!").
- More and more cars arrive, faster and faster.

## The four crossroads

Pick the crossroads in the list. Getting **25 cars** through in one game unlocks the next.

- **Crossing**: two roads, four lights.
- **Level crossing**: a railway cuts the road on the left. When the bell rings and the signal blinks, a train comes 4 seconds later: lower the **barrier** (key **B** or click its light) so nobody stays on the tracks.
- **Roundabout**: you enter by turning right, then everyone circles at the same pace. Each car exits right, straight or left. Let cars in at the right time, or two of them touch in the ring.
- **Six-way star**: three roads cross at the same point, six lights numbered 1 to 6.

## Stats

The Records panel keeps your **best** number of cars through on the chosen crossroads, the number of **games**, the total **cars through** and **crashes**.

## Data and sync

Your best score and totals are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Crossroads → Install**.

Making a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
