---
title: HSC Battleship
date: 2021-06-01 12:00:00
categories: [Projects]
tags: [AI, vb.NET, .NET]     # TAG names should always be lowercase
---

# SDD_Battleship
HSC Software Design and Development assignment: Battleship in visual basic / .NET

| [Github repo](https://github.com/Tinylad/SDD_Battleship) \| Marked 98% - 1st in class
> The approaches I learnt during this project, was later iterated on and I plan to try out some more approaches in the future
{: .prompt-info }
---

Refer to documentation for thorough overview of both development process and algorithm / design explanations

- Turn-based basic .NET implementation of the usual battleship game-cycle
  - Intermediary screen to avoid screencheating (due to the project requirements of a single-computer implementation)
  - Player names and target selection
  - History field to avoid confusion (for upwards of 2 players) and supplement gameplay
- Additional compatibility for upwards of 2 players
- Heatmapping AI player
  - Allows for singleplayer
  - Heatmap visualisation
  - Weight probabilities using known (player-available) data
- User system
  - Save hits, misses, scores
  - Save ELO
  - Scoreboard system
  - Save new users
