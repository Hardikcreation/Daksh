import React, { useRef, useEffect, useState } from "react";

const sections = [
  { id: "services", label: "1. SERVICES" },
  { id: "account", label: "2. ACCOUNT CREATION" },
  { id: "user-content", label: "3. USER CONTENT" },
  { id: "consent", label: "4. CONSENT TO USE DATA" },
  { id: "bookings", label: "5. BOOKINGS" },
  { id: "pricing", label: "6. PRICING, FEES, AND PAYMENT TERMS" },
  { id: "conduct", label: "7. CUSTOMER CONDUCT" },
  { id: "third-party", label: "8. THIRD PARTY SERVICES" },
  { id: "responsibilities", label: "9. YOUR RESPONSIBILITIES" },
  { id: "ip", label: "10. OUR INTELLECTUAL PROPERTY" },
  { id: "term", label: "11. TERM AND TERMINATION" },
  { id: "disclaimers", label: "12. DISCLAIMERS AND WARRANTIES" },
  { id: "indemnity", label: "13. INDEMNITY" },
  { id: "jurisdiction", label: "14. JURISDICTION, GOVERNING LAWS, AND DISPUTE RESOLUTION" },
  { id: "grievance", label: "15. GRIEVANCE REDRESSAL" },
  { id: "misc", label: "16. MISCELLANEOUS PROVISIONS" },
];

const sectionContent = {
  services: `1. SERVICES\n(a) (a) The Services include the provision of the Platform that enables you to arrange and schedule different home-based services with independent third-party service providers of those services (“Service Professionals”). As a part of the Services, DCK facilitates the transfer of payments to Service Professionals for the services they render to you and collects payments on behalf of such Service Professionals.

(b) The services rendered by Service Professionals are referred to as “Pro Services”. The term “Services”does not include the Pro Services. DCK does not provide the Pro Services and is not responsible their provision. Service Professionals are solely liable and responsible for the Pro Services that they offer or otherwise provide through the Platform. DCK and its affiliates do not employ Service Professionals, nor are Service Professionals agents, contractors, or partners of DCK or its affiliates. Service Professionals do not have the ability to bind or represent DCK.

(c) The Platform is for your personal and non-commercial use only, unless otherwise agreed upon on in accordance with the terms of a separate agreement. Please note that the Platform is intended for use only within India. You agree that in the event you avail the Services or Pro Services from a legal jurisdiction other than the territory of India, you will be deemed to have accepted the DCK terms and conditions applicable to that jurisdiction.

(d) The Services are made available under various brands owned by or otherwise licensed to DCK and its affiliates.

(e) A key part of the Services is DCK ability to send you text messages, electronic mails, or WhatsApp messages, including in connection with your bookings, your utilisation of the Services, or as a part of its promotional and marketing strategies. While you may opt out of receiving these text messages by contacting DCK at privacy@daksh.com or through the in-Platform settings , you agree and acknowledge that this may impact DCK ability to provide the Services (or a part of the Services) to you.

(f) In certain instances, you may be required to furnish identification proof to avail the Services or the Pro Services, and hereby agree to do so. A failure to comply with this request may result in your inability to use the Services or Pro Services.

`,
  account: `2. ACCOUNT CREATION\n(a) To avail the Services, you will be required to create an account on the Platform (“Account”). For this Account, you may be required to furnish certain details, including but not limited to your phone number. To create an Account, you must be at least 18 years of age.

(b) You warrant that all information furnished in connection with your Account is and shall remain accurate and true. You agree to promptly update your details on the Platform in the event of any change to or modification of this information.

(c) You are solely responsible for maintaining the security and confidentiality of your Account and agree to immediately notify us of any disclosure or unauthorised use of your Account or any other breach of security with respect to your Account.

(d) You are liable and accountable for all activities that take place through your Account, including activities performed by persons other than you. We shall not be liable for any unauthorised access to your Account.

(e) You agree to receive communications from us regarding (i) requests for payments, (ii) information about us and the Services, (iii) promotional offers and services from us and our third party partners, and (iv) any other matter in relation to the Services.`,

"user-content": `3. USER CONTENT
(a) Our Platform may contain interactive features or services that allow users who have created an account with us to post, upload, publish, display, transmit, or submit comments, reviews, suggestions, feedback, ideas, or other content on or through the Platform (“User Content”).

(b) As part of the effective provision of the Services and quality control purposes, we may request reviews from you about Service Professionals and you agree and acknowledge that Service Professionals may provide reviews about you to us. You must not knowingly provide false, inaccurate, or misleading information in respect of the reviews. Reviews will be used by us for quality control purposes and to determine whether Customers and Service Professionals are appropriate users of the Platform. If we determine at our sole discretion that you are not an appropriate user, we reserve the right to cancel your registration and remove you from our Platform.

(c) You grant us a non-exclusive, worldwide, perpetual, irrevocable, transferable, sublicensable, and royalty-free licence to (i) use, publish, display, store, host, transfer, process, communicate, distribute, make available, modify, adapt, translate, and create derivative works of, the User Content, for the functioning of, and in connection with, the Services and (ii) use User Content for the limited purposes of advertising and promoting the Services, or furnishing evidence before a court or authority of competent jurisdiction under applicable laws.

(d) In connection with these Terms and the licences granted under this clause, you hereby waive any claims arising out of any moral rights or other similar rights relating to the User Content.

(e) You agree and acknowledge that DCK may, without notice to you, remove, or otherwise restrict access to User Content that, in its sole discretion, violates these Terms.
`,
  consent: `4. CONSENT TO USE DATA\n(a) By using the Platform, you consent to the collection, storage, processing, and use of your personal information, including any sensitive personal data or information, as described in our Privacy Policy, which is incorporated by reference into these Terms.

(b) You agree that we may use your information to provide you with the Services, to communicate with you about your use of the Services, and for other purposes as described in our Privacy Policy.

(c) We may share your information with third-party service providers who assist us in operating our Platform, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.

(d) We may disclose your information if required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to claims, or to protect the rights, property, or safety of DCK, our users, or others.`,
  bookings: `5. BOOKINGS\n(a) To avail the Services, you must first create an Account on the Platform. Once you have an Account, you can browse and select the Service Professionals and their services.

(b) Upon selecting a Service Professional and their service, you will be required to provide certain booking details, including your location, the date and time of the service, and any specific instructions.

(c) You agree to pay the applicable fees for the Services as displayed on the Platform. Payment must be made in advance, unless otherwise agreed upon.

(d) Once payment is received, your booking will be confirmed, and the Service Professional will be notified to prepare for the service.

(e) You can cancel or modify your booking up to 24 hours before the scheduled service time. Cancellations made within 24 hours of the scheduled service time may incur a cancellation fee, which will be communicated to you at the time of booking.

(f) In the event of a cancellation by the Service Professional, you will be entitled to a full refund or a rescheduled service, depending on the terms agreed upon with the Service Professional.`,
  pricing: `6. PRICING, FEES, AND PAYMENT TERMS\n(a) The fees for the Services are detailed on the Platform. These fees are subject to change, and we will notify you of any such changes.

(b) You agree to pay all fees and charges incurred in connection with your use of the Services, including any applicable taxes.

(c) Payment for the Services must be made in advance, unless otherwise agreed upon. We accept various payment methods as specified on the Platform.

(d) In the event of a dispute regarding payment, you agree to cooperate with DCK in resolving such disputes.`,
  conduct: `7. CUSTOMER CONDUCT\n(a) You agree to use the Platform in a lawful and respectful manner. You must not engage in any activity that interferes with or disrupts the Platform or servers or networks connected to the Platform.

(b) You must not attempt to gain unauthorised access to the Platform, other accounts, computer systems, or networks connected to the Platform.

(c) You must not use the Platform to transmit any material that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.

(d) You must not use the Platform to transmit any material that infringes any intellectual property rights, including copyrights, patents, trademarks, or other proprietary rights of DCK or any third party.

(e) You must not use the Platform to transmit any material that you do not have a right to transmit under any law or under contractual or fiduciary relationships.

(f) You must not use the Platform to transmit any material that promotes or encourages illegal activity or violation of these Terms.

(g) You must not impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with any person or entity.

(h) You must not use the Platform to engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Platform, or which, as determined by us, may harm DCK or users of the Platform, or expose them to liability.`,
  "third-party": `8. THIRD PARTY SERVICES\n(a) The Platform may contain links to third-party websites or services that are not owned or controlled by DCK.

(b) DCK has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that DCK shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.

(c) We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit.`,
  responsibilities: `9. YOUR RESPONSIBILITIES\n(a) You are responsible for maintaining the confidentiality of your Account and password. You agree to accept responsibility for all activities that occur under your Account.

(b) You must not sell, license, or commercially exploit any Service Professional's content or intellectual property.

(c) You must not modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part of the Platform.

(d) You must not access or use the Platform for any commercial purposes unless otherwise agreed upon.

(e) You must not remove any copyright, trademark, or other proprietary rights notices from the Platform.

(f) You must not interfere with or disrupt the Platform or servers or networks connected to the Platform.

(g) You must not transmit any worms, viruses, or any code of a destructive nature.

(h) You must not, in the use of the Platform, violate any laws in your jurisdiction (including but not limited to copyright laws, patent laws, trademark laws, and laws of privacy and publicity).

(i) You must not use the Platform in a way that is harmful to minors.

(j) You must not use the Platform in a way that impacts user access to the Platform or that could adversely affect the performance or functionality of any computer software or hardware or telecommunications equipment.

(k) You must not use the Platform in a way that is, or may be, fraudulent, deceptive, misleading, illegal, or harmful.

(l) You must not use the Platform to send spam, chain letters, or other unsolicited messages.

(m) You must not use the Platform to send or transmit any material that infringes, violates, or advocates infringement or violation of any third-party rights.

(n) You must not use the Platform to send or transmit any material that contains software viruses, worms, or other harmful computer code, files, scripts, agents, or programs.

(o) You must not use the Platform to engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Platform, or which, as determined by us, may harm DCK or users of the Platform, or expose them to liability.`,
  ip: `10. OUR INTELLECTUAL PROPERTY\n(a) The Platform and its original content, features, and functionality are and will remain the exclusive property of DCK and its licensors.

(b) The Platform is protected by copyright, trademark, and other laws of both the India and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of DCK.

(c) You are granted a limited, revocable, non-exclusive, non-transferable, licence to access and use the Platform strictly in accordance with these Terms.

(d) You agree not to, and will not permit others to: (i) license, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the Platform or make the Platform available to any third party. (ii) modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part of the Platform. (iii) remove, alter or obscure any proprietary notice (including any notice of copyright or trademark) of DCK, its affiliates, or their licensors, suppliers, partners, or the licensors of such licensors.`,
  term: `11. TERM AND TERMINATION\n(a) These Terms shall remain in effect until terminated by you or DCK.

(b) DCK may, in its sole discretion, at any time and for any or no reason, suspend or terminate these Terms with or without prior notice.

(c) This Agreement will terminate immediately, without prior notice from DCK, in the event that you fail to comply with any provision of these Terms. Upon termination of your rights under these Terms, your Account and access to the Platform will be terminated immediately.

(d) Upon termination of your rights under these Terms, DCK will not have any liability to you or any other party for any termination of your rights under these Terms.`,
  disclaimers: `12. DISCLAIMERS AND WARRANTIES\n(a) The Platform is provided to you "AS IS" and "AS AVAILABLE" with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, DCK, on its own behalf and on behalf of its affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Platform, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, DCK provides no warranty or undertaking, and makes no representation of any kind that the Platform will meet your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.

(b) Without limiting the foregoing, DCK does not warrant that: (i) the Platform will meet your requirements, (ii) the Platform will be compatible with all browsers, (iii) the Platform or the server that makes it available are free of viruses or other harmful components; (iv) any content on the Platform is accurate, reliable or correct; (v) the quality of any products, services, information, or other material purchased or obtained by you through the Platform will meet your expectations, and (vi) any other guarantees, assurances, or warranties.

(c) DCK will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Platform; (ii) any conduct or content of any third party on the Platform; (iii) any content obtained from the Platform; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not DCK has been informed of the possibility of such damage, even if a remedy set forth herein is found to have failed of its essential purpose.`,
  indemnity: `13. INDEMNITY\n(a) You agree to indemnify and hold DCK and its parents, subsidiaries, affiliates, officers, employees, agents, partners and licensors (if any) (collectively, "DCK and its affiliates") harmless from any claim or demand, including reasonable attorneys' fees, due to or arising out of your: (i) use of the Platform; (ii) violation of these Terms or any law or regulation; (iii) violation of any right of a third party; or (iv) violation of any right of a third party.`,
  jurisdiction: `14. JURISDICTION, GOVERNING LAWS, AND DISPUTE RESOLUTION\n(a) These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.

(b) The proper venue for any disputes arising out of or relating to these Terms or the Platform shall be the state and federal courts located in New Delhi, India.

(c) You agree that the exclusive jurisdiction for any claim or dispute with DCK, or in any way relating to your use of the Platform, shall be the state and federal courts located in New Delhi, India.

(d) DCK reserves the right to make changes to these Terms at any time. We will alert you to any changes by updating the "Last Updated" date of these Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Terms to stay informed of updates. Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes. You are expected to check this page frequently so you are aware of any changes, as they are binding on you.`,
  grievance: `15. GRIEVANCE REDRESSAL\n(a) If you have any grievances regarding the Services provided by DCK, you may contact us at privacy@daksh.com.

(b) We will make every effort to resolve your grievances and concerns.

(c) If you are not satisfied with the resolution provided by us, you may approach the National Consumer Helpline (1800 1800 1961) or the National Commission for Protection of Child Rights (NCPCR) (1800 1800 1000) or the National Human Rights Commission (NHRC) (1800 1800 1000) or the State Commission for Protection of Child Rights (SCPCR) or the State Human Rights Commission (SHRC) or the District Consumer Forum or the District Magistrate or the Police Commissioner or the District Court or the High Court or the Supreme Court of India.`,
  misc: `16. MISCELLANEOUS PROVISIONS\n(a) These Terms constitute the entire agreement between you and DCK regarding your use of the Platform and supersede all prior and contemporaneous agreements, representations, and warranties, both written and oral, relating to the Platform.

(b) These Terms will be binding upon and will inure to the benefit of the parties, their successors and permitted assigns.

(c) If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.`,
};

export default function TermAndConditions() {
  const sectionRefs = useRef({});
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let current = sections[0].id;
      for (const sec of sections) {
        const ref = sectionRefs.current[sec.id];
        if (ref && ref.offsetTop <= scrollPosition) {
          current = sec.id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const ref = sectionRefs.current[id];
    if (ref) {
      window.scrollTo({
        top: ref.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row pt-10 pb-20 px-4 sm:px-8">
        {/* Sidebar */}
        <aside className="md:w-1/4 mb-8 md:mb-0 md:pr-8 sticky top-0 self-start h-full">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-indigo-700 mb-4 uppercase tracking-wide">Terms and Conditions</h3>
            <nav className="flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`text-left px-2 py-1 rounded transition-colors text-sm font-medium ${
                    activeSection === sec.id
                      ? "bg-indigo-100 text-indigo-700 font-bold" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>
        {/* Main Content */}
        <main className="md:w-3/4 bg-white rounded-xl shadow-md p-6 md:p-10 border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-900">TERMS AND CONDITIONS</h1>
          <p className="text-center text-gray-500 mb-8 font-medium">Last Updated: 21st  July, 2025</p>
          {/* Intro (paste your intro here) */}
          <div className="mb-8 text-gray-800 leading-relaxed">
            {/* Paste the intro paragraphs from your message here */}
            <p>These terms and conditions (“Terms”) govern the use of se1rvices made available on or through https://daksh.smartbhopal.city.com and/or the Daksh Call Karigar  mobile app (collectively, the “Platform”, and together with the services made available on or through the Platform, the “Services”). These Terms also include our privacy policy, available at https://www.daksh.smart.com/privacy-policy (“Privacy Policy”), and any guidelines, additional, or supplemental terms, policies, and disclaimers made available or issued by us from time to time (“Supplemental Terms”). The Privacy Policy and the Supplemental Terms form an integral part of these Terms. In the event of a conflict between these Terms and the Supplemental Terms with respect to applicable Services, the Supplemental Terms will prevail.
{/* 
The Terms constitute a binding and enforceable legal contract between Urban Company Limited (a company incorporated under the Companies Act, 2013 with its registered address at Unit No. 08, Ground Floor, Rectangle 1, D4, Saket District Centre New Delhi - 110017, India, and its principal place of business at 7th Floor, Plot no. 183, Goworks Towers, Rajiv Nagar, Udyog Vihar, Phase 2, Sector 20, Gurgaon - 122016, India and its affiliates, formerly known as UrbanClap Technologies India Pvt. Ltd.) (“UC”, “we”, “us”, or “our”), and you, a user of the Services, or any legal entity that books Pro Services (defined below) on behalf of end-users (“you” or “Customer”). By using the Services, you represent and warrant that you have full legal capacity and authority to agree to and bind yourself to these Terms. If you represent any other person, you confirm and represent that you have the necessary power and authority to bind such person to these Terms.

By using the Services, you agree that you have read, understood, and are bound by, these Terms, as amended from time to time, and that you will comply with the requirements listed here. These Terms expressly supersede any prior written agreements with you. If you do not agree to these Terms, or comply with the requirements listed here, please do not use the Services.*/} </p> 
            {/* ...rest of intro... */}
          </div>
          {/* Sections */}
          {sections.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              ref={el => (sectionRefs.current[sec.id] = el)}
              className="mb-10 scroll-mt-24"
            >
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">{sec.label}</h2>
              <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                {sectionContent[sec.id] || "Section content goes here..."}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
