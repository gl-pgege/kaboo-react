import { useState, type ReactElement } from "react";
import { ApprovalActions } from "./ApprovalActions";
import { buildAnswerPayload, toFormQuestion } from "../formatters/askUser";
import type {
  ApprovalReason,
  CustomRequestReason,
  FormQuestion,
  FormReason,
  InterruptReason,
  InterruptRendererProps,
} from "../types";

function AlertIcon(): ReactElement {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" className="kaboo-interrupt-icon" aria-hidden>
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  );
}

function ApprovalVariant(props: InterruptRendererProps<ApprovalReason>): ReactElement {
  const { reason } = props;
  return (
    <div className="kaboo-interrupt kaboo-interrupt-approval">
      <div className="kaboo-interrupt-header">
        <AlertIcon />
        <span className="kaboo-interrupt-message">{reason.message}</span>
      </div>
      {reason.tool_input != null && (
        <details className="kaboo-interrupt-details">
          <summary>View input</summary>
          <pre className="kaboo-interrupt-pre">{JSON.stringify(reason.tool_input, null, 2)}</pre>
        </details>
      )}
      <ApprovalActions {...props} />
    </div>
  );
}

type Answer = string | string[] | undefined;

function hasAnswer(answer: Answer): boolean {
  return Array.isArray(answer) ? answer.length > 0 : typeof answer === "string" && answer.trim() !== "";
}

function ChoiceQuestion({
  question,
  index,
  value,
  onChange,
}: {
  question: FormQuestion;
  index: number;
  value: Answer;
  onChange: (value: Answer) => void;
}): ReactElement {
  const multiple = Boolean(question.multiple);
  const chosen = Array.isArray(value) ? value : typeof value === "string" && value ? [value] : [];
  const otherText = chosen.find((v) => !question.options.includes(v)) ?? "";
  const [otherSelected, setOtherSelected] = useState(otherText !== "");
  const [draft, setDraft] = useState(otherText);
  const name = `kaboo-question-${index}`;
  const picked = chosen.filter((v) => question.options.includes(v));

  const commit = (options: string[], other: boolean, text: string) => {
    const all = other && text.trim() ? [...options, text.trim()] : options;
    onChange(multiple ? all : all[0]);
  };

  const toggle = (option: string) => {
    if (!multiple) {
      setOtherSelected(false);
      commit([option], false, draft);
      return;
    }
    const next = picked.includes(option) ? picked.filter((o) => o !== option) : [...picked, option];
    commit(next, otherSelected, draft);
  };

  const chooseOther = () => {
    const next = multiple ? !otherSelected : true;
    setOtherSelected(next);
    commit(multiple ? picked : [], next, draft);
  };

  return (
    <div
      className={`kaboo-interrupt-choices ${multiple ? "kaboo-interrupt-checkbox-group" : "kaboo-interrupt-radio-group"}`}
      role={multiple ? "group" : "radiogroup"}
      aria-label={question.question}
    >
      {question.options.map((option) => {
        const selected = picked.includes(option) && !(multiple ? false : otherSelected);
        return (
          <label
            key={option}
            className={`kaboo-interrupt-option ${selected ? "kaboo-interrupt-option-selected" : ""}`}
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              checked={selected}
              onChange={() => toggle(option)}
              className={multiple ? "kaboo-interrupt-checkbox" : "kaboo-interrupt-radio"}
            />
            <span>{option}</span>
          </label>
        );
      })}
      <div
        className={`kaboo-interrupt-option kaboo-interrupt-option-other ${otherSelected ? "kaboo-interrupt-option-selected" : ""}`}
      >
        <input
          type={multiple ? "checkbox" : "radio"}
          name={name}
          checked={otherSelected}
          onChange={chooseOther}
          aria-label="Other"
          className={multiple ? "kaboo-interrupt-checkbox" : "kaboo-interrupt-radio"}
        />
        <input
          type="text"
          className="kaboo-interrupt-text-input kaboo-interrupt-other-input"
          placeholder="Other (type your own answer)…"
          aria-label={`Other answer to: ${question.question}`}
          value={draft}
          onFocus={() => {
            if (!otherSelected) {
              setOtherSelected(true);
              commit(multiple ? picked : [], true, draft);
            }
          }}
          onChange={(e) => {
            setDraft(e.target.value);
            setOtherSelected(true);
            commit(multiple ? picked : [], true, e.target.value);
          }}
        />
      </div>
    </div>
  );
}

function FormVariant({ reason, onResolve, onCancel }: InterruptRendererProps<FormReason>): ReactElement {
  const questions = (reason.questions ?? []).map(toFormQuestion);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [responded, setResponded] = useState(false);

  if (responded) {
    return <div className="kaboo-interrupt-responded">Response submitted</div>;
  }
  const current = questions[step];
  if (!current) return <></>;

  const isSingle = questions.length === 1;
  const isLast = step === questions.length - 1;
  const answered = hasAnswer(answers[step]);

  return (
    <div className="kaboo-interrupt kaboo-interrupt-form">
      {!isSingle && (
        <div className="kaboo-interrupt-progress">
          {step + 1} of {questions.length}
        </div>
      )}
      <div className="kaboo-interrupt-question">{current.question}</div>
      <ChoiceQuestion
        key={step}
        question={current}
        index={step}
        value={answers[step]}
        onChange={(value) => setAnswers((prev) => ({ ...prev, [step]: value }))}
      />
      <div className="kaboo-interrupt-actions">
        {!isSingle && step > 0 && (
          <button className="kaboo-interrupt-btn kaboo-interrupt-btn-back" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
        {isLast ? (
          <button
            className="kaboo-interrupt-btn kaboo-interrupt-btn-approve"
            disabled={!questions.every((_, idx) => hasAnswer(answers[idx]))}
            onClick={() => {
              setResponded(true);
              onResolve(buildAnswerPayload(questions, answers));
            }}
          >
            Submit
          </button>
        ) : (
          <button
            className="kaboo-interrupt-btn kaboo-interrupt-btn-next"
            disabled={!answered}
            onClick={() => setStep(step + 1)}
          >
            Next
          </button>
        )}
        <button
          className="kaboo-interrupt-btn kaboo-interrupt-btn-reject kaboo-interrupt-btn-skip"
          onClick={() => {
            setResponded(true);
            onCancel();
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

function CustomVariant({ reason, onCancel }: InterruptRendererProps<CustomRequestReason>): ReactElement {
  const [responded, setResponded] = useState(false);
  if (responded) {
    return <div className="kaboo-interrupt-responded">Response submitted</div>;
  }
  return (
    <div className="kaboo-interrupt kaboo-interrupt-custom">
      <div className="kaboo-interrupt-header">
        <AlertIcon />
        <span className="kaboo-interrupt-message">
          {typeof reason.message === "string" && reason.message ? reason.message : "The assistant needs your input."}
        </span>
      </div>
      <div className="kaboo-interrupt-actions">
        <button
          className="kaboo-interrupt-btn kaboo-interrupt-btn-reject kaboo-interrupt-btn-skip"
          onClick={() => {
            setResponded(true);
            onCancel();
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}

/**
 * Default human-in-the-loop interrupt UI: the approval card (Approve, Allow
 * for this chat, Always allow, Deny with a reason — see
 * {@link ApprovalActions}), the multiple-choice question card (single or
 * multi-select, Other on every question, Submit and Skip, stepping through
 * several questions), and a minimal card with Skip for an app's own request
 * kind that has no registered renderer. Override per kind via
 * `interruptRenderers` on {@link KabooProvider}; style it with the documented
 * `kaboo-interrupt-*` and `kaboo-approval-*` classes.
 *
 * @example
 * ```tsx
 * import { InterruptRenderer } from "@pgege/kaboo-react";
 * import type { InterruptReason } from "@pgege/kaboo-react";
 *
 * const reason: InterruptReason = {
 *   type: "form",
 *   questions: [{ question: "Which market?", options: ["AI", "Cloud"] }],
 * };
 *
 * function Example() {
 *   return (
 *     <InterruptRenderer
 *       reason={reason}
 *       onResolve={() => {}}
 *       onCancel={() => {}}
 *     />
 *   );
 * }
 * ```
 */
export function InterruptRenderer(
  props: InterruptRendererProps<InterruptReason | CustomRequestReason>,
): ReactElement {
  const { reason } = props;
  if (reason.type === "approval") {
    return <ApprovalVariant {...(props as InterruptRendererProps<ApprovalReason>)} />;
  }
  if (reason.type === "form") {
    return <FormVariant {...(props as InterruptRendererProps<FormReason>)} />;
  }
  return <CustomVariant {...(props as InterruptRendererProps<CustomRequestReason>)} />;
}
