import { Container, Typography } from "@mui/material";
import React from "react";
import colors from "../../colors";
const { titleColor } = colors;

const Header = () => {
  return (
    <Container sx={{ marginTop: "1em", textAlign: "center" }}>
      <Typography
        component="h1"
        variant="h5"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: titleColor,
          display: "inline-block",
          padding: "0.5em 0.5em 0.5em 0.5em",
        }}
      >
        Génération de virements au format SEPA
      </Typography>
    </Container>
  );
};

export default Header;
