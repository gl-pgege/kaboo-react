import type { ComponentProps, ReactNode } from "react";
import type { ReactActivityMessageRenderer } from "@copilotkit/react-core/v2";
import { useActivity } from "../hooks/useActivity";
import { surfaceOwner } from "../utils/surfaces";

function SurfaceFrom({ messageId, children }: { messageId: string; children: ReactNode }) {
  const { groups } = useActivity();
  const owner = surfaceOwner(groups, messageId);
  if (!owner) return <>{children}</>;
  return (
    <div className="kaboo-request-from-agent">
      <div className="kaboo-request-agent">{owner.title || owner.agentName}</div>
      {children}
    </div>
  );
}

/**
 * Label a generative UI surface with the sub-agent that rendered it, as the
 * sub-agent's questions are labelled. Wrap the activity renderer passed to
 * `renderActivityMessages`; surfaces from the agent answering the chat stay
 * unlabelled.
 *
 * @example
 * ```tsx
 * import { createA2UIMessageRenderer } from "@copilotkit/react-core/v2";
 * import { withSubagentLabel } from "@pgege/kaboo-react/copilotkit";
 *
 * const renderers = [withSubagentLabel(createA2UIMessageRenderer({ theme }))];
 * ```
 */
export function withSubagentLabel<T>(renderer: ReactActivityMessageRenderer<T>): ReactActivityMessageRenderer<T> {
  const Render = renderer.render;
  function LabelledSurface(props: ComponentProps<typeof Render>) {
    return (
      <SurfaceFrom messageId={props.message.id}>
        <Render {...props} />
      </SurfaceFrom>
    );
  }
  return { ...renderer, render: LabelledSurface };
}
