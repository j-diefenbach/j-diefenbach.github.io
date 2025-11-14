"use client";

import { ProjectCard } from "@/components";
import { Typography } from "@material-tailwind/react";
import { getImagePrefix } from "../../utils/utils";
import { DocumentIcon, SparklesIcon } from "@heroicons/react/24/solid";

const PROJECTS = [
  {
    img: `${getImagePrefix()}image/tictactoe.png`,
    title: "Super Tic Tac Toe",
    desc: "Super Tic Tac Toe game built with React, featuring an unbeatable AI opponent.",
    route: "/projects/TicTacToe",
    icon: <SparklesIcon className="w-5 h-5 text-blue-400" />,
    tags: ["Web", "React", "Fun", "Interactive", "AI"],
  },
  {
    img: `${getImagePrefix()}image/battleship.png`,
    title: "Battleship AI",
    desc: "An advanced Battleship game featuring an AI opponent that uses probability density algorithms.",
    route: "/projects/Battleship",
    icon: <SparklesIcon className="w-5 h-5 text-blue-400" />,
    tags: ["Web", "React", "Fun", "Interactive", "AI"],
  },
  {
    img: `${getImagePrefix()}image/hashi.png`,
    title: "Hashiwokakero Puzzle Solver",
    desc: "A puzzle solver for Hashiwokakero (Bridges) puzzles using constraint satisfaction techniques and heuristics",
    route: "/projects/Hashi",
    icon: <SparklesIcon className="w-5 h-5 text-blue-400" />,
    tags: ["Web", "React", "Fun", "Interactive", "AI"],
  },
  {
    img: `${getImagePrefix()}image/timer_screenshot.png`,
    title: "Web Board Game Timer",
    desc: "A web-based timer application designed for board game enthusiasts, with extensive customization options.",
    route: "/projects/BoardGameTimer",
    icon: <SparklesIcon className="w-5 h-5 text-blue-400" />,
    tags: ["Web", "React", "Fun", "Interactive"],
  },
  {
    img: `${getImagePrefix()}image/registry.png`,
    title: "Virus Registry App",
    desc: "A web application for registering and tracking virus samples, built with React, Python and Google APIs",
    tags: ["Web", "React", "Flask", "Google APIs"],
  },
  {
    img: `${getImagePrefix()}image/mri.png`,
    title: "MRI Viewer and Annotation Management System",
    desc: "A web-based application for viewing and annotating MRI scans, built with React, Python Flask and MySQL.",
    tags: ["Web", "React", "Flask", "MySQL"],
  },
  {
    img: `${getImagePrefix()}image/mn_report.png`,
    title: "Markov Network Office Occupancy Prediction",
    desc: "MN model predicting occupancy and transitions between rooms in an office including cost analysis",
    tags: ["Report", "Python", "Markov Networks", "Machine learning"],
  },
  {
    img: `${getImagePrefix()}image/cv_report.png`,
    title: "Sea Turtle Semantic Segmentation Ensemble",
    desc: "Two-layer ensemble model for sea turtle image segmentation using various deep learning techniques.",
    tags: ["Report", "Python", "Machine Learning", "Computer Vision"],
  },
  {
    img: `${getImagePrefix()}image/brainrender2.png`,
    title: "Whole-brain single-cell network analysis",
    desc: "Network analysis of whole-brain single-cell data using graph theory including centrality measures and community detection.",
    tags: ["Python", "Network Analysis", "Graph Theory"],
    fulltext: 
    `Single-cell cFos expression data was collected following punishment.
      Brain regions were represented as nodes and edges defined by inter-region correlations in cFos expression across subjects.
      Graph theory techniques were applied to analyse the resulting networks, including centrality measures (degree, betweenness, avg shortest path length)
      and community detection (Louvain algorithm) to identify key regions and modules involved in the behavioural response to punishment.
      Differences between control and punished  were examined to identify causal targets for further research.
    `
  },
  {
    img: `${getImagePrefix()}image/deeplabcut.png`,
    title: "Pose-estimation and behaviour clustering in rodents",
    desc: "Applications of Deeplabcut and Keypoint-MoSeq to extract data for exploratory analyses. Extended to events of interest e.g. lever presses",
    tags: ["Python", "Machine Learning", "Neuroscience" ],
    fulltext:
    `Deeplabcut was used to perform pose-estimation on videos of rodents performing a punished lever-press task.
      Keypoint-MoSeq was then applied to the extracted keypoints to identify and cluster behavioural motifs or "syllables".
      This approach enabled the quantification and analysis of complex behaviours, facilitating insights into approach behaviour, avoidance and avenues for future research.
      The pipeline was further extended to focus on specific events of interest, such as lever presses, allowing for detailed behavioural analyses in relation to task demands.
    `
  },
  {
    img: `${getImagePrefix()}image/brain_glow.png`,
    title: "Brainrender and blender visualisations",
    desc: "3D visualisations of brain regions, networks and activity using Brainrender and Blender.",
    tags: ["Python", "Blender", "3D Visualisation", "Neuroscience"],
  },
  {
    img: `${getImagePrefix()}image/miniscope.png`,
    title: "Miniscope CNMFe and Cell encoding analysis",
    desc: "Processing and analysis of miniscope calcium imaging data using CNMFe and encoding pipelines.",
    tags: ["Python", "Time series", "Neuroscience"],
    fulltext:
    `Miniscope calcium imaging data was processed using the CNMFe algorithm to extract neuronal activity traces from raw imaging data.
      Resulting activity traces were encoded for their relevance to alcohol/sucrose consumption events.
      Proportion of cells encoding bouts of consumption were compared across days.
      Cell proprtions were then correlated with behavioural metrics to identify relationships between neural activity and behaviour.
      
      2024 Summer Vacation Research Scholarship under Gavan McNally and Zayra Millan.
    `
  }
  
];

export function Projects() {
  return (
    <section className="py-28 px-8" >
      <div id="projects" className="container mx-auto mb-20 text-center">
        <Typography variant="h2" color="blue-gray" className="mb-4">
          Projects
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto w-full px-4 font-normal !text-gray-500 lg:w-6/12"
        >
          A collection of my work and projects. Some are interactive!
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
