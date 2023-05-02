---
title: AI Battleship
date: 2023-01-15 12:00:00
categories: [Projects]
tags: [AI, python, C, R, statistics]     # TAG names should always be lowercase
pin: false
---

# Using AI Methods to Optimise Battleship Strategies
I first implemented basic battleship tactics, and added additional algorithms to approach optimal gameplay. The best solution achieved involved incorporating:

* Bayesian probability[^Bayesian]
* Seek and hunt states
* Identifying sunk tiles incorporating wave-function-collapse[^Battleship-testing]
* Checkerboard overlays updating to live ship sizes[^Battleship-testing]

> I am keen to progress further on this project when I have the time, incorporating the concepts laid out in my Elements of AI project
{: .prompt-info }

## Comparing seek-and-hunt combinations

| Method      | Median turns to win |
| ----------- | ----------- |
| Checkerboard x Improved Probability | 47 |
| Probability & Probability hunt  | 54 |
|  Probability & 4dir hunt | 61 |
|  Checkerboard & 4dir hunt| 68 |
|  Random & 4dir hunt | 71 |
|  Random | 97 |

![Overview graph](/assets/improved_prob_comparison.png)

## Additional testing methods
To test large amounts of battleship games using different methods, I ran a C program implementing the above methods. Using command arguments, it determined the appropriate hunt and seek methods, and other adjustment parameters[^Battleship-testing]. 
It would take in the number of games to play, and run them over several threads, returning the turns to win and other information as necessary.

There was ofcourse a manual view option, stepping through turns taken by the AI and outputting various information for that turn such as probability weight, the current state of the wave-function-collapse for identifying sunk tiles etc.

In order to visualise this, I used the output as a csv for Rstudio, and visualised a cumulative frequency distribution graph and compared performance. The graph also gave key information when developing hunting and seeking info, and could be used to interpret the effects of different adjustment factors such as checkerboard size[^Battleship-testing].

## More
[^Elements-of-AI]: My [Elements of AI Project](https://github.com/j-diefenbach/Battleship_Building_Ai) (Mostly concept)
[^Battleship-testing]: My [Battleship testing program](https://github.com/j-diefenbach/Battleship) (Also contains analysis and development of algorithms seen here)
[^Bayesian]: [Playing Battleship with Bayesian Search Theory, Thompson Sampling, and Approximate Bayesian Computation by Austin Richford](https://austinrochford.com/posts/2021-09-02-battleship-bayes.html)