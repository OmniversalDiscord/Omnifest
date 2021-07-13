import Particles, { Container } from "react-tsparticles";
import React, { useRef, forwardRef } from "react";
import config from "../config/particles.json";

interface BackgroundProps {
  ref: React.RefObject<Container>;
}

const Background = forwardRef((_, ref) => (
  <Particles
    className="fixed h-full w-full z-0"
    container={ref as React.RefObject<Container>}
    //@ts-ignore
    options={config}
  />
));

export default Background;
