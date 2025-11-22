"use client";

import { Typography } from "@material-tailwind/react";
import {
  RectangleGroupIcon,
  FingerPrintIcon,
  SwatchIcon,
  HashtagIcon,
  EyeIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  CpuChipIcon
} from "@heroicons/react/24/solid";
import { SkillCard } from "@/components";

const SKILLS = [
  {
    icon: RectangleGroupIcon,
    title: "Frontend and GUI Development:",
    children:
      "Creating functional frontends and graphical user interfaces (GUIs) for web applications and research tools",
  },
  {
    icon: CpuChipIcon,
    title: "Machine Learning",
    children:
      "Implementing and analysing appropriate machine learning models and data processing using Python for analysis",
  },
  {
    icon: SwatchIcon,
    title: "Technology Stack",
    children:
      "I'm well-versed in a variety of languages from C, Java, JavaScript, and React, to Python, R, and Matlab",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: " Engineering",
    children:
      "Leveraging CAD and 3D printing to design and create custom lab equipment and prototypes",
  },
  {
    icon: EyeIcon,
    title: "Visualisation",
    children:
      "Brain region and network visualisations in 3D, interactive plots and graphs to help understand complex data",
  },
  {
    icon: DocumentTextIcon,
    title: "The rest",
    children:
      "Neuroscience and CS foundations including technical writing, data analysis, statistical analysis, and more.",
  },
];

export function Skills() {
  const isSmall = typeof window !== "undefined" ? window.innerWidth < 1024 : false;

  return (
    <section className="px-8">
      <div className="container mx-auto mb-20 text-center">
        <Typography color="blue-gray" className="mb-2 font-bold uppercase">
          my skills
        </Typography>
        <Typography variant="h1" color="blue-gray" className="mb-4">
          What I do
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto w-full !text-gray-500 lg:w-10/12"
        >
          I&apos;m a versatile undergraduate, I work on a variety of projects that
          span both neuroscience and computer science from hobby machine learning
          projects to coursework and research assistant roles.
        </Typography>
      </div>
      {isSmall === false ? (
        <div className="container mx-auto grid grid-cols-3 gap-y-10">
          {SKILLS.map((props, idx) => (
            <div key={idx}>
              <SkillCard {...props} />
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-full">
          <div className="flex gap-4 overflow-x-auto px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-y-10 md:gap-x-6">
            {SKILLS.map((props, idx) => (
              <div key={idx} 
              style={{minWidth: "80%", maxWidth: "100%"}}
              >
                <SkillCard {...props} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Skills;
