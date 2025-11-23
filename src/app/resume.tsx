"use client";

import { Typography, Button, Chip } from "@material-tailwind/react";
import {
  ChartBarIcon,
  PuzzlePieceIcon,
  CursorArrowRaysIcon,
  ArrowRightIcon,
  CpuChipIcon,
  AcademicCapIcon
} from "@heroicons/react/24/solid";
import { ResumeItem } from "@/components";
import { Download, FileDownload, PagesOutlined, SimCardDownload } from "@mui/icons-material";

const RESUME_ITEMS = [
  {
    icon: AcademicCapIcon,
    children: <>Bachelor in Computer Science <br/> and Neuroscience (Honours)</>,
  },
  {
    icon: ChartBarIcon,
    children: <>1.5 years <br/>Research Assistant experience</>,
  },
  {
    icon: CpuChipIcon,
    children: <>Major in Artificial Intelligence <br/>and Machine Learning</>,
  },
];

export function Resume() {
  return (
    <section className="px-8 py-24">
      <div className="container mx-auto grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="col-span-1">
          <Typography variant="h2" color="blue-gray">
            My Resume
          </Typography>
          <Typography className="mb-4 mt-3 w-9/12 font-normal !text-gray-500">
            Versatile undergraduate with a strong foundation
            in both neuroscience and computer science, boasting practical research experience and a passion for technology.
            Skilled in machine learning, data analysis, and software development.
          </Typography>
            <a href="/resume">
            <Button
              variant="text"
              color="gray"
              className="flex items-center gap-2"
            >
              view more
              <ArrowRightIcon
              strokeWidth={3}
              className="h-3.5 w-3.5 text-gray-900"
              />
            </Button>
            </a>
          
        </div>
        <div className="col-span-1 grid gap-y-6 lg:ml-auto pr-0 lg:pr-12 xl:pr-32">
          {RESUME_ITEMS.map((props, idx) => (
            <ResumeItem key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Resume;
