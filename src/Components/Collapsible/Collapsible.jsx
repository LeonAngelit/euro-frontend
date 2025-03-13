import "./Collapsible.component.css";
import { React, useEffect, useState } from "react";
import { VscChevronRight } from "react-icons/vsc";
import { IconContext } from "react-icons";

const Collapsible = (props) => {
  const [collapse, setCollapse] = useState(true);
  function handleCollapse() {
    setCollapse(!collapse);
  }
  useEffect(() => {
    if (props.collapsed == true) {
      setCollapse(props.collapsed);
      window.scrollTo({ top: 0 });
    }
  }, [props.collapsed]);

  return (
    <div className="collapsible-wrapper">
      <div
        className={
          collapse ? "collapsible-title title-collapsed" : "collapsible-title"
        }
      >
        <button
          className={
            collapse ? "collapsible-button" : "collapsible-button rotated"
          }
          onClick={handleCollapse}
        >
          <IconContext.Provider value={{ color: "black", size: "25px" }}>
            <VscChevronRight />
          </IconContext.Provider>
        </button>
        <p>{props.title}</p>
      </div>
      <div className={collapse ? "collapsed" : "uncollapsed"}>
        {props.children}
      </div>
    </div>
  );
};

export default Collapsible;
