import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="text-xl font-black uppercase tracking-widest text-lavender mb-4 border-b border-white/10 pb-3">{title}</h2>
    <div className="text-ivory/70 text-sm leading-relaxed space-y-3">{children}</div>
  </div>
);

const Terms = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-12 px-4"
    >
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-lavender-gradient mb-3">Terms & Conditions</h1>
        <p className="text-ivory/50 text-sm">Last Updated: March 2026</p>
      </div>

      <div className="glass-card p-8 md:p-12">
        <Section title="1. Acceptance of Terms">
          <p>By accessing or using the Delectable & Svelt Designs website and its services ("Platform"), you agree to be legally bound by these Terms and Conditions. If you do not agree, please do not use our Platform.</p>
        </Section>

        <Section title="2. Services Offered">
          <p>Delectable & Svelt Designs provides the following services through this Platform:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong className="text-ivory">Gallery (Shop)</strong>: Bespoke, made-to-order fashion designs available for direct booking and purchase.</li>
            <li><strong className="text-ivory">Virtual Closet (Alterations)</strong>: A garment alteration and tailoring booking service where clients can upload garments for professional modification.</li>
          </ul>
        </Section>

        <Section title="3. Bookings & Orders">
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>All bookings are confirmed only upon receipt of proof of payment sent to the atelier.</li>
            <li>Prices, timelines, and availability are subject to change without prior notice.</li>
            <li>Custom orders cannot be cancelled once production has commenced.</li>
            <li>DSD reserves the right to decline any order at its sole discretion.</li>
          </ul>
        </Section>

        <Section title="4. Payments">
          <p>All payments are made via direct bank transfer to the official account:</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 my-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-ivory/40 text-xs uppercase tracking-widest font-bold">Account Name</span><span className="font-bold text-ivory">Awolaja Ruth</span></div>
            <div className="flex justify-between"><span className="text-ivory/40 text-xs uppercase tracking-widest font-bold">Bank</span><span className="font-bold text-ivory">First Bank of Nigeria</span></div>
            <div className="flex justify-between"><span className="text-ivory/40 text-xs uppercase tracking-widest font-bold">Account No.</span><span className="font-black text-lavender tracking-widest">3174920002</span></div>
          </div>
          <p>DSD is not responsible for payments made to any other account not listed above.</p>
        </Section>

        <Section title="5. Intellectual Property">
          <p>All designs, photographs, images, and content displayed on this Platform are the exclusive intellectual property of Delectable & Svelt Designs. Reproduction, distribution, or use of any content without express written consent is strictly prohibited.</p>
        </Section>

        <Section title="6. User Responsibilities">
          <p>You agree to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Provide accurate measurements and booking information.</li>
            <li>Upload only garment images and receipts you own or have rights to.</li>
            <li>Not misuse the Platform in any way that could damage or disrupt its services.</li>
          </ul>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>Delectable & Svelt Designs shall not be liable for any indirect, incidental, or consequential damages arising from the use of this Platform or its services. Our maximum liability is limited to the value of the specific order in question.</p>
        </Section>

        <Section title="8. Governing Law">
          <p>These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising shall be subject to the exclusive jurisdiction of Nigerian courts.</p>
        </Section>

        <Section title="9. Contact">
          <p>For questions about these Terms, please contact us:</p>
          <p>📧 <a href="mailto:delectablesvelt@gmail.com" className="text-neon_cyan hover:underline">delectablesvelt@gmail.com</a></p>
          <p>📞 <a href="tel:+2348020547860" className="text-neon_cyan hover:underline">0802 054 7860</a></p>
        </Section>
      </div>
    </motion.div>
  );
};

export default Terms;
