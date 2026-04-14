import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClipboardList, ChevronDown, ChevronRight, CheckCircle2,
  XCircle, MinusCircle, HelpCircle, BarChart3, Download,
  AlertTriangle, Award, Clock, Plus, Search, Trash2, Eye,
  ArrowLeft, Save, FileText
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────
type Answer = 'YES' | 'PARTIAL' | 'NO' | 'N/A' | '';

interface Question {
  id: string;
  text: string;
}

interface Section {
  id: string;
  title: string;
  color: string;
  questions: Question[];
}

interface EvaluationRecord {
  id: string;
  supplierName: string;
  evaluatorName: string;
  date: string;
  answers: Record<string, Answer>;
  totalScore: number;
  maxScore: number;
  percentage: number;
  result: 'SELECTED' | 'ON-PROGRESS' | 'REJECTED';
  createdAt: string;
}

// ─── Question Bank ──────────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    id: 'A',
    title: "Section A: Supplier's Background",
    color: '#6366f1',
    questions: [
      { id: 'A1',  text: 'Is there a procedure to measure competency of the supplier capabilities against needs/requirements?' },
      { id: 'A2',  text: "Is there a procedure to measure the supplier's respond to the needs/demands, and to market and supply fluctuations?" },
      { id: 'A3',  text: 'Is the company willing to establish a Quality Agreement in accordance with your requirements?' },
      { id: 'A4',  text: 'Does this supplier have control over their policies, processes, procedures, and supply chain? Do they ensure that they deliver consistently and reliably, especially if they rely on scarce resources, and if these resources are controlled?' },
      { id: 'A5',  text: 'Is there any information that the supplier can offer to demonstrate their ongoing financial strength?' },
      { id: 'A6',  text: 'Is there a potential for price reduction based on increased efficiencies?' },
      { id: 'A7',  text: 'Does this supplier ensure that they consistently provide high quality goods or services?' },
      { id: 'A8',  text: 'Is there a quality culture in the organization driven and supported by top management?' },
      { id: 'A9',  text: 'Is there a written procedure to reduce their environmental footprint? Have they earned any green accolades or credentials?' },
      { id: 'A10', text: 'Are there well defined functional contacts? Does the supplier communicate pro-actively?' },
      { id: 'A11', text: 'Is the supplier providing goods/services to the company for long period of time and how long?' },
      { id: 'A12', text: 'Whether there is any business contingency plan if the supplier due to its financial incapacity or for force majeure cannot deliver the products?' },
      { id: 'A13', text: 'Did the supplier deliver shipment in time during the last year? If no, how many times did they fail?' },
      { id: 'A14', text: 'Is the supplier prompt in replying to enquiries?' },
      { id: 'A15', text: 'Does the supplier have a good market reputation?' },
      { id: 'A16', text: 'Does the facility have sufficient financial capability to run bulk production as per order? Does the facility check their money laundering/Terrorist funding before enrolment?' },
      { id: 'A17', text: 'Is the company capable to meet the lead time both for samples and bulk production?' },
      { id: 'A18', text: 'Does the supplier have adequate resources (i.e. Manpower, Machineries, Equipments etc.) to meet the customer\'s product requirement?' },
      { id: 'A19', text: 'Does the supplier maintain a pricing that is consistent with the market price?' },
      { id: 'A20', text: 'Has the vendor regularly met his commitment to high quality standards with respect to delivery & after sales service?' },
    ]
  },
  {
    id: 'B',
    title: 'Section B: Social Compliance',
    color: '#10b981',
    questions: [
      { id: 'B1',  text: 'Does the supplier prohibit Child labor? Is the proof of age for all Workers collected, documented and preserved?' },
      { id: 'B2',  text: 'Is there any prohibit forced, prison, bonded or involuntary labour?' },
      { id: 'B3',  text: 'Is there proactive measures for preventing any severe environmental pollution?' },
      { id: 'B4',  text: 'Are the workers prevented from exposure to severe health or safety hazards?' },
      { id: 'B5',  text: 'Are all the workers paid a wage equal to or exceeding the legal minimum wage?' },
      { id: 'B6',  text: 'Does the supplier provide accident insurance to all Workers, covering medical treatment & compensation for work related accidents?' },
      { id: 'B7',  text: 'Are there routines in place to ensure that applicable laws and regulations related to Legal requirements are implemented?' },
      { id: 'B8',  text: 'Does the supplier have all legal license/certifications (Trade, Factory License, Fire license etc.) as applicable and prescribed by national laws?' },
      { id: 'B9',  text: 'Does the supplier have Building/Construction/Floor layout approval from the concerned Authority?' },
      { id: 'B10', text: 'Does the factory have developed and implemented an anti corruption policy? Does it clearly state that bribery & corruption are unacceptable?' },
      { id: 'B11', text: 'Are the relevant documents, records, reports etc. transparent, correct and reliable?' },
      { id: 'B12', text: 'Are all applicable laws and regulations relating to emissions to air complied with and the necessary permits and test reports are obtained?' },
      { id: 'B13', text: 'Does the factory have documented and implemented routines for purchasing, storage, handling of chemicals and emergency response?' },
      { id: 'B14', text: 'Is there a complete list of all chemicals & Are the chemicals stored in secondary containment with MSDS and labelling?' },
      { id: 'B15', text: 'Are there documented routines for the handling, storing, transportation and disposal of hazardous and non-hazardous waste?' },
      { id: 'B16', text: 'Is there a list of hazardous and non-hazardous waste & maintained in order to monitor the type & quantity of waste that is being generated?' },
      { id: 'B17', text: 'Is there sufficient emergency exits and routes to ensure a fast and safe evacuation of all Workers?' },
      { id: 'B18', text: 'Is there sufficient emergency evacuation plan posted on the relevant places in the floor?' },
      { id: 'B19', text: 'Is there a functioning evacuation alarm to notify all Workers about an emergency situation?' },
      { id: 'B20', text: 'Are there evacuation drills at least once in every 06 months that involve all shifts and departments and workers performed?' },
      { id: 'B21', text: 'Has the facility done a risk assessment for the whole site and all its workplaces?' },
      { id: 'B22', text: 'Are safety Information and/or warning signs clearly visibly at risk areas?' },
      { id: 'B23', text: 'Are there safe working routines implemented to minimize risk of injuries associated with hazardous work tasks i.e. work at height etc?' },
      { id: 'B24', text: 'Are the risks and other occupational hazards in the workplace that can cause an accident/injury acted on and minimized?' },
      { id: 'B25', text: 'Are all the appropriate PPE available, used and provided free of charge for workers in any harmful or potentially risky work areas?' },
      { id: 'B26', text: 'Are there first aid equipment & trained first aider available to workers as per legislation?' },
      { id: 'B27', text: 'Does the company provide clean drinking water to all Workers free of charge?' },
      { id: 'B28', text: 'Does the company implement good housekeeping to ensure a hygienic and safe environment for workers?' },
      { id: 'B29', text: 'Are there adequate arrangements where workers can rest and eat during their breaks?' },
      { id: 'B30', text: 'Is there an alcohol and drug control policy?' },
      { id: 'B31', text: 'Does the supplier have established and implemented transparent recruitment policy that enables recruitment without any discrimination?' },
      { id: 'B32', text: 'Does the company sign a written employment contract with each worker before they start work?' },
      { id: 'B33', text: 'Are the payroll, attendance records, payment of wages and working hours maintained for each worker?' },
      { id: 'B34', text: 'Are the working hours limited to maximum sixty (60) hours per week, including overtime? Are the overtime hours done on a voluntary basis?' },
      { id: 'B35', text: 'Does every worker get at least one day off in seven?' },
      { id: 'B36', text: 'Does the Supplier provide the Minimum wage as per gazette including compensation for overtime?' },
      { id: 'B37', text: 'Are the workers paid on time at regular intervals and at least monthly?' },
      { id: 'B38', text: 'Are the deductions made by company maintained as per labour law & do not result in a wage paid out that is below the legal minimum wage?' },
      { id: 'B39', text: 'Are the workers provided with leave from their job according to applicable local legislation and standards?' },
      { id: 'B40', text: 'Are the workers provided with all legally mandated benefits such as medical insurance, social insurance etc. to which they are entitled?' },
      { id: 'B41', text: 'Are there routines in practice on how to bring up issues and complaints regarding any issues e.g. discrimination, harassment or abuse?' },
      { id: 'B42', text: 'Does the grievance routine include how all workers can bring up issues and complaints directly to the Supplier?' },
      { id: 'B43', text: 'Are there routines describing preventive actions against harassment and abuse? Are the rules for disciplinary actions properly implemented?' },
      { id: 'B44', text: 'Are the workers allowed to access toilets and drinking water stations anytime at their will?' },
      { id: 'B45', text: 'Is there a hygienic canteen facility for the workers?' },
      { id: 'B46', text: 'Are there sufficient fire fighting mechanisms i.e. fire fighting & rescue team, fire fighting equipment, smoke detectors as applicable?' },
      { id: 'B47', text: 'Are the Fire equipment checked for their effectiveness periodically and preserved the effective maintenance records?' },
      { id: 'B48', text: 'Is there a policy for pregnant workers that provide for special arrangements on the job?' },
      { id: 'B49', text: 'Does the company provide maternity leave and other benefits as prescribed by local law?' },
      { id: 'B50', text: 'Is there a procedure in place to periodically evaluate the effectiveness for identifying non-conformities & developing countermeasures for continual improvement? If so, are they properly documented?' },
    ]
  },
  {
    id: 'C',
    title: 'Section C: Quality System',
    color: '#f59e0b',
    questions: [
      { id: 'C1',  text: 'Does the factory have accredited Quality Management System in place?' },
      { id: 'C2',  text: 'Does the factory have a Quality Manual?' },
      { id: 'C3',  text: 'Does factory have Product Safety Compliance Certification?' },
      { id: 'C4',  text: 'Does the factory maintain records that all paints, non-paint components are tested for Lead and Heavy Metals content?' },
      { id: 'C5',  text: 'Does factory have documented REACH document control system?' },
      { id: 'C6',  text: 'Does factory implement sharp tools control procedure?' },
      { id: 'C7',  text: 'Does factory have metal detecting unit located at the right finishing area? Is it enclosed and secured that have regular calibration records?' },
      { id: 'C8',  text: 'Does the factory implement Broken Needle & Broken Glasses Policy?' },
      { id: 'C9',  text: 'Does the factory use any QC Tools / Reports / Improvement plans?' },
      { id: 'C10', text: "Does the factory have factory's inspection plan & Defect Classification List?" },
      { id: 'C11', text: 'Does the factory have a process to manage approved finished product samples, including maintenance and renewal?' },
      { id: 'C12', text: 'Does detailed specification set up for individual product?' },
      { id: 'C13', text: 'Does the factory take any action to prevent rejected or non-conformance items from being misused?' },
      { id: 'C14', text: 'Does the factory take any action to avoid deterioration of quality or safety for incoming materials, finished products and packed goods?' },
      { id: 'C15', text: 'Does the factory have any procedure for ensuring traceability for materials, components, manufactured parts and finished goods?' },
      { id: 'C16', text: 'Does the factory provide production line and packing line guidelines?' },
      { id: 'C17', text: 'Is the checking Light Box being put under a proper environment?' },
      { id: 'C18', text: 'Does the supplier have Flow Chart of Incoming Materials Control, Production Process, In-house Lab test & Final Inspection?' },
      { id: 'C19', text: 'Does the supplier have Organogram including Quality Department? Does the quality head have the authority to perform his job independently?' },
      { id: 'C20', text: 'Does the supplier perform inspection and testing at Incoming Stage, Processing Stage & Final Stage?' },
      { id: 'C21', text: 'Does the supplier control Non-Conforming products? If yes, please describe how.' },
      { id: 'C22', text: 'Have the supplier established & maintained a training system in place to provide awareness, skills and trainings to its personnel?' },
      { id: 'C23', text: 'Does the supplier have a customer complaint System?' },
      { id: 'C24', text: 'Does the supplier follow set of procedures for performing work?' },
      { id: 'C25', text: 'Are existing machines adequate to produce required quality product?' },
      { id: 'C26', text: 'Are storage areas/conditions adequate to safeguard the product against deterioration?' },
      { id: 'C27', text: 'Are the management and workers committed to quality?' },
      { id: 'C28', text: 'Does the supplier assess the product and process Risk?' },
      { id: 'C29', text: 'Does the supplier follow written specifications/standards/work instruction?' },
      { id: 'C30', text: 'Does the supplier perform machine maintenance & preserved the maintenance records?' },
    ]
  },
  {
    id: 'D',
    title: 'Section D: Security System',
    color: '#ef4444',
    questions: [
      { id: 'D1',  text: 'Does the facility have a documented and communicated security management policy for supply chain security?' },
      { id: 'D2',  text: 'Does the facility have security management objectives that are implemented, maintained, documented, derived from and consistent with the security management policy?' },
      { id: 'D3',  text: 'Does the facility have security management targets that are implemented, maintained, documented, derived from and consistent with the security management objectives?' },
      { id: 'D4',  text: 'Does the facility have security management procedures established, implemented, maintained and documented for achieving security management objectives and targets?' },
      { id: 'D5',  text: 'Is there a defined organizational structure of roles, responsibilities and authorities for security management?' },
      { id: 'D6',  text: 'Are there procedures for ensuring that important security management information is communicated to and from relevant employees, contractors and other stakeholders?' },
      { id: 'D7',  text: 'Are there security management operational controls in place to manage identified threats and risk in the supply chain and to achieve the security management policy objectives?' },
      { id: 'D8',  text: 'Does the supplier take over the security responsibilities in the part of supply chain under their accountability including cargo en route?' },
      { id: 'D9',  text: 'Are there procedures in place for top management, at planned intervals, to evaluate the security management system to ensure its continuing suitability, adequacy and effectiveness?' },
      { id: 'D10', text: 'Is there a documented procedure in place to respond during any emergency (sabotage, fire incident, natural disaster, chemical accident etc.) that hampers the integrity of the overall security system?' },
      { id: 'D11', text: 'Does the facility have written, verifiable processes and procedures used in the selection of business partners?' },
      { id: 'D12', text: 'Does the facility incorporate and meet minimum supply chain security requirement i.e. Security Code of Conduct as communicated by NFFL?' },
      { id: 'D13', text: 'Is there a procedure in place to prevent unauthorized access to a container or a trailer and/or product storage areas within the facility including whom to notify if any issue identified?' },
      { id: 'D14', text: 'Does the supplier inspect the security integrity of a container or trailer prior to loading?' },
      { id: 'D15', text: 'Is driver information recorded and retained for all departing cargo?' },
      { id: 'D16', text: 'Is a written procedure in place instructing drivers to take designated routes between the supplier factory and the destination?' },
      { id: 'D17', text: 'Does the contracted transportation company use container or trailer tracking technologies?' },
      { id: 'D18', text: 'Is a written and verifiable security procedure in place with contracted less than container load (LCL) service providers?' },
      { id: 'D19', text: 'Is there a procedure in place that requires an LCL container or trailer to be sealed after each stop with either a tamper evident seal or a padlock?' },
      { id: 'D20', text: 'Is a written procedure in place that outlines access control to the facility, property and buildings?' },
      { id: 'D21', text: 'Are access control procedures or devices used to ensure that only authorized personnel have access the facility?' },
      { id: 'D22', text: 'Is there a written and verifiable procedure in place to monitor and limit access to critical operational areas of the facility, such as warehouse, final packing or packaging and shipping?' },
      { id: 'D23', text: 'Is there a written and verifiable procedure in place that requires a visitor to present photo identification upon arrival and their information is recorded into a visitor log including entry and exit time?' },
      { id: 'D24', text: 'Is there a written and verifiable procedure in place to inspect a suspicious package and mail for dangerous materials prior to distribution?' },
      { id: 'D25', text: 'Are employees required to display their ID badge at all times while at the facility?' },
      { id: 'D26', text: 'Is there a written and verifiable procedure in place to identify, challenge, and remove an unauthorized person at the facility?' },
      { id: 'D27', text: 'Is there an employee hiring procedure documented and implemented?' },
      { id: 'D28', text: 'If allowed by local law, is a written procedure in place to perform a background check on an applicant and employee who works in sensitive area of the facility, such as personnel, shipping, computer systems?' },
      { id: 'D29', text: 'Is a written procedure in place to remove facility access, such as a facility issued ID badge or computer access code from any employee who has separated, or takes an extended leave of absence?' },
      { id: 'D30', text: 'Is there a designated employee and visitor vehicle parking area separated from the shipping and receiving area?' },
      { id: 'D31', text: 'Does the shipping area have a fence, a wall, or other controls separating domestic, hazardous, high value, and international goods and materials?' },
      { id: 'D32', text: 'Is there a preventative maintenance procedure in place that requires a regular inspection of perimeter fencing or other barriers and structures?' },
      { id: 'D33', text: 'Are facility gates through which vehicles and/or employees enter and exit guarded or monitored and secured when not in use?' },
      { id: 'D34', text: 'In the event of a power outage, does the facility have an alternate electrical power system to ensure uninterrupted operation of electronic security systems?' },
      { id: 'D35', text: 'Are facility buildings constructed of materials that will resist easy illegal entry?' },
      { id: 'D36', text: 'Are facility windows, gates, fences, and doors secured with locking devices to deter unauthorized access?' },
      { id: 'D37', text: 'Is there a written and verifiable procedure in place to control the issue, removal, and changing of access devices such as ID badge, door and lock keys, access cards, and security alarm codes?' },
      { id: 'D38', text: 'Does the facility have sufficient lighting at entrances, exits, cargo handling and storage areas, along fence lines, and in parking areas to detect movement during periods of darkness?' },
      { id: 'D39', text: 'Does the facility have an anti-intrusion alarm system?' },
      { id: 'D40', text: "Is there a CCTV system used to monitor the facility and premises' including entrances, exits, cargo storage, shipping, and other loading/unloading areas?" },
      { id: 'D41', text: 'Is there a procedure in place to test and inspect the CCTV system and does the factory keep back up for a certain period?' },
      { id: 'D42', text: 'Is there a Security Threat Awareness training program established, maintained and communicated across the organization?' },
      { id: 'D43', text: 'Does Threat Awareness training inform employees of procedures to report suspicious activity or a security incident?' },
      { id: 'D44', text: 'Does Threat Awareness training provide additional instruction to shipping and receiving employees regarding access controls, container and trailer inspection, and security seal control procedures?' },
      { id: 'D45', text: 'Does the training program include criteria critical to security programs such as Terrorism, Narcotics, Smuggling, Human Trafficking etc.?' },
      { id: 'D46', text: 'Is there a written information technology system security policy in place?' },
      { id: 'D47', text: 'Do automated systems at the facility have individually assigned user accounts that require a periodic change of password?' },
      { id: 'D48', text: 'Are written procedures and automated back-up capabilities in place to protect against the loss of data?' },
      { id: 'D49', text: 'Are automated systems in place to monitor for and prevent attempts of unauthorized access and tampering with systems and/or electronic data?' },
      { id: 'D50', text: 'Are employees with computer systems access aware of and receive training about information technology system policies, procedures, and security standards; and is employee training documented and retained?' },
    ]
  }
];

// Scoring: YES=2, PARTIAL=1, NO=0, N/A=0
const SCORE_MAP: Record<Answer, number> = { YES: 2, PARTIAL: 1, NO: 0, 'N/A': 0, '': 0 };

function calcScore(answers: Record<string, Answer>) {
  let total = 0, max = 0;
  for (const s of SECTIONS) {
    for (const q of s.questions) {
      const ans = answers[q.id] ?? '';
      if (ans !== 'N/A' && ans !== '') {
        total += SCORE_MAP[ans];
        max += 2;
      } else if (ans === '') {
        max += 2; // unanswered counts toward max
      }
      // N/A excluded from max
    }
  }
  return { total, max };
}

function getResult(pct: number): { label: string; color: string; bg: string } {
  if (pct > 80) return { label: 'SELECTED', color: '#10b981', bg: '#10b98120' };
  if (pct > 60) return { label: 'ON-PROGRESS', color: '#f59e0b', bg: '#f59e0b20' };
  return { label: 'REJECTED', color: '#ef4444', bg: '#ef444420' };
}

// ─── Answer Button ──────────────────────────────────────────────────────────
function AnswerButton({ value, selected, onClick }: { value: Answer; selected: boolean; onClick: () => void; key?: React.Key }) {
  const configs: Record<string, { icon: React.ReactNode; label: string; selColor: string; selBg: string }> = {
    YES:     { icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: 'YES',     selColor: '#10b981', selBg: '#10b98120' },
    PARTIAL: { icon: <MinusCircle  className="w-3.5 h-3.5" />, label: 'PARTIAL', selColor: '#f59e0b', selBg: '#f59e0b20' },
    NO:      { icon: <XCircle      className="w-3.5 h-3.5" />, label: 'NO',      selColor: '#ef4444', selBg: '#ef444420' },
    'N/A':   { icon: <HelpCircle   className="w-3.5 h-3.5" />, label: 'N/A',     selColor: '#6b7280', selBg: '#6b728020' },
  };
  const cfg = configs[value as string];
  if (!cfg) return null;
  return (
    <button
      onClick={onClick}
      style={selected ? { color: cfg.selColor, background: cfg.selBg, borderColor: cfg.selColor } : {}}
      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
        selected ? 'shadow-sm' : 'border-border-main text-text-3 hover:border-text-2 hover:text-text-1 bg-bg-2'
      }`}
    >
      {cfg.icon}
      {cfg.label}
    </button>
  );
}

// ─── Section Panel ──────────────────────────────────────────────────────────
function SectionPanel({
  section,
  answers,
  onChange,
  expanded,
  onToggle,
}: {
  section: Section;
  answers: Record<string, Answer>;
  onChange: (id: string, val: Answer) => void;
  expanded: boolean;
  onToggle: () => void;
  key?: React.Key;
}) {
  const answered = section.questions.filter(q => answers[q.id] && answers[q.id] !== '').length;
  const total = section.questions.length;
  const pct = Math.round((answered / total) * 100);

  return (
    <div className="border border-border-main rounded-2xl overflow-hidden bg-bg-1 shadow-sm">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-bg-2 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
               style={{ background: section.color }}>
            {section.id}
          </div>
          <div>
            <div className="font-semibold text-text-1 text-sm">{section.title}</div>
            <div className="text-text-3 text-xs mt-0.5">{answered}/{total} answered</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="w-28 h-1.5 bg-bg-3 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                   style={{ width: `${pct}%`, background: section.color }} />
            </div>
            <span className="text-xs text-text-3">{pct}%</span>
          </div>
          {expanded ? <ChevronDown className="w-4 h-4 text-text-3" /> : <ChevronRight className="w-4 h-4 text-text-3" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-main divide-y divide-border-main">
              {section.questions.map((q, idx) => {
                const ans = answers[q.id] ?? '';
                return (
                  <div key={q.id} className={`px-5 py-3.5 flex items-start gap-4 ${ans === '' ? '' : 'bg-bg-2/30'}`}>
                    <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                         style={{ background: `${section.color}cc` }}>
                      {idx + 1}
                    </div>
                    <p className="flex-1 text-sm text-text-2 leading-relaxed pt-0.5">{q.text}</p>
                    <div className="flex-shrink-0 flex items-center gap-1.5 flex-wrap justify-end">
                      {(['YES', 'PARTIAL', 'NO', 'N/A'] as Answer[]).map(v => (
                        <AnswerButton
                          key={v}
                          value={v}
                          selected={ans === v}
                          onClick={() => onChange(q.id, ans === v ? '' : v)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Score Card ─────────────────────────────────────────────────────────────
function ScoreCard({ answers }: { answers: Record<string, Answer> }) {
  const { total, max } = calcScore(answers);
  const pct = max > 0 ? Math.round((total / max) * 100) : 0;
  const result = getResult(pct);

  // Per-section scores
  const sectionScores = SECTIONS.map(s => {
    let t = 0, m = 0;
    for (const q of s.questions) {
      const a = answers[q.id] ?? '';
      if (a !== 'N/A') { t += SCORE_MAP[a]; m += 2; }
    }
    return { id: s.id, color: s.color, t, m, pct: m > 0 ? Math.round((t / m) * 100) : 0 };
  });

  return (
    <div className="bg-bg-1 border border-border-main rounded-2xl p-5 space-y-5 sticky top-4">
      <h3 className="font-bold text-text-1 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-accent" /> Score Summary
      </h3>

      {/* Total big display */}
      <div className="text-center py-3">
        <div className="text-5xl font-black text-text-1">{pct}<span className="text-2xl text-text-3">%</span></div>
        <div className="text-sm text-text-3 mt-1">{total} / {max} points</div>
        <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold"
             style={{ color: result.color, background: result.bg }}>
          {result.label === 'SELECTED' && <Award className="w-3.5 h-3.5" />}
          {result.label === 'ON-PROGRESS' && <Clock className="w-3.5 h-3.5" />}
          {result.label === 'REJECTED' && <AlertTriangle className="w-3.5 h-3.5" />}
          {result.label}
        </div>
      </div>

      {/* Ring */}
      <div className="flex justify-center">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-bg-3)" strokeWidth="10" />
          <circle cx="50" cy="50" r="40" fill="none"
            stroke={result.color}
            strokeWidth="10"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
      </div>

      {/* Section breakdown */}
      <div className="space-y-2">
        {sectionScores.map(ss => (
          <div key={ss.id} className="flex items-center gap-2">
            <div className="w-5 h-5 rounded text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
                 style={{ background: ss.color }}>
              {ss.id}
            </div>
            <div className="flex-1">
              <div className="h-2 bg-bg-3 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                     style={{ width: `${ss.pct}%`, background: ss.color }} />
              </div>
            </div>
            <span className="text-xs text-text-3 w-8 text-right">{ss.pct}%</span>
          </div>
        ))}
      </div>

      {/* Scale legend */}
      <div className="border-t border-border-main pt-4 space-y-1.5 text-xs text-text-3">
        <div className="font-semibold text-text-2 mb-2">Scoring Scale</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" /> YES = 2 pts</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" /> PARTIAL = 1 pt</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" /> NO = 0 pts</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0" /> N/A = excluded</div>
        <div className="border-t border-border-main pt-2 space-y-1 mt-2">
          <div className="flex items-center gap-2"><span className="text-emerald-500 font-bold">▶ &gt;80%</span> SELECTED</div>
          <div className="flex items-center gap-2"><span className="text-amber-500 font-bold">▶ 60–80%</span> ON-PROGRESS</div>
          <div className="flex items-center gap-2"><span className="text-red-500 font-bold">▶ ≤60%</span> REJECTED</div>
        </div>
      </div>
    </div>
  );
}

// ─── New Evaluation Form ────────────────────────────────────────────────────
function NewEvaluationForm({ onSave, onCancel }: { onSave: (r: EvaluationRecord) => void; onCancel: () => void }) {
  const [supplierName, setSupplierName] = useState('');
  const [evaluatorName, setEvaluatorName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ A: true, B: false, C: false, D: false });

  const handleAnswer = useCallback((id: string, val: Answer) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  }, []);

  const toggleSection = useCallback((id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const totalAnswered = useMemo(() =>
    SECTIONS.reduce((acc, s) => acc + s.questions.filter(q => answers[q.id] && answers[q.id] !== '').length, 0),
    [answers]
  );
  const totalQuestions = SECTIONS.reduce((acc, s) => acc + s.questions.length, 0);

  const { total, max } = calcScore(answers);
  const pct = max > 0 ? Math.round((total / max) * 100) : 0;
  const resultInfo = getResult(pct);

  const handleSave = () => {
    if (!supplierName.trim()) { alert('Please enter supplier name.'); return; }
    if (!evaluatorName.trim()) { alert('Please enter evaluator name.'); return; }
    const record: EvaluationRecord = {
      id: `EVAL-${Date.now()}`,
      supplierName: supplierName.trim(),
      evaluatorName: evaluatorName.trim(),
      date,
      answers,
      totalScore: total,
      maxScore: max,
      percentage: pct,
      result: resultInfo.label as any,
      createdAt: new Date().toISOString(),
    };
    onSave(record);
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={onCancel} className="flex items-center gap-2 text-sm text-text-3 hover:text-text-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Records
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-3">{totalAnswered}/{totalQuestions} answered</span>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-md">
            <Save className="w-4 h-4" /> Save Evaluation
          </button>
        </div>
      </div>

      {/* Meta fields */}
      <div className="bg-bg-1 border border-border-main rounded-2xl p-5">
        <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" /> Evaluation Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-2 mb-1.5">Supplier / Sub-Supplier Name *</label>
            <input
              type="text"
              value={supplierName}
              onChange={e => setSupplierName(e.target.value)}
              placeholder="e.g. Anika Transport Agency"
              className="w-full px-3 py-2 rounded-xl border border-border-main bg-bg-2 text-sm text-text-1 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-2 mb-1.5">Evaluator Name *</label>
            <input
              type="text"
              value={evaluatorName}
              onChange={e => setEvaluatorName(e.target.value)}
              placeholder="Name of evaluator"
              className="w-full px-3 py-2 rounded-xl border border-border-main bg-bg-2 text-sm text-text-1 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-2 mb-1.5">Evaluation Date *</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border-main bg-bg-2 text-sm text-text-1 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
        {/* Questions */}
        <div className="space-y-3">
          {SECTIONS.map(s => (
            <SectionPanel
              key={s.id}
              section={s}
              answers={answers}
              onChange={handleAnswer}
              expanded={!!expanded[s.id]}
              onToggle={() => toggleSection(s.id)}
            />
          ))}
        </div>
        {/* Score sidebar */}
        <div>
          <ScoreCard answers={answers} />
        </div>
      </div>
    </div>
  );
}

// ─── Record Detail View ─────────────────────────────────────────────────────
function RecordDetail({ record, onBack }: { record: EvaluationRecord; onBack: () => void }) {
  const resultInfo = getResult(record.percentage);

  const handleExportPDF = async () => {
    const {
      createDoc, drawPdfHeader, drawInfoGrid, drawSectionLabel,
      proTable, addPageFooters, drawSignatureRow
    } = await import('../utils/pdfExport');

    // Landscape – 150 questions need width
    const doc = createDoc({ orientation: 'l', paperSize: 'a4' });
    let y = drawPdfHeader(doc, 'Sub-Supplier Evaluation Report', `Record ID: ${record.id}`);

    y = drawInfoGrid(doc, y, [
      { label: 'Supplier / Sub-Supplier', value: record.supplierName },
      { label: 'Evaluated By',            value: record.evaluatorName },
      { label: 'Evaluation Date',         value: record.date },
      { label: 'Total Score',             value: `${record.totalScore} / ${record.maxScore}` },
      { label: 'Percentage',              value: `${record.percentage}%` },
      { label: 'Final Result',            value: record.result },
    ]);

    // Per-section table
    for (const section of SECTIONS) {
      y = drawSectionLabel(doc, y, section.title);
      y = proTable(
        doc, y,
        [['#', 'Evaluation Criteria', 'Response']],
        section.questions.map((q, idx) => [
          String(idx + 1),
          q.text,
          record.answers[q.id] || 'Not Answered',
        ]),
        {
          columnStyles: {
            0: { cellWidth: 14, halign: 'center' },
            2: { cellWidth: 38, halign: 'center', fontStyle: 'bold' },
          },
        }
      ) + 6;
    }

    // Score summary table
    const sectionSummary = SECTIONS.map(s => {
      let t = 0, m = 0;
      for (const q of s.questions) {
        const a = record.answers[q.id] ?? '';
        if (a !== 'N/A') { t += SCORE_MAP[a as Answer] ?? 0; m += 2; }
      }
      const pct = m > 0 ? Math.round((t / m) * 100) : 0;
      return [s.title, String(t), String(m), `${pct}%`,
        pct > 80 ? 'SELECTED' : pct > 60 ? 'ON-PROGRESS' : 'REJECTED'];
    });

    y = drawSectionLabel(doc, y, 'Section Score Summary');
    y = proTable(doc, y,
      [['Section', 'Score', 'Max', '%', 'Status']],
      sectionSummary,
      {
        columnStyles: {
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center', fontStyle: 'bold' },
          4: { halign: 'center', fontStyle: 'bold' },
        },
        foot: [['TOTAL', String(record.totalScore), String(record.maxScore), `${record.percentage}%`, record.result]],
      }
    ) + 6;

    drawSignatureRow(doc, y, ['Evaluator', 'QA Manager', 'Procurement Head', 'Authorized By']);

    addPageFooters(doc);
    doc.save(`Evaluation_${record.supplierName.replace(/\s+/g, '_')}_${record.date}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-text-3 hover:text-text-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Records
        </button>
        <button onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 border border-border-main bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Export as PDF
        </button>
      </div>

      {/* Header card */}
      <div className="bg-bg-1 border border-border-main rounded-2xl p-6 flex flex-wrap gap-6 items-center justify-between shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div>
          <h2 className="text-xl font-bold text-text-1">{record.supplierName}</h2>
          <p className="text-text-3 text-sm mt-1">Evaluated by: <span className="font-medium text-text-2">{record.evaluatorName}</span> · {record.date}</p>
          <p className="text-text-3 text-xs mt-0.5">Record ID: {record.id}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-black text-text-1">{record.percentage}%</div>
            <div className="text-xs font-medium text-text-3 mt-1">{record.totalScore} / {record.maxScore} pts</div>
          </div>
          <div className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 border shadow-sm"
               style={{ color: resultInfo.color, background: resultInfo.bg, borderColor: `${resultInfo.color}30` }}>
            {record.result === 'SELECTED' && <Award className="w-4 h-4" />}
            {record.result === 'ON-PROGRESS' && <Clock className="w-4 h-4" />}
            {record.result === 'REJECTED' && <AlertTriangle className="w-4 h-4" />}
            {record.result}
          </div>
        </div>
      </div>

      {/* Flat Question Board */}
      <div className="bg-bg-1 border border-border-main rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-main bg-bg-2">
          <h3 className="font-bold text-text-1 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-accent" /> Evaluation Board
          </h3>
        </div>
        
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-bg-2 border-b border-border-main text-text-2 font-semibold">
                <th className="px-6 py-3 w-16 text-center">#</th>
                <th className="px-6 py-3 w-full min-w-[300px]">Criteria</th>
                <th className="px-6 py-3 w-32 text-center">Result</th>
              </tr>
            </thead>
            <tbody>
              {SECTIONS.map(s => (
                <React.Fragment key={s.id}>
                  <tr className="bg-bg-2/50 border-b border-border-main">
                    <td colSpan={3} className="px-6 py-3 font-bold text-text-1" style={{ color: s.color }}>
                      {s.title}
                    </td>
                  </tr>
                  {s.questions.map((q, idx) => {
                    const ans = record.answers[q.id];
                    let ansClass = "bg-bg-3 text-text-2";
                    if (ans === 'YES') ansClass = "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
                    if (ans === 'PARTIAL') ansClass = "bg-amber-500/10 text-amber-600 border border-amber-500/20";
                    if (ans === 'NO') ansClass = "bg-red-500/10 text-red-600 border border-red-500/20";
                    
                    return (
                      <tr key={q.id} className="border-b border-border-main hover:bg-bg-2/30 transition-colors">
                        <td className="px-6 py-4 text-center text-text-3 font-medium">{idx + 1}</td>
                        <td className="px-6 py-4 text-text-2 whitespace-normal leading-relaxed">{q.text}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${ansClass}`}>
                            {ans || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Records List ───────────────────────────────────────────────────────────
function RecordsList({
  records,
  onNew,
  onView,
  onDelete,
}: {
  records: EvaluationRecord[];
  onNew: () => void;
  onView: (r: EvaluationRecord) => void;
  onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = records.filter(r =>
    r.supplierName.toLowerCase().includes(search.toLowerCase()) ||
    r.evaluatorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by supplier or evaluator..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border-main bg-bg-2 text-sm text-text-1 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
        <button onClick={onNew}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-md flex-shrink-0">
          <Plus className="w-4 h-4" /> New Evaluation
        </button>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-text-3">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-text-2">No evaluation records yet</p>
          <p className="text-sm mt-1">Click "New Evaluation" to start a supplier assessment.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(r => {
            const ri = getResult(r.percentage);
            return (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-bg-1 border border-border-main rounded-2xl p-4 flex flex-wrap items-center gap-4 hover:border-accent/40 transition-colors group"
              >
                {/* Result indicator */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ background: ri.bg }}>
                  {r.result === 'SELECTED'    && <Award className="w-5 h-5" style={{ color: ri.color }} />}
                  {r.result === 'ON-PROGRESS' && <Clock className="w-5 h-5" style={{ color: ri.color }} />}
                  {r.result === 'REJECTED'    && <AlertTriangle className="w-5 h-5" style={{ color: ri.color }} />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text-1 truncate">{r.supplierName}</div>
                  <div className="text-xs text-text-3 mt-0.5">By {r.evaluatorName} · {r.date} · {r.id}</div>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-black" style={{ color: ri.color }}>{r.percentage}%</div>
                  <div className="text-xs"
                       style={{ color: ri.color, background: ri.bg, padding: '1px 8px', borderRadius: 9999, display: 'inline-block', fontWeight: 700 }}>
                    {r.result}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => onView(r)}
                    className="p-2 rounded-lg hover:bg-bg-3 text-text-3 hover:text-accent transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(r.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-text-3 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Export ────────────────────────────────────────────────────────────
type View = 'list' | 'new' | 'detail';

export function SubSupplierEvaluation() {
  const [view, setView] = useState<View>('list');
  const [records, setRecords] = useState<EvaluationRecord[]>(() => {
    const saved = localStorage.getItem('garmentqms_sub_evals');
    if (saved) return JSON.parse(saved);
    return [{
      id: 'EVAL-MOCK-001',
      supplierName: 'Global Thread Dyeing Ltd',
      evaluatorName: 'Fahim Ahmed',
      date: new Date().toISOString().split('T')[0],
      answers: { A1: 'YES', A2: 'YES', B1: 'YES', B2: 'YES', C1: 'YES', D1: 'PARTIAL' },
      totalScore: 10,
      maxScore: 12,
      percentage: 83,
      result: 'SELECTED',
      createdAt: new Date().toISOString()
    }];
  });
  const [selected, setSelected] = useState<EvaluationRecord | null>(null);

  useEffect(() => {
    localStorage.setItem('garmentqms_sub_evals', JSON.stringify(records));
  }, [records]);

  const handleSave = (r: EvaluationRecord) => {
    setRecords(prev => [r, ...prev]);
    setView('list');
  };

  const handleView = (r: EvaluationRecord) => {
    setSelected(r);
    setView('detail');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this evaluation record?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="p-5 md:p-6">
      {view === 'list' && (
        <RecordsList
          records={records}
          onNew={() => setView('new')}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}
      {view === 'new' && (
        <NewEvaluationForm
          onSave={handleSave}
          onCancel={() => setView('list')}
        />
      )}
      {view === 'detail' && selected && (
        <RecordDetail
          record={selected}
          onBack={() => { setSelected(null); setView('list'); }}
        />
      )}
    </div>
  );
}
