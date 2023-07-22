import "./styles.css";
import React, { useEffect, useMemo } from "react";
import styled from "styled-components";

const AccordionApiContext = React.createContext();

const useAccordionApi = () => {
  const ctx = React.useContext(AccordionApiContext);

  return ctx;
};

const Accordion = ({ oneAtATime, children, gap = "0" }) => {
  const panels = React.useRef({});

  const api = useMemo(
    () => ({
      handleToggle: (e) => {
        if (!oneAtATime) return;

        Object.values(panels.current).forEach((p) => {
          if (!e.currentTarget.isSameNode(p.details) && p.details.open) {
            p.details.removeAttribute("open");
          }
        });
      },
      register: (id, { details, summary }) => {
        panels.current = {
          ...panels.current,
          [id]: {
            details: details ?? panels.current[id]?.details,
            summary: summary ?? panels.current[id]?.summary
          }
        };
      }
    }),
    [oneAtATime]
  );

  return (
    <AccordionApiContext.Provider value={api}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap
        }}
      >
        {children}
      </div>
    </AccordionApiContext.Provider>
  );
};

const PanelContext = React.createContext();

const usePanelState = () => {
  const ctx = React.useContext(PanelContext);

  return ctx;
};

const StyledSummary = styled.summary`
  padding: 8px 0;
  text-align: left;
  border: 1px solid var(--arrowColor);
  display: flex;
  align-items: center;
  border-radius: 8px;
`;

const StyledDetails = styled.details`
  --padding: 8px;
  --arrow: 16px;
  --arrowColor: dodgerblue;

  display: flex;

  svg {
    width: var(--arrow);
    height: auto;
    padding: 0 8px;
  }
`;
const Panel = ({ children }) => {
  const id = React.useId();
  const ref = React.useRef(null);
  const { register, handleToggle } = useAccordionApi();

  return (
    <PanelContext.Provider value={{ detailsId: id }}>
      <StyledDetails
        onClick={handleToggle}
        id={id}
        ref={(el) => {
          ref.current = el;
          register(id, { details: el });
        }}
      >
        {children}
      </StyledDetails>
    </PanelContext.Provider>
  );
};

const Icon = () => {
  const { detailsId } = usePanelState();
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    const handle = (e) => {
      setIsOpen(e.target.open);
    };
    const details = document.querySelector(`[id="${detailsId}"]`);

    if (!details) return;

    details.addEventListener("toggle", handle);

    return () => {
      details.removeEventListener("toggle", handle);
    };
  }, [detailsId]);

  return (
    <>
      <svg
        style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0)" }}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="var(--arrowColor)"
        class="bi bi-caret-right-fill"
        viewBox="0 0 16 16"
      >
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
      </svg>
    </>
  );
};

const Summary = ({ children }) => {
  const { detailsId } = usePanelState();
  const { register } = useAccordionApi();

  const ref = React.useRef(null);

  return (
    <StyledSummary
      ref={(el) => {
        ref.current = el;
        register(detailsId, { summary: el });
      }}
    >
      <Icon />
      {children}
    </StyledSummary>
  );
};

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--padding) calc(var(--padding) + var(--arrow));
`;

export default function App() {
  return (
    <div className="App">
      <Accordion oneAtATime gap="8px">
        <Panel>
          <Summary>hi</Summary>
          <Flex>hello</Flex>
        </Panel>
        <Panel>
          <Summary>hi</Summary>
          <Flex>hello</Flex>
        </Panel>
        <Panel>
          <Summary>hi</Summary>
          <Flex>hello</Flex>
        </Panel>
      </Accordion>
    </div>
  );
}
