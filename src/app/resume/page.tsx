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
import { Box, Button, Divider, Modal, Stack } from "@mui/material";
import { Download } from "@mui/icons-material";

export default function Portfolio() {
    const resumeUrl = "/2025_Resume.pdf";
    const cvUrl = "/2025_CV.pdf";
    const [displayItem, setDisplayItem] = React.useState(resumeUrl);
    const isSmall = typeof window !== "undefined" ? window.innerWidth < 1024 : false;
    const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <>
      <Navbar />
    <Stack direction="row" spacing={isSmall ? 0: 5} className="justify-center my-4">
        <Button variant="outlined" className="flex items-center gap-2"
        style = {{ fontSize: isSmall ? "8px" : "16px" }}
        onClick={() => setDisplayItem(resumeUrl)}
        >
            Resume
        </Button>
        <Button variant="outlined" className="flex items-center gap-2"
        style = {{ fontSize: isSmall ? "8px" : "16px" }}
        onClick={() => setDisplayItem(cvUrl)}
        >
            CV
        </Button>
        <Divider orientation="vertical" flexItem />
        <Button variant="outlined" className="flex items-center"
        style = {{ fontSize: isSmall ? "8px" : "16px" }}
        startIcon={<Download />}
        onClick={() => setModalOpen(true)}
        >
        </Button>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <Box sx={{ position: 'absolute' as 'absolute', top: '50%', left: '30%', transform: 'translate(-12.5%, -50%)', bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4, }}>
                <Stack>
                    <Button variant="contained" className="flex items-center gap-2"
                    style = {{ fontSize: isSmall ? "12px" : "16px" }}
                    href={displayItem} download
                    >
                        Resume PDF
                    </Button>
                    <Button variant="contained" className="flex items-center gap-2"
                    style = {{ fontSize: isSmall ? "12px" : "16px" }}
                    href={"/2025_Resume.docx"} download
                    >
                        Resume .docx
                    </Button>
                    <Button variant="contained" className="flex items-center gap-2"
                    style = {{ fontSize: isSmall ? "12px" : "16px" }}
                    href={cvUrl} download
                    >
                        CV PDF
                    </Button>
                    <Button variant="contained" className="flex items-center gap-2"
                    style = {{ fontSize: isSmall ? "12px" : "16px" }}
                    href={"/2025_CV.docx"} download
                    >
                        CV .docx
                    </Button>
                    <Button variant="text" className="flex items-center justify-end"
                    style = {{ fontSize: isSmall ? "12px" : "16px" }}
                    onClick={() => setModalOpen(false)}
                    >
                        Close
                    </Button>
                </Stack>
            </Box>
            
        </Modal>
    </Stack>
    <section className="w-full" style={{height: isSmall ? "600px" : "900px"}}>
        <object data={displayItem} type="application/pdf" width="100%" height="100%">
            <iframe src={displayItem} width="100%" height="100%" title="Resume PDF" />
        </object>
    </section>
      <Footer />
    </>
  );
}
