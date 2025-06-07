"use client";
import { useContext, useEffect } from "react";

import layoutButtonContext from "@/app/context/layoutButtonContext";

const StudentsPage = () => {
  const { setButtonTitle, setButtonLink } = useContext(layoutButtonContext); // our button context

  // effect hook for setting the button link and title and unmounting when done
  useEffect(() => {
    setButtonTitle("Add Student");
    setButtonLink("#");

    return () => {
      setButtonTitle("");
      setButtonLink("");
    };
  }, [setButtonLink, setButtonTitle]);

  return <div>StudentsPage</div>;
};

export default StudentsPage;
