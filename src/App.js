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
            summary: summary ?? panels.current[id]?.summary,
          },
        };
      },
    }),
    [oneAtATime]
  );

  return (
    <AccordionApiContext.Provider value={api}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap,
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
  padding: 8px;
  text-align: left;
  border: 1px solid var(--arrowColor);
  display: flex;
  align-items: center;
  border-radius: 8px;
`;

const StyledDetails = styled.details`
  --spacer: 8px;
  --arrow: 16px;
  --arrowColor: dodgerblue;

  display: flex;

  svg {
    width: var(--arrow);
    height: auto;
  }
`;
const Panel = ({ children }) => {
  const id = React.useId();
  const ref = React.useRef(null);
  const { register, handleToggle } = useAccordionApi();

  return (
    <PanelContext.Provider value={{ detailsRef: ref, detailsId: id }}>
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
  const [isLast, setIsLast] = React.useState(false);

  const { detailsRef } = usePanelState();
  useEffect(() => {
    const handle = (e) => {
      setIsOpen(e.target.open);
    };

    if (!detailsRef.current) return;

    const el = detailsRef.current;
    const summary = [...el.children].find((e) => e.tagName === "SUMMARY");

    setIsLast(summary.lastChild.tagName === "svg");

    el.addEventListener("toggle", handle);

    return () => {
      el.removeEventListener("toggle", handle);
    };
  }, [detailsId, detailsRef]);

  return (
    <>
      <svg
        style={{
          margin: isLast ? "0 0 0 auto" : "0 8px 0 0",
          transform: isOpen ? "rotate(180deg)" : "rotate(0)",
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="var(--arrowColor)"
        class="bi bi-caret-up-fill"
        viewBox="0 0 16 16"
      >
        <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
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
      {children}
    </StyledSummary>
  );
};

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${({ iconLeft = true }) =>
    iconLeft
      ? `var(--spacer) calc(var(--spacer) * 2 + var(--arrow))`
      : "var(--spacer)"};
`;

export default function App() {
  return (
    <div className="App">
      <Accordion oneAtATime gap="8px">
        <Panel>
          <Summary>
            <Icon />
            hi
          </Summary>
          <Flex>hello</Flex>
        </Panel>
        <Panel>
          <Summary>
            <Icon />
            hi
          </Summary>
          <Flex>hello</Flex>
        </Panel>
        <Panel>
          <Summary>
            hi
            <Icon />
          </Summary>
          <Flex iconLeft={false}>hello</Flex>
        </Panel>
      </Accordion>
    </div>
  );
}
