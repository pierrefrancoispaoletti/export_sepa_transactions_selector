import { Container, Typography } from "@mui/material";
import React from "react";
import colors from "../../colors";
const { textColorLight, backgroundColorLight } = colors;

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
          textTransform: "uppercase",
          color: textColorLight,
          backgroundColor: backgroundColorLight,
          display: "inline-block",
          padding: "0.5em 0.5em 0.5em 0.5em",
        }}
      >
        Sélection des virements à effectuer
      </Typography>
    </Container>
  );
};

export default Header;
