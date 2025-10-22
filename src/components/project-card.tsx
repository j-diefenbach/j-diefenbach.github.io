import Image from "next/image";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { link } from "fs";

interface ProjectCardProps {
  img: string;
  title: string;
  desc: string;
  route?: string;
}

export function ProjectCard({ img, title, desc, route }: ProjectCardProps) {
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
        <Image
          src={img}
          alt={title}
          width={768}
          height={768}
          className="h-full w-full object-cover transition-transform duration-300"
        />
      </CardHeader>
      <CardBody className="p-0">
          <Typography variant="h5" className="mb-2">
            {title}
          </Typography>
        <Typography className="mb-6 font-normal !text-gray-500">
          {desc}
        </Typography>
        <a href={route}>
        <Button color="gray" size="sm" >
          
          see details
        </Button>
        </a>
      </CardBody>
    </Card>
  );
}

export default ProjectCard;
