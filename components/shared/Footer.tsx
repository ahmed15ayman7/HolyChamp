import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Badge,
} from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#cec258",
        color: "#ffffff",
        textAlign: "center",
        py: 4,
        mt: "auto",
      }}
    >
      {/* روابط التواصل الاجتماعي */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Tooltip title="تابعنا على Facebook" arrow>
          <IconButton
            href="https://facebook.com"
            target="_blank"
            sx={{ color: "#ffffff" }}
          >
            <Facebook />
          </IconButton>
        </Tooltip>
        <Tooltip title="تابعنا على Twitter" arrow>
          <IconButton
            href="https://twitter.com"
            target="_blank"
            sx={{ color: "#ffffff" }}
          >
            <Twitter />
          </IconButton>
        </Tooltip>
        <Tooltip title="تابعنا على Instagram" arrow>
          <IconButton
            href="https://instagram.com"
            target="_blank"
            sx={{ color: "#ffffff" }}
          >
            <Instagram />
          </IconButton>
        </Tooltip>
        <Tooltip title="تابعنا على LinkedIn" arrow>
          <IconButton
            href="https://linkedin.com"
            target="_blank"
            sx={{ color: "#ffffff" }}
          >
            <LinkedIn />
          </IconButton>
        </Tooltip>
      </Stack>
      {/* النص الأساسي */}
      <Typography variant="body1" sx={{ mb: 2 }}>
        &copy; {new Date().getFullYear()} جميع الحقوق محفوظة.
      </Typography>
    </Box>
  );
};

export default Footer;
