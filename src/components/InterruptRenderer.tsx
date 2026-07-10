import { useState, type ReactElement } from "react";
import type { InterruptReason, InterruptRendererProps, FormQuestion } from "../types";

function ApprovalVariant({ reason, onResolve, onCancel }: InterruptRendererProps): ReactElement {
  const [responded, setResponded] = useState(false);
  if (reason.type !== "approval") return <></>;

  if (responded) {
    return <div className="kaboo-interrupt-responded">Response submitted</div>;
  }

  return (
    <div className="kaboo-interrupt kaboo-interrupt-approval">
      <div className="kaboo-interrupt-header">
        <svg width={16} height={16} viewBox="0 0 16 16" className="kaboo-interrupt-icon">
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 4.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="11" r="0.75" fill="currentColor" />
        </svg>
        <span className="kaboo-interrupt-message">{reason.message}</span>
      </div>
      {reason.tool_input != null && (
        <details className="kaboo-interrupt-details">
          <summary>View input</summary>
          <pre className="kaboo-interrupt-pre">
            {JSON.stringify(reason.tool_input, null, 2)}
          </pre>
        </details>
      )}
      <div className="kaboo-interrupt-actions">
        <button
          className="kaboo-interrupt-btn kaboo-interrupt-btn-approve"
          onClick={() => { setResponded(true); onResolve({ status: "approved" }); }}
        >
          Approve
        </button>
        <button
          className="kaboo-interrupt-btn kaboo-interrupt-btn-reject"
          onClick={() => { setResponded(true); onCancel(); }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}

/** Drop any option the agent labelled "Other" — the UI adds its own free-text row. */
function withoutOther(options: string[] | undefined): string[] {
  return (options ?? []).filter((o) => o.trim().toLowerCase() !== "other");
}

/**
 * Build the resume payload as a `{question: answer}` map — the single answer
 * representation shared by the model (which reads it as JSON) and the durable
 * Q&A card (which parses the same tool result). Keyed by question text (not
 * index) so both consumers read it without extra correlation state.
 */
function buildAnswerPayload(
  questions: FormQuestion[],
  answers: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  questions.forEach((q, idx) => {
    out[q.question] = answers[String(idx)] ?? "";
  });
  return out;
}

function RadioInput({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string;
  onChange: (v: string) => void;
}): ReactElement {
  const [otherText, setOtherText] = useState("");
  const [isOther, setIsOther] = useState(false);
  const options = withoutOther(question.options);

  return (
    <div className="kaboo-interrupt-radio-group">
      {options.map((opt) => (
        <label key={opt} className={`kaboo-interrupt-option ${value === opt && !isOther ? "kaboo-interrupt-option-selected" : ""}`}>
          <input
            type="radio"
            name={question.question}
            checked={value === opt && !isOther}
            onChange={() => { setIsOther(false); onChange(opt); }}
            className="kaboo-interrupt-radio"
          />
          <span>{opt}</span>
        </label>
      ))}
      <div className={`kaboo-interrupt-option kaboo-interrupt-option-other ${isOther ? "kaboo-interrupt-option-selected" : ""}`}>
        <input
          type="radio"
          name={question.question}
          checked={isOther}
          onChange={() => { setIsOther(true); onChange(otherText); }}
          className="kaboo-interrupt-radio"
        />
        <input
          type="text"
          className="kaboo-interrupt-text-input kaboo-interrupt-other-input"
          placeholder="Other (type your own answer)…"
          value={otherText}
          onChange={(e) => { setOtherText(e.target.value); setIsOther(true); onChange(e.target.value); }}
          onFocus={() => { setIsOther(true); onChange(otherText); }}
        />
      </div>
    </div>
  );
}

function CheckboxInput({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string[];
  onChange: (v: string[]) => void;
}): ReactElement {
  const [otherText, setOtherText] = useState("");
  const options = withoutOther(question.options);

  const toggle = (opt: string) => {
    const next = value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt];
    onChange(next);
  };

  const otherSelected = otherText !== "" && value.includes(otherText);

  return (
    <div className="kaboo-interrupt-checkbox-group">
      {options.map((opt) => (
        <label key={opt} className={`kaboo-interrupt-option ${value.includes(opt) ? "kaboo-interrupt-option-selected" : ""}`}>
          <input
            type="checkbox"
            checked={value.includes(opt)}
            onChange={() => toggle(opt)}
            className="kaboo-interrupt-checkbox"
          />
          <span>{opt}</span>
        </label>
      ))}
      <div className={`kaboo-interrupt-option kaboo-interrupt-option-other ${otherSelected ? "kaboo-interrupt-option-selected" : ""}`}>
        <input
          type="checkbox"
          checked={otherSelected}
          onChange={() => {
            if (otherSelected) onChange(value.filter((v) => v !== otherText));
            else if (otherText) onChange([...value, otherText]);
          }}
          className="kaboo-interrupt-checkbox"
        />
        <input
          type="text"
          className="kaboo-interrupt-text-input kaboo-interrupt-other-input"
          placeholder="Other (type your own answer)…"
          value={otherText}
          onChange={(e) => {
            const prev = otherText;
            const nextText = e.target.value;
            setOtherText(nextText);
            const filtered = value.filter((v) => v !== prev);
            onChange(nextText ? [...filtered, nextText] : filtered);
          }}
        />
      </div>
    </div>
  );
}

function TextInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}): ReactElement {
  return (
    <textarea
      className="kaboo-interrupt-textarea"
      placeholder="Type your answer..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      autoFocus
    />
  );
}

function FormVariant({ reason, onResolve, onCancel }: InterruptRendererProps): ReactElement {
  const questions = reason.type === "form" ? reason.questions : [];
  const isSingle = questions.length === 1;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [responded, setResponded] = useState(false);

  if (responded) {
    return <div className="kaboo-interrupt-responded">Response submitted</div>;
  }

  const setAnswer = (idx: number, val: unknown) => {
    setAnswers((prev) => ({ ...prev, [String(idx)]: val }));
  };

  const current = questions[step];
  if (!current) return <></>;

  const renderQuestion = (q: FormQuestion, idx: number) => {
    if (q.type === "radio") {
      return (
        <RadioInput
          question={q}
          value={(answers[String(idx)] as string) ?? ""}
          onChange={(v) => setAnswer(idx, v)}
        />
      );
    }
    if (q.type === "checkbox") {
      return (
        <CheckboxInput
          question={q}
          value={(answers[String(idx)] as string[]) ?? []}
          onChange={(v) => setAnswer(idx, v)}
        />
      );
    }
    return (
      <TextInput
        value={(answers[String(idx)] as string) ?? ""}
        onChange={(v) => setAnswer(idx, v)}
      />
    );
  };

  const isLast = step === questions.length - 1;

  return (
    <div className="kaboo-interrupt kaboo-interrupt-form">
      {!isSingle && (
        <div className="kaboo-interrupt-progress">
          {step + 1} of {questions.length}
        </div>
      )}
      <div className="kaboo-interrupt-question">
        {current.question}
      </div>
      {renderQuestion(current, step)}
      <div className="kaboo-interrupt-actions">
        {!isSingle && step > 0 && (
          <button
            className="kaboo-interrupt-btn kaboo-interrupt-btn-back"
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
        )}
        {isLast ? (
          <button
            className="kaboo-interrupt-btn kaboo-interrupt-btn-approve"
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
            onClick={() => setStep(step + 1)}
          >
            Next
          </button>
        )}
        <button
          className="kaboo-interrupt-btn kaboo-interrupt-btn-reject"
          onClick={() => { setResponded(true); onCancel(); }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function InterruptRenderer(props: InterruptRendererProps): ReactElement {
  if (props.reason.type === "approval") {
    return <ApprovalVariant {...props} />;
  }
  return <FormVariant {...props} />;
}
