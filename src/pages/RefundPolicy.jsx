import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-black uppercase tracking-widest text-lavender mb-4 border-b border-white/10 pb-3">{title}</h2>
    <div className="text-ivory/70 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const RefundPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12 px-4"
    >
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-lavender-gradient mb-3">Refund Policy</h1>
        <p className="text-ivory/50 text-sm">Last Updated: March 2026</p>
      </div>

      <div className="glass-card p-8 md:p-12">
        <Section title="1. Our Commitment">
          <p>At Delectable & Svelt Designs, every garment is crafted with extraordinary care. We stand behind the quality of our work. This policy outlines the circumstances under which refunds or revisions are applicable.</p>
        </Section>

        <Section title="2. Alteration Services">
          <p><span className="text-ivory font-bold">Revisions:</span> If you are not satisfied with an alteration, we offer <strong className="text-ivory">one free revision</strong> per booking, provided the revision request is made within <strong className="text-ivory">7 days</strong> of receiving your garment.</p>
          <p><span className="text-ivory font-bold">Refunds:</span> Refunds for alteration services are only applicable if:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>The alteration was not completed as described at the time of booking.</li>
            <li>The garment was damaged during the alteration process.</li>
          </ul>
          <p>Refund requests must be made within <strong className="text-ivory">14 days</strong> of delivery with photographic evidence.</p>
        </Section>

        <Section title="3. Ready-to-Wear / Gallery Purchases">
          <p>Due to the bespoke and made-to-order nature of our designs, <strong className="text-ivory">all Gallery sales are final</strong> once production has commenced.</p>
          <p>A refund or exchange may be considered if:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>The item delivered significantly differs from what was described or shown.</li>
            <li>The garment arrives with a manufacturing defect.</li>
          </ul>
        </Section>

        <Section title="4. Non-Refundable Items">
          <p>The following are not eligible for a refund:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Deposits already applied to production</li>
            <li>Completed custom designs crafted to specific measurements provided by the client</li>
            <li>Change-of-mind requests after production has begun</li>
          </ul>
        </Section>

        <Section title="5. How to Request a Refund">
          <p>To initiate a refund or revision request, please contact us:</p>
          <p>📧 <a href="mailto:delectablesvelt@gmail.com" className="text-neon_cyan hover:underline">delectablesvelt@gmail.com</a></p>
          <p>Please include your booking reference, photos, and a description of the issue. We aim to respond within <strong className="text-ivory">2–3 business days</strong>.</p>
        </Section>
      </div>
    </motion.div>
  );
};

export default RefundPolicy;
