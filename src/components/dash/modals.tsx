"use client";

import { useState } from "react";
import { Field, Modal, input } from "./forms";
import { useDemo } from "./DemoProvider";
import { PURPOSES, TODAY, isISODate, type Access, type Risk } from "@/lib/demo-data";

type Props = { onClose: () => void };

export function NewFileModal({ onClose }: Props) {
  const { reps, addFile } = useDemo();
  const [client, setClient] = useState("");
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [amount, setAmount] = useState("");
  const [broker, setBroker] = useState(reps[0]?.name ?? "");
  const [error, setError] = useState<string | null>(null);

  return (
    <Modal
      title="New loan file"
      sub="Starts with every checklist step still to do."
      submitLabel="Create file"
      error={error}
      onClose={onClose}
      onSubmit={() => {
        const r = addFile({ client, purpose, amount: Number(amount) || 0, broker });
        if (r.ok) onClose();
        else setError(r.error);
      }}
    >
      <Field label="Client surname or name">
        <input className={input} value={client} onChange={(e) => setClient(e.target.value)} placeholder="Nguyen" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Purpose">
          <select className={input} value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            {PURPOSES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Loan amount (A$)">
          <input className={input} type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="650000" />
        </Field>
      </div>
      <Field label="Broker">
        <select className={input} value={broker} onChange={(e) => setBroker(e.target.value)}>
          {reps.map((r) => (
            <option key={r.name}>{r.name}</option>
          ))}
        </select>
      </Field>
    </Modal>
  );
}

export function NewComplaintModal({ onClose }: Props) {
  const { reps, addComplaint } = useDemo();
  const [client, setClient] = useState("");
  const [summary, setSummary] = useState("");
  const [owner, setOwner] = useState(reps[0]?.name ?? "");
  const [received, setReceived] = useState(TODAY);
  const [error, setError] = useState<string | null>(null);

  return (
    <Modal
      title="Log a complaint"
      sub="The response deadline is set to 30 days from the day it was received."
      submitLabel="Log complaint"
      error={error}
      onClose={onClose}
      onSubmit={() => {
        if (!isISODate(received)) return setError("Enter the date it was received.");
        const r = addComplaint({ client, summary, owner, received });
        if (r.ok) onClose();
        else setError(r.error);
      }}
    >
      <Field label="Client">
        <input className={input} value={client} onChange={(e) => setClient(e.target.value)} placeholder="Lopez" />
      </Field>
      <Field label="What is the complaint about?">
        <textarea className={`${input} min-h-24`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Fee disclosed late in the process" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Owner">
          <select className={input} value={owner} onChange={(e) => setOwner(e.target.value)}>
            {reps.map((r) => (
              <option key={r.name}>{r.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Date received">
          <input className={input} type="date" value={received} onChange={(e) => setReceived(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

export function NewBreachModal({ onClose }: Props) {
  const { reps, addBreach } = useDemo();
  const [summary, setSummary] = useState("");
  const [rep, setRep] = useState(reps[0]?.name ?? "");
  const [found, setFound] = useState(TODAY);
  const [grounds, setGrounds] = useState(TODAY);
  const [error, setError] = useState<string | null>(null);

  return (
    <Modal
      title="Record a possible breach"
      sub="Record it the day it surfaces. You decide next whether it is reportable."
      submitLabel="Record breach"
      error={error}
      onClose={onClose}
      onSubmit={() => {
        if (!isISODate(found) || !isISODate(grounds)) return setError("Enter both dates.");
        const r = addBreach({ summary, rep, found, groundsOn: grounds });
        if (r.ok) onClose();
        else setError(r.error);
      }}
    >
      <Field label="What happened?">
        <textarea className={`${input} min-h-24`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Credit guide not issued before assistance began" />
      </Field>
      <Field label="Representative involved">
        <select className={input} value={rep} onChange={(e) => setRep(e.target.value)}>
          {reps.map((r) => (
            <option key={r.name}>{r.name}</option>
          ))}
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date found">
          <input className={input} type="date" value={found} onChange={(e) => setFound(e.target.value)} />
        </Field>
        <Field label="Reasonable grounds from" hint="Starts the 30-day clock.">
          <input className={input} type="date" value={grounds} onChange={(e) => setGrounds(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

export function NewRepModal({ onClose }: Props) {
  const { addRep } = useDemo();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"Employee" | "Credit representative" | "Licensee">("Credit representative");
  const [role, setRole] = useState("");
  const [risk, setRisk] = useState<Risk>("High");
  const [authorised, setAuthorised] = useState(TODAY);
  const [access, setAccess] = useState<Access>("Representative");
  const [error, setError] = useState<string | null>(null);

  return (
    <Modal
      title="Add a team member"
      sub="New representatives start at high risk so they are contacted often until you are comfortable."
      submitLabel="Add to team"
      error={error}
      onClose={onClose}
      onSubmit={() => {
        if (!isISODate(authorised)) return setError("Enter the date they were authorised.");
        const r = addRep({ name, role, kind, risk, authorised, access });
        if (r.ok) onClose();
        else setError(r.error);
      }}
    >
      <Field label="Full name">
        <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Sam O'Brien" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type">
          <select className={input} value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
            <option>Credit representative</option>
            <option>Employee</option>
            <option>Licensee</option>
          </select>
        </Field>
        <Field label="Role description (optional)">
          <input className={input} value={role} onChange={(e) => setRole(e.target.value)} placeholder="Broker, Newcastle office" />
        </Field>
        <Field label="Risk rating">
          <select className={input} value={risk} onChange={(e) => setRisk(e.target.value as Risk)}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </Field>
        <Field label="Authorised from">
          <input className={input} type="date" value={authorised} onChange={(e) => setAuthorised(e.target.value)} />
        </Field>
      </div>
      <Field label="Access level">
        <select className={input} value={access} onChange={(e) => setAccess(e.target.value as Access)}>
          <option>Representative</option>
          <option>Supervisor</option>
          <option>Owner</option>
          <option>Read-only</option>
        </select>
      </Field>
    </Modal>
  );
}

export function AccreditationModal({ rep, onClose }: Props & { rep: string }) {
  const { addAccreditation } = useDemo();
  const [lender, setLender] = useState("");
  const [expires, setExpires] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <Modal
      title={`Add an accreditation for ${rep}`}
      submitLabel="Add accreditation"
      error={error}
      onClose={onClose}
      onSubmit={() => {
        if (!lender.trim()) return setError("Enter the lender.");
        if (!isISODate(expires)) return setError("Enter the expiry date.");
        addAccreditation(rep, lender, expires);
        onClose();
      }}
    >
      <Field label="Lender or aggregator">
        <input className={input} value={lender} onChange={(e) => setLender(e.target.value)} placeholder="Lender E" />
      </Field>
      <Field label="Expires">
        <input className={input} type="date" value={expires} onChange={(e) => setExpires(e.target.value)} />
      </Field>
    </Modal>
  );
}

export function CpdModal({ rep, onClose }: Props & { rep: string }) {
  const { addCpd } = useDemo();
  const [hours, setHours] = useState("1");
  const [error, setError] = useState<string | null>(null);

  return (
    <Modal
      title={`Log CPD hours for ${rep}`}
      submitLabel="Add hours"
      error={error}
      onClose={onClose}
      onSubmit={() => {
        const h = Number(hours);
        if (!h || h <= 0) return setError("Enter the number of hours.");
        addCpd(rep, h);
        onClose();
      }}
    >
      <Field label="Hours completed">
        <input className={input} type="number" min={0.5} step={0.5} value={hours} onChange={(e) => setHours(e.target.value)} />
      </Field>
    </Modal>
  );
}

export function LicenceItemModal({ onClose }: Props) {
  const { addLicenceItem } = useDemo();
  const [label, setLabel] = useState("");
  const [detail, setDetail] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <Modal
      title="Add a licence item"
      sub="Anything with a renewal or review date, such as a policy, insurance or membership."
      submitLabel="Add item"
      error={error}
      onClose={onClose}
      onSubmit={() => {
        if (!label.trim()) return setError("Give the item a name.");
        if (date && !isISODate(date)) return setError("Enter a valid date.");
        addLicenceItem({ label: label.trim(), detail: detail.trim() || "On file", date: date || undefined, dateLabel: date ? "Renews" : undefined });
        onClose();
      }}
    >
      <Field label="Name">
        <input className={input} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Privacy policy" />
      </Field>
      <Field label="Detail (optional)">
        <input className={input} value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Reviewed by compliance" />
      </Field>
      <Field label="Renewal or review date (optional)">
        <input className={input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </Field>
    </Modal>
  );
}
