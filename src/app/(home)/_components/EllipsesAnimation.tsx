import React, { useEffect, useRef, useCallback, useState } from "react";

interface Ellipse {
  element: SVGEllipseElement;
  animation: Animation;
}

const ANIMATION_DURATION = 16000; // ms
const ELLIPSE_INTERVAL = 1000; // ms
const INITIAL_ELLIPSES = 20;
const MAX_ELLIPSES = 40;
const BASE_WIDTH = 825.85 * 1.4;
const BASE_HEIGHT = 241.25 * 1.4;
const SCALE_FACTOR_X = 1.8;
const SCALE_FACTOR_Y = 2.8;
const THRESHOLD_WIDTH = 1024; 

export default function EllipsesAnimation(): JSX.Element {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  const updateScaleFactor = useCallback(() => {
    if (svgRef.current) {
      const width = svgRef.current.clientWidth;
      setScaleFactor(Math.max(1, width / THRESHOLD_WIDTH));
    }
  }, []);

  const createEllipse = useCallback((): SVGEllipseElement => {
    const ns = "http://www.w3.org/2000/svg";
    const ellipse = document.createElementNS(ns, "ellipse");
    ellipse.setAttribute("cx", "50%");
    ellipse.setAttribute("cy", "50%");
    ellipse.setAttribute("rx", "0");
    ellipse.setAttribute("ry", "0");
    ellipse.setAttribute("fill", "none");
    ellipse.setAttribute("stroke", "#F2EBFF");
    ellipse.setAttribute("stroke-width", "1");
    return ellipse;
  }, []);

  const animateEllipse = useCallback((ellipse: SVGEllipseElement, index: number, initialProgress: number = 0): Animation => {
    const startWidth = BASE_WIDTH * Math.pow(SCALE_FACTOR_X, index) * scaleFactor;
    const startHeight = BASE_HEIGHT * Math.pow(SCALE_FACTOR_Y, index) * scaleFactor;
    const endWidth = startWidth * SCALE_FACTOR_X;
    const endHeight = startHeight * SCALE_FACTOR_Y;

    const animation = ellipse.animate(
      [
        { rx: "0", ry: "0" },
        { rx: `${endWidth / 2}px`, ry: `${endHeight / 2}px` }
      ],
      {
        duration: ANIMATION_DURATION,
        fill: 'forwards',
        easing: 'ease-out'
      }
    );

    animation.currentTime = ANIMATION_DURATION * initialProgress;

    return animation;
  }, [scaleFactor]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const ellipses: Ellipse[] = [];

    const addNewEllipse = (initialProgress = 0) => {
      if (ellipses.length >= MAX_ELLIPSES) {
        const oldestEllipse = ellipses.shift();
        if (oldestEllipse) {
          svg.removeChild(oldestEllipse.element);
          oldestEllipse.animation.cancel();
        }
      }

      const newEllipse = createEllipse();
      svg.appendChild(newEllipse);
      const animation = animateEllipse(newEllipse, 0, initialProgress);
      ellipses.push({ element: newEllipse, animation });
    };

    // 초기 원들을 생성하고 애니메이션 적용
    for (let i = 0; i < INITIAL_ELLIPSES; i++) {
      addNewEllipse(i / INITIAL_ELLIPSES);
    }

    const intervalId = setInterval(() => addNewEllipse(), ELLIPSE_INTERVAL);

    const resizeObserver = new ResizeObserver(updateScaleFactor);
    resizeObserver.observe(svg);

    return () => {
      clearInterval(intervalId);
      resizeObserver.disconnect();
      ellipses.forEach(({ element, animation }) => {
        svg.removeChild(element);
        animation.cancel();
      });
    };
  }, [createEllipse, animateEllipse, updateScaleFactor]);

  useEffect(() => {
    updateScaleFactor();
  }, [updateScaleFactor]);

  return (
    <svg
      ref={svgRef}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    />
  );
}