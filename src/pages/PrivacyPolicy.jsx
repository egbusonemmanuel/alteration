import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-black uppercase tracking-widest text-lavender mb-4 border-b border-white/10 pb-3">{title}</h2>
    <div className="text-ivory/70 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12 px-4"
    >
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-lavender-gradient mb-3">Privacy Policy</h1>
        <p className="text-ivory/50 text-sm">Last Updated: March 2026</p>
      </div>

      <div className="glass-card p-8 md:p-12">
        <Section title="1. Who We Are">
          <p>Delectable & Svelt Designs ("DSD", "we", "our") is a bespoke fashion and alteration atelier. We are committed to protecting your personal information and your right to privacy.</p>
          <p>For any questions regarding this policy, contact us at: <a href="mailto:delectablesvelt@gmail.com" className="text-neon_cyan hover:underline">delectablesvelt@gmail.com</a></p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect information you voluntarily provide to us when you:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Create an account or sign in via our platform</li>
            <li>Make a booking or place a garment alteration request</li>
            <li>Upload garment images or measurement data</li>
            <li>Upload proof of payment receipts</li>
            <li>Contact us directly via email</li>
          </ul>
          <p>This may include your name, email address, body measurements, and garment photos.</p>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Process and manage your bookings and alteration requests</li>
            <li>Communicate with you regarding your orders</li>
            <li>Improve our services and the functionality of this platform</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>We do not sell, rent, or trade your personal information to third parties.</p>
        </Section>

        <Section title="4. Data Storage & Security">
          <p>Your data is securely stored on Supabase infrastructure with industry-standard encryption. Garment images and receipts are stored in secure cloud storage. We implement appropriate technical safeguards to protect your data.</p>
        </Section>

        <Section title="5. Your Rights">
          <p>You have the right to access, correct, or request deletion of your personal data at any time. To exercise any of these rights, please contact us at <a href="mailto:delectablesvelt@gmail.com" className="text-neon_cyan hover:underline">delectablesvelt@gmail.com</a>.</p>
        </Section>

        <Section title="6. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of our platform constitutes your acceptance of any changes.</p>
        </Section>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
