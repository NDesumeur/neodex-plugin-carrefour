# Carrefour

Un jeu de réflexe en pixel art : tu règles les feux d'un carrefour où voitures, bus, tracteurs, vélos et ambulances arrivent de tous les côtés. Quatre carrefours à débloquer, du simple croisement à l'étoile à six voies. Fais-en passer le plus possible, sans accident et sans bouchon.

*English version: [README.en.md](README.en.md)*

## Deux carrefours (nouveau en 1.2.0)

Un cinquième carrefour, ouvert par 25 voitures à l'étoile : deux carrefours reliés par une route courte. Les flèches règlent le premier, **J L I K** le second. La route du milieu ne tient que deux voitures : si le second feu reste rouge trop longtemps, la file remonte jusque dans le premier carrefour, et la voiture qui traverse la percute.

## Commandes

- **Clic** ou **doigt** sur un feu (ou près de sa voie) : il passe du vert au rouge, ou l'inverse.
- **Flèches** : la flèche montre le côté d'où viennent les voitures. **←** change le feu des voitures qui arrivent de gauche, **↑** celui des voitures du haut, **→** de droite, **↓** du bas. ZQSD marche aussi.
- **B** : baisse ou lève la barrière du passage à niveau. **1 à 6** : les six feux de l'étoile.
- **P** ou **Échap** : pause. **PLEIN ÉCRAN** : le carrefour prend tout l'écran.

## Comment ça marche

- On roule à droite. Au début, l'axe gauche-droite est au vert et l'axe haut-bas au rouge.
- Une voiture s'arrête à la ligne d'arrêt quand son feu est rouge, et garde ses distances avec celle de devant. Une voiture déjà engagée continue.
- **Deux voitures qui se croisent au milieu : accident**, la partie s'arrête.
- Une voiture arrêtée s'impatiente : une pastille jaune, puis rouge, s'allume au-dessus d'elle. Au bout de 10 secondes, elle klaxonne et tu perds **une étoile**. À 0 étoile, c'est le **bouchon**.
- Les **bus** sont longs et lents : il leur faut plus de temps pour dégager le croisement.
- Le **tracteur** et le **vélo** roulent très lentement. L'**ambulance** (gyrophare bleu, sirène) est **prioritaire** : bloquée deux secondes à un feu rouge, elle te coûte une étoile (« PRIORITÉ ! »).
- Il arrive de plus en plus de voitures, de plus en plus vite.

## Les quatre carrefours

Choisis le carrefour dans la liste. Faire passer **25 voitures** dans une partie ouvre le suivant.

- **Croisement** : deux routes, quatre feux.
- **Passage à niveau** : une voie ferrée coupe la route à gauche. Quand la cloche sonne et que le signal clignote, un train arrive 4 secondes plus tard : baisse la **barrière** (touche **B** ou clic sur son feu) pour que personne ne reste sur les rails.
- **Rond-point** : on y entre en tournant à droite, puis tout le monde tourne au même pas. Chacun sort à droite, tout droit ou à gauche. Il faut laisser entrer au bon moment, sinon deux voitures se touchent dans l'anneau.
- **Étoile à six voies** : trois routes se croisent au même point, six feux numérotés de 1 à 6.

## Statistiques

Le panneau Records garde ton **record** de voitures passées sur le carrefour choisi, le nombre de **parties**, le total des **voitures passées** et des **accidents**.

## Données et synchronisation

Ton record et tes totaux sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Carrefour → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
