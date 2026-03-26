import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-black uppercase tracking-widest text-lavender mb-4 border-b border-white/10 pb-3">{title}</h2>
    <div className="text-ivory/70 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const Note = ({ children }) => (
  <p className="bg-lavender/10 border border-lavender/30 rounded-lg px-4 py-3 text-lavender/90 text-xs font-semibold uppercase tracking-wide">
    ⚠ {children}
  </p>
);

const RefundPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12 px-4"
    >
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-lavender-gradient mb-3">Return &amp; Refund Policy</h1>
        <p className="text-ivory/50 text-sm">Last Updated: March 2026</p>
      </div>

      <div className="glass-card p-8 md:p-12">

        {/* Intro */}
        <div className="mb-10">
          <p className="text-ivory/80 text-base leading-relaxed">
            At <span className="text-lavender font-bold">Delectable &amp; Svelt Designs</span>, your satisfaction is our top priority. If you are not completely happy with your purchase, we are here to help.
          </p>
        </div>

        {/* 1. RTW Amendments */}
        <Section title="1. Ready-to-Wear Amendments">
          <p>
            We offer amendment services to RTW items <span className="text-ivory font-semibold">by agreement and at an agreed price</span>. Please ensure you select the size closest to your measurements using the size chart provided when placing your order.
          </p>
          <Note>Please use the size chart. We do not exchange for wrong sizes picked.</Note>
        </Section>

        {/* 2. Exchange Policy */}
        <Section title="2. Exchange Policy">
          <p>Items are subject to exchange if returned within:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><span className="text-ivory font-semibold">3 business days</span> after delivery — within Lagos</li>
            <li><span className="text-ivory font-semibold">5 business days</span> after delivery — outside Lagos but within Nigeria</li>
            <li><span className="text-ivory font-semibold">10 business days</span> after delivery — outside Nigeria</li>
          </ul>
          <p className="mt-2">To be eligible for an exchange, items must be:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Unworn, unwashed, and in original condition</li>
            <li>With all tags and packaging intact</li>
          </ul>
          <Note>We do not exchange for wrong sizes picked. Please use the size chart.</Note>
        </Section>

        {/* 3. Delivery Timelines */}
        <Section title="3. Delivery Timelines">
          <p>
            We <span className="text-ivory font-semibold">do not offer same-day delivery</span>. Orders placed online require at least <span className="text-ivory font-semibold">2–5 working production days</span> after payment confirmation before dispatch. This is an estimated timeframe — if there are any delays or earlier delivery possible, you will be updated promptly.
          </p>
          <Note>No refunds or exchanges for delayed deliveries. No exceptions.</Note>
        </Section>

        {/* 4. Non-Returnable Items */}
        <Section title="4. Non-Returnable Items">
          <p>The following items are non-returnable:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Sale or clearance items</li>
            <li>Personalised or custom-made items</li>
          </ul>
        </Section>

        {/* 5. Refunds */}
        <Section title="5. Refunds">
          <p>
            <span className="text-ivory font-semibold">Refunds will only be issued</span> if the item ordered is no longer available.
          </p>
          <Note>We do not issue refunds for wrong sizes picked or delayed deliveries. There will be no exceptions.</Note>
        </Section>

        {/* 6. How to Return */}
        <Section title="6. How to Return">
          <p>
            Contact our customer service team to start your return process. Please reach out before sending any item back.
          </p>
          <p>
            For a swift and seamless order process, do not hesitate to get in touch — we are always happy to assist.
          </p>
        </Section>

        {/* Contact */}
        <Section title="Contact Us">
          <p>If you have any questions about returns or refunds, reach us at:</p>
          <p>
            📧{' '}
            <a href="mailto:delectablesvelt@gmail.com" className="text-neon_cyan hover:underline">
              delectablesvelt@gmail.com
            </a>
          </p>
          <p>
            📞{' '}
            <a href="tel:+2348020547860" className="text-neon_cyan hover:underline">
              +234 802 054 7860
            </a>
          </p>
          <p>
            📞{' '}
            <a href="tel:+447949582399" className="text-neon_cyan hover:underline">
              +44 (0) 7949 582 399
            </a>
          </p>
          <p className="mt-4 text-ivory/50 italic">
            Thank you for choosing DSD. We aspire to serve you better — always.
          </p>
        </Section>

      </div>
    </motion.div>
  );
};

export default RefundPolicy;
