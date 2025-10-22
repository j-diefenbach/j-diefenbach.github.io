"use client";

import { ProjectCard } from "@/components";
import { Typography } from "@material-tailwind/react";
import { getImagePrefix } from "../../utils/utils";

const PROJECTS = [
  {
    img: `${getImagePrefix()}image/tictactoe.png`,
    title: "Super Tic Tac Toe",
    desc: "Super Tic Tac Toe game built with React, featuring an unbeatable AI opponent.",
    route: "/projects/TicTacToe"
  },
  {
    img: `${getImagePrefix()}image/battleship.png`,
    title: "Battleship AI",
    desc: "An advanced Battleship game featuring an AI opponent that uses probability density algorithms.",
    route: "/projects/Battleship"
  },
  {
    img: `${getImagePrefix()}image/hashi.png`,
    title: "Hashiwokakero Puzzle Solver",
    desc: "A puzzle solver for Hashiwokakero (Bridges) puzzles using constraint satisfaction techniques and heuristics",
    route: "/projects/Hashi"
  },
  {
    img: `${getImagePrefix()}image/timer_screenshot.png`,
    title: "Web Board Game Timer",
    desc: "A web-based timer application designed for board game enthusiasts, with extensive customization options.",
    route: "/projects/BoardGameTimer"
  },
  // {
  //   img: `${getImagePrefix()}image/blog3.svg`,
  //   title: "Markov Network Office Occupancy Prediction",
  //   desc: "A ML model predicting occupancy and transitions between rooms in an office including cost analysis",
  //   route: "/projects/MarkovNetwork"
  // },
  // {
  //   img: `${getImagePrefix()}image/blog-1.svg`,
  //   title: "Virus Registry App",
  //   desc: "A web application for registering and tracking virus samples, built with React, Python and Google APIs",
  // },
  // {
  //   img: `${getImagePrefix()}image/blog2.svg`,
  //   title: "Landing Page Development",
  //   desc: "Promotional landing page for a  fitness website Summer Campaign. Form development included.",
  // },
  // {
  //   img: `${getImagePrefix()}image/blog3.svg`,
  //   title: "Mobile App Development",
  //   desc: "Mobile app designed to help users discover and explore local restaurants and cuisines.",
  // },
  
];

export function Projects() {
  return (
    <section className="py-28 px-8" >
      <div id="projects" className="container mx-auto mb-20 text-center">
        <Typography variant="h2" color="blue-gray" className="mb-4">
          Interactive Projects
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto w-full px-4 font-normal !text-gray-500 lg:w-6/12"
        >
          Some of my interactive projects, including games and web applications. Click on any project to explore it further!
        </Typography>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2 xl:grid-cols-4">
        {PROJECTS.map((props, idx) => (
          <ProjectCard key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
