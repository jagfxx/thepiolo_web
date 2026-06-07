"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Section } from "@/components/ui/Section";
import { useLanguage } from "@/lib/i18n/context";
import { getLeadWhatsAppUrl } from "@/lib/leads";
import { fadeUp, staggerContainer } from "@/lib/motion";
import type { Dictionary, PlanId, PlanSpecRow } from "@/lib/i18n/types";

type PlanItem = Dictionary["plans"]["items"][number];

function SpecCell({ value, checkmark }: { value: string; checkmark: string }) {
  if (value === checkmark) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-accent-soft text-xs text-gradient">
        {checkmark}
      </span>
    );
  }

  if (value === "—") {
    return <span className="text-muted">{value}</span>;
  }

  return <span className="text-foreground-subtle">{value}</span>;
}

function formatPrice(
  planId: PlanId,
  price: string,
  priceFrom: string,
  customPrice: string,
) {
  if (planId === "custom") return customPrice;
  return `${priceFrom} ${price}`;
}

function getSpecValue(row: PlanSpecRow, planId: PlanId) {
  if (planId === "foundation") return row.foundation;
  if (planId === "business") return row.business;
  return row.custom;
}

function getPlanFeatures(
  planId: PlanId,
  specRows: PlanSpecRow[],
  checkmark: string,
): { label: string; value: string }[] {
  return specRows
    .map((row) => {
      const value = getSpecValue(row, planId);
      if (value === "—") return null;
      return { label: row.label, value };
    })
    .filter((item): item is { label: string; value: string } => item !== null);
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

type PlanFeaturesPanelProps = {
  plan: PlanItem | null;
  open: boolean;
  onClose: () => void;
  onCompare: () => void;
  plans: Dictionary["plans"];
  whatsappUrl: string;
};

function useIsMobilePanel() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function PlanFeaturesPanel({
  plan,
  open,
  onClose,
  onCompare,
  plans,
  whatsappUrl,
}: PlanFeaturesPanelProps) {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobilePanel();
  const features = useMemo(
    () => (plan ? getPlanFeatures(plan.id, plans.specRows, plans.checkmark) : []),
    [plan, plans.specRows, plans.checkmark],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const panelMotion = isMobile
    ? {
        initial: { opacity: 0, y: "100%" },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "100%" },
      }
    : {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
      };

  return createPortal(
    <AnimatePresence>
      {open && plan && (
        <div
          className={`fixed inset-0 z-[100] ${
            isMobile ? "flex flex-col" : "flex items-center justify-center p-5"
          }`}
        >
          <motion.button
            type="button"
            aria-label={plans.closeFeatures}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-features-title"
            {...panelMotion}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-[1] flex max-h-[88dvh] flex-col border border-border bg-[#222233] shadow-2xl ${
              isMobile
                ? "mt-auto w-full rounded-t-3xl"
                : "w-full max-w-lg max-h-[85vh] rounded-2xl"
            }`}
          >
            <div className="flex shrink-0 items-center justify-center pt-3 md:hidden">
              <span className="h-1 w-10 rounded-full bg-border" aria-hidden />
            </div>

            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border/60 px-5 py-4 sm:px-6">
              <div>
                <p className="font-mono text-xs text-gradient">{plan.step}</p>
                <h3
                  id="plan-features-title"
                  className="mt-0.5 font-display text-xl font-medium text-foreground"
                >
                  {plan.title}
                </h3>
                <p className="mt-1 font-mono text-sm text-muted">
                  {formatPrice(plan.id, plan.price, plans.priceFrom, plans.customPrice)}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={plans.closeFeatures}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-border-hover hover:text-foreground"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                {plans.featuresIncluded}
              </p>
              <ul className="mt-4 space-y-3">
                {features.map((feature) => (
                  <li
                    key={feature.label}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <span className="text-foreground-subtle">{feature.label}</span>
                    {feature.value === plans.checkmark ? (
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-accent-soft text-xs text-gradient">
                        {plans.checkmark}
                      </span>
                    ) : (
                      <span className="shrink-0 text-right font-mono text-xs text-muted">
                        {feature.value}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {plan.examples && plan.examplesLabel && (
                <div className="mt-6 border-t border-border/60 pt-6">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    {plan.examplesLabel}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {plan.examples.map((example) => (
                      <li
                        key={example}
                        className="flex items-start gap-2 text-sm text-foreground-subtle"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gradient-accent" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex shrink-0 flex-col gap-3 border-t border-border/60 px-5 py-4 sm:flex-row sm:px-6">
              <button
                type="button"
                onClick={onCompare}
                className="glass flex-1 rounded-full px-5 py-3 text-sm font-medium text-foreground transition-all hover:border-border-hover hover:bg-surface"
              >
                {plans.compareAll}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className={`flex-1 rounded-full px-5 py-3 text-center text-sm font-medium transition-all ${
                  plan.highlighted
                    ? "bg-gradient-accent text-white glow-accent hover:brightness-110"
                    : "bg-gradient-accent text-white hover:brightness-110"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function Plans() {
  const { dict } = useLanguage();
  const p = dict.plans;
  const [activePlanId, setActivePlanId] = useState<PlanId | null>(null);

  const activePlan = useMemo(
    () => p.items.find((plan) => plan.id === activePlanId) ?? null,
    [activePlanId, p.items],
  );

  const openFeatures = useCallback((planId: PlanId) => {
    setActivePlanId(planId);
  }, []);

  const closeFeatures = useCallback(() => {
    setActivePlanId(null);
  }, []);

  const scrollToCompare = useCallback(() => {
    closeFeatures();
    window.setTimeout(() => {
      document.getElementById("plans-compare")?.scrollIntoView({ behavior: "smooth" });
    }, 280);
  }, [closeFeatures]);

  return (
    <>
      <Section
        id="plans"
        label={p.label}
        title={p.title}
        description={p.description}
        className="border-t border-border/50"
      >
        <p className="-mt-8 mb-10 font-mono text-xs uppercase tracking-[0.2em] text-muted sm:-mt-12 sm:mb-14">
          {p.ladderLabel}
        </p>

        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative space-y-0"
        >
          <div
            aria-hidden
            className="absolute left-[1.15rem] top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-[#b440ff]/40 via-[#ff71e4]/30 to-transparent lg:left-1/2 lg:block lg:-translate-x-px"
          />

          {p.items.map((plan, i) => (
            <motion.li
              key={plan.id}
              variants={fadeUp}
              custom={i}
              className={`relative flex flex-col gap-6 pb-12 lg:flex-row lg:items-stretch lg:gap-16 lg:pb-16 ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="flex flex-1 items-start gap-5 lg:justify-end">
                {i % 2 === 0 && <div className="hidden flex-1 lg:block" aria-hidden />}
                <div
                  className={`flex flex-1 flex-col ${
                    i % 2 === 1 ? "lg:items-start lg:text-left" : "lg:items-end lg:text-right"
                  }`}
                >
                  <article
                    className={`w-full max-w-md rounded-2xl p-6 sm:p-7 ${
                      plan.highlighted
                        ? "border-gradient glow-accent"
                        : "border border-border bg-surface"
                    } ${activePlanId === plan.id ? "ring-1 ring-[#b440ff]/40" : ""}`}
                  >
                    <span className="font-mono text-sm text-gradient">{plan.step}</span>
                    <h3 className="mt-1 font-display text-xl font-medium text-foreground sm:text-2xl">
                      {plan.title}
                    </h3>
                    <p className="mt-2 font-mono text-sm text-muted">
                      {formatPrice(plan.id, plan.price, p.priceFrom, p.customPrice)}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-foreground-subtle">
                      {plan.tagline}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{plan.audience}</p>

                    <div
                      className={`mt-6 flex flex-col gap-3 ${
                        i % 2 === 1 ? "lg:items-start" : "lg:items-end"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => openFeatures(plan.id)}
                        aria-expanded={activePlanId === plan.id}
                        className="w-full rounded-full border border-border bg-surface-elevated/60 px-5 py-3 text-sm font-medium text-foreground transition-all hover:border-border-hover hover:bg-surface-elevated sm:w-auto"
                      >
                        {p.viewFeatures}
                      </button>
                      <a
                        href={getLeadWhatsAppUrl(dict.leads.messages, plan.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full rounded-full px-5 py-3 text-center text-sm font-medium transition-all sm:w-auto ${
                          plan.highlighted
                            ? "bg-gradient-accent text-white glow-accent hover:brightness-110"
                            : "glass text-foreground hover:border-border-hover hover:bg-surface-elevated"
                        }`}
                      >
                        {plan.cta}
                      </a>
                    </div>
                  </article>
                </div>
              </div>

              <div
                className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated lg:absolute lg:left-1/2 lg:-translate-x-1/2"
                aria-hidden
              >
                <span className="h-2 w-2 rounded-full bg-gradient-accent" />
              </div>

              <div className="hidden flex-1 lg:block" aria-hidden />
            </motion.li>
          ))}
        </motion.ol>

        <div id="plans-compare" className="mt-8 scroll-mt-28 sm:mt-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <p className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-muted sm:mb-10">
              {p.specLabel}
            </p>

            <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th
                      scope="col"
                      className="sticky left-0 z-10 bg-surface px-5 py-4 font-mono text-[10px] uppercase tracking-wider text-muted"
                    >
                      {p.specFeatureColumn}
                    </th>
                    {p.items.map((plan) => (
                      <th
                        key={plan.id}
                        scope="col"
                        className={`px-5 py-4 transition-colors ${
                          activePlanId === plan.id
                            ? "bg-surface-elevated"
                            : plan.highlighted
                              ? "bg-surface-elevated/80"
                              : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => openFeatures(plan.id)}
                          className="group w-full text-left"
                        >
                          <span className="block font-display text-base font-medium text-foreground transition-colors group-hover:text-gradient">
                            {plan.title}
                          </span>
                          <span className="mt-1 block font-mono text-xs text-muted">
                            {formatPrice(plan.id, plan.price, p.priceFrom, p.customPrice)}
                          </span>
                          <span className="mt-2 hidden font-mono text-[10px] uppercase tracking-wider text-muted transition-colors group-hover:text-foreground-subtle sm:block">
                            {p.viewFeatures}
                          </span>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.specRows.map((row, rowIndex) => (
                    <tr
                      key={row.label}
                      className={
                        rowIndex < p.specRows.length - 1 ? "border-b border-border/60" : ""
                      }
                    >
                      <th
                        scope="row"
                        className="sticky left-0 z-10 bg-surface px-5 py-3.5 text-left font-normal text-foreground-subtle"
                      >
                        {row.label}
                      </th>
                      {(["foundation", "business", "custom"] as const).map((planId) => (
                        <td
                          key={planId}
                          className={`px-5 py-3.5 transition-colors ${
                            activePlanId === planId
                              ? "bg-surface-elevated/70"
                              : planId === "business" && p.items[1].highlighted
                                ? "bg-surface-elevated/40"
                                : ""
                          }`}
                        >
                          <SpecCell
                            value={getSpecValue(row, planId)}
                            checkmark={p.checkmark}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </Section>

      <PlanFeaturesPanel
        plan={activePlan}
        open={activePlanId !== null}
        onClose={closeFeatures}
        onCompare={scrollToCompare}
        plans={p}
        whatsappUrl={
          activePlan
            ? getLeadWhatsAppUrl(dict.leads.messages, activePlan.id)
            : getLeadWhatsAppUrl(dict.leads.messages, "general")
        }
      />
    </>
  );
}
