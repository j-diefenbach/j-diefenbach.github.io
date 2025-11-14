import Image from "next/image";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { link } from "fs";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { Modal, Popover, Stack } from "@mui/material";
import { ReactElement } from "react";
import React from "react";

interface ProjectCardProps {
  img: string;
  title: string;
  desc: string;
  route?: string;
  icon?: ReactElement;
  fulltext?: string;
}

export function ProjectCard({ img, title, desc, route, icon, fulltext }: ProjectCardProps) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  return (
    <Card color="transparent" shadow={false}>
      <CardHeader 
        floated={false} 
        className="mx-0 mt-0 mb-6 h-48 group perspective-1000 relative cursor-pointer"
        onMouseMove={(e) => {
          const card = e.currentTarget;
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const rotateX = ((y - rect.height / 2) / rect.height) * 35; // increased from 20 to 35
          const rotateY = ((x - rect.width / 2) / rect.width) * -35; // increased from 20 to 35
          
          card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'rotateX(0) rotateY(0)';
          e.currentTarget.style.transition = 'transform 0.1s ease';
        }}
      >
        <a href={route}>
        <Image
          src={img}
          alt={title}
          width={768}
          height={768}
          className="h-full w-full object-cover transition-transform duration-300"
        />
        </a>
      </CardHeader>
      <CardBody className="p-0">
          <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h5" className="mb-2">
            {title}
          </Typography>
            {icon}
          </Stack>

        <Typography className="mb-6 font-normal !text-gray-500">
          {desc}
        </Typography>
        {route ?<a href={route}>
            <Button color="gray" size="sm" >
              see details
            </Button>
        </a> : null}
        {fulltext ? <Button
          color="gray"
          size="sm"
          className="ml-2"
          onClick={() => setPopoverOpen(true)}
        >
          more info
        </Button> : null}
        <Modal
          open={Boolean(fulltext) && popoverOpen}
          onClose = {() => setPopoverOpen(false)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg max-w-lg w-full outline-none">  
          <Typography className="p-4">
            {fulltext?.split("\n").map((line, idx, arr) => (
              <span key={idx}>
                {line}
                {idx < arr.length - 1 && <br />}
              </span>
            ))}
          </Typography>
          </div>
        </Modal>
      </CardBody>
    </Card>
  );
}

export default ProjectCard;
