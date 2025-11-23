"use client"
// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "../hero";
import Clients from "../clients";
import Skills from "../skills";
import Projects from "../projects";
import Resume from "../resume";
import Testimonial from "../testimonial";
import PopularClients from "../popular-clients";
import ContactForm from "../contact-form";
import React from "react";
import { Button, Divider, Stack } from "@mui/material";
import { Download } from "@mui/icons-material";

export default function Portfolio() {
    const resumeUrl = "/2025_Resume.pdf";
    const cvUrl = "/2025_CV.pdf";
    const [displayItem, setDisplayItem] = React.useState(resumeUrl);
  return (
    <>
      <Navbar />
    <Stack direction="row" spacing={5} className="justify-center my-4">
        <Button variant="outlined" className="flex items-center gap-2"
        onClick={() => setDisplayItem(resumeUrl)}
        >
            Resume
        </Button>
        <Button variant="outlined" className="flex items-center gap-2"
        onClick={() => setDisplayItem(cvUrl)}
        >
            CV
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button variant="outlined" className="flex items-center gap-2"
        startIcon={<Download />}
        onClick={() => setDisplayItem("/2025_Resume.docx")}
        >
            Resume (.docx)
        </Button>
        <Button variant="outlined" className="flex items-center gap-2"
        startIcon={<Download />}
        onClick={() => setDisplayItem("/2025_CV.docx")}
        >
            CV (.docx)
        </Button>
    </Stack>
    <section className="w-full h-[90vh]">
        <object data={displayItem} type="application/pdf" width="100%" height="100%">
            <iframe src={displayItem} width="100%" height="100%" title="Resume PDF" />
        </object>
    </section>
      <Footer />
    </>
  );
}
