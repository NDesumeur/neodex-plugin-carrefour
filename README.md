# Carrefour

Un jeu de réflexe en pixel art : tu règles les feux d'un croisement où des voitures et des bus arrivent des quatre côtés. Fais-en passer le plus possible, sans accident et sans bouchon.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Clic** ou **doigt** sur un feu (ou près de sa voie) : il passe du vert au rouge, ou l'inverse.
- **Flèches** : la flèche montre le côté d'où viennent les voitures. **←** change le feu des voitures qui arrivent de gauche, **↑** celui des voitures du haut, **→** de droite, **↓** du bas. ZQSD marche aussi.
- **P** ou **Échap** : pause.

## Comment ça marche

- On roule à droite. Au début, l'axe gauche-droite est au vert et l'axe haut-bas au rouge.
- Une voiture s'arrête à la ligne d'arrêt quand son feu est rouge, et garde ses distances avec celle de devant. Une voiture déjà engagée continue.
- **Deux voitures qui se croisent au milieu : accident**, la partie s'arrête.
- Une voiture arrêtée s'impatiente : une pastille jaune, puis rouge, s'allume au-dessus d'elle. Au bout de 10 secondes, elle klaxonne et tu perds **une étoile**. À 0 étoile, c'est le **bouchon**.
- Les **bus** sont longs et lents : il leur faut plus de temps pour dégager le croisement.
- Il arrive de plus en plus de voitures, de plus en plus vite.

## Statistiques

Le panneau Records garde ton **record** de voitures passées, le nombre de **parties**, le total des **voitures passées** et des **accidents**.

## Données et synchronisation

Ton record et tes totaux sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Carrefour → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
