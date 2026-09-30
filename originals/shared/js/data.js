/* Pepsoma — catalog & site content (shared by both design versions).
   Edit this file to change products, prices, FAQs and company details. */
(function () {
  const PS = (window.PS = window.PS || {});

  // Bracketed values are placeholders — replace before launch (see README).
  PS.company = {
    name: 'Pepsoma',
    legal: 'Pepsoma LLC',
    domain: 'pepsoma.com',
    email: 'support@pepsoma.com',
    wholesaleEmail: 'wholesale@pepsoma.com',
    privacyEmail: 'privacy@pepsoma.com',
    phone: '(555) 010-0199',
    address: '[Business address, City, State ZIP]',
    state: '[State of formation]',
    county: '[County]',
    cutoff: '2 PM ET',
    effective: 'September 23, 2026',
    founded: 2026,
  };

  PS.categories = [
    { id: 'recovery', name: 'Recovery & Repair', blurb: 'Peptides studied in tissue, tendon and mucosal repair models.' },
    { id: 'gh', name: 'GH Secretagogues', blurb: 'GHRH analogs and ghrelin mimetics for endocrine research.' },
    { id: 'longevity', name: 'Longevity & Metabolic', blurb: 'Compounds used in cellular energy and aging research.' },
    { id: 'cognitive', name: 'Neuropeptides', blurb: 'Short regulatory peptides studied in neuroscience models.' },
    { id: 'dermal', name: 'Dermal & Cosmetic', blurb: 'Copper peptides and matrix-signaling research.' },
    { id: 'stacks', name: 'Research Stacks', blurb: 'Pre-built multi-compound kits at a bundled price.' },
    { id: 'supplies', name: 'Lab Supplies', blurb: 'Reconstitution and handling essentials.' },
  ];

  const sz = (id, price, compare) => ({ id, label: id.replace(/(\d)(mg|ml)$/i, '$1 $2').replace('ml', 'mL'), price, compare });

  PS.products = [
    {
      id: 'bpc-157', code: 'BPC', name: 'BPC-157', full: 'Body Protection Compound-157', cat: 'recovery', badge: 'Best seller',
      sizes: [sz('5mg', 44.99, 54.99), sz('10mg', 69.99, 84.99)], purity: 99.4,
      seq: 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val', formula: 'C62H98N16O22', mw: 1419.5, cas: '137525-51-0',
      summary: 'A synthetic 15-amino-acid pentadecapeptide derived from a sequence of a protective protein identified in gastric juice.',
      research: ['Tendon, ligament and soft-tissue healing models (preclinical)', 'Gastrointestinal mucosal integrity models', 'Angiogenesis and nitric-oxide signaling pathways'],
      accent: '#7c5cff', featured: true,
    },
    {
      id: 'tb-500', code: 'TB5', name: 'TB-500', full: 'Thymosin Beta-4 (synthetic)', cat: 'recovery',
      sizes: [sz('5mg', 54.99), sz('10mg', 89.99, 99.99)], purity: 99.1,
      seq: 'Ac-SDKPDMAEIEKFDKSKLKKTETQEKNPLPSKETIEQEKQAGES', formula: 'C212H350N56O78S', mw: 4963.5, cas: '77591-33-4',
      summary: 'A synthetic version of thymosin β-4, a 43-residue actin-sequestering peptide present in most cell types.',
      research: ['Actin polymerization and cell-migration assays', 'Wound-closure and angiogenesis models (preclinical)', 'Cardiac and corneal repair models'],
      accent: '#4f7cff', featured: true,
    },
    {
      id: 'bpc-tb-blend', code: 'BTB', name: 'BPC-157 / TB-500', vial: ['BPC-157', '+ TB-500'], full: 'Pre-blended 5 mg + 5 mg', cat: 'recovery', badge: 'Sale',
      sizes: [sz('10mg', 79.99, 94.99)], purity: 99.2,
      seq: 'Blend — see individual components', formula: 'Blend', mw: null, cas: 'N/A (blend)',
      summary: 'BPC-157 and TB-500 co-lyophilized in a single vial (5 mg each) for protocols that study both compounds together.',
      research: ['Combined soft-tissue repair models', 'Comparative and synergy study designs'],
      accent: '#6a5cff', featured: true,
    },
    {
      id: 'ghk-cu', code: 'GHK', name: 'GHK-Cu', full: 'Copper Tripeptide-1', cat: 'dermal',
      sizes: [sz('50mg', 39.99), sz('100mg', 59.99, 69.99)], purity: 99.6,
      seq: 'Gly-His-Lys · Cu²⁺', formula: 'C14H22CuN6O4', mw: 401.9, cas: '89030-95-5', appearance: 'Blue lyophilized powder', powder: '#4d7fd6',
      summary: 'The copper(II) complex of the naturally occurring tripeptide glycyl-L-histidyl-L-lysine.',
      research: ['Collagen and extracellular-matrix synthesis in fibroblast cultures', 'Gene-expression profiling studies', 'Dermal and hair-follicle models'],
      accent: '#3d8bd9', featured: true,
    },
    {
      id: 'ipamorelin', code: 'IPA', name: 'Ipamorelin', full: 'Selective GHS-R1a agonist', cat: 'gh',
      sizes: [sz('5mg', 39.99), sz('10mg', 64.99)], purity: 99.3,
      seq: 'Aib-His-D-2Nal-D-Phe-Lys-NH₂', formula: 'C38H49N9O5', mw: 711.9, cas: '170851-70-4',
      summary: 'A synthetic pentapeptide ghrelin-receptor agonist noted in the literature for its receptor selectivity.',
      research: ['GH pulsatility studies in animal models', 'Ghrelin-receptor (GHS-R1a) pharmacology', 'Selectivity versus cortisol / prolactin release'],
      accent: '#9b5cff',
    },
    {
      id: 'cjc-ipa', code: 'CJI', name: 'CJC-1295 + Ipamorelin', vial: ['CJC-1295', '+ Ipamorelin'], full: 'CJC-1295 (no DAC) 5 mg + Ipamorelin 5 mg', cat: 'gh', badge: 'Sale',
      sizes: [sz('10mg', 69.99, 79.99)], purity: 99.2,
      seq: 'Blend — Mod GRF (1-29) + Ipamorelin', formula: 'Blend', mw: null, cas: 'N/A (blend)',
      summary: 'Modified GRF (1-29) paired with ipamorelin in one vial for studies of combined GHRH / GHS-R signaling.',
      research: ['GHRH-receptor and GHS-R co-activation models', 'Endocrine pulsatility research'],
      accent: '#b05cff', featured: true,
    },
    {
      id: 'tesamorelin', code: 'TES', name: 'Tesamorelin', full: 'Stabilized GHRH (1-44) analog', cat: 'gh', badge: 'Sale',
      sizes: [sz('10mg', 89.99, 99.99), sz('20mg', 159.99)], purity: 99.5,
      seq: 'trans-3-hexenoyl-GHRH (1-44)-NH₂', formula: 'C221H366N72O67S', mw: 5135.9, cas: '218949-48-5',
      summary: 'A synthetic 44-amino-acid analog of growth-hormone-releasing hormone with an N-terminal modification for stability.',
      research: ['Visceral adipose tissue models', 'GHRH-receptor signaling', 'IGF-1 axis research'],
      accent: '#5c6bff', featured: true,
    },
    {
      id: 'sermorelin', code: 'SER', name: 'Sermorelin', full: 'GHRH (1-29)-NH₂', cat: 'gh',
      sizes: [sz('5mg', 49.99), sz('10mg', 84.99)], purity: 99.2,
      seq: 'YADAIFTNSYRKVLGQLSARKLLQDIMSR-NH₂', formula: 'C149H246N44O42S', mw: 3357.9, cas: '86168-78-7',
      summary: 'The shortest fully functional fragment of endogenous GHRH — the first 29 amino acids.',
      research: ['Pituitary somatotroph stimulation assays', 'Age-related GH decline models'],
      accent: '#7a5cff',
    },
    {
      id: 'nad', code: 'NAD', name: 'NAD+', full: 'Nicotinamide adenine dinucleotide', cat: 'longevity', badge: 'Popular',
      sizes: [sz('500mg', 69.99), sz('1000mg', 119.99, 139.99)], purity: 99.2,
      seq: 'Coenzyme (non-peptide)', formula: 'C21H27N7O14P2', mw: 663.4, cas: '53-84-9',
      summary: 'A coenzyme present in every living cell and central to redox reactions and sirtuin / PARP activity.',
      research: ['Cellular energy metabolism and mitochondrial function', 'Sirtuin and PARP enzyme activity', 'Age-associated NAD+ decline models'],
      accent: '#e0a526', featured: true,
    },
    {
      id: 'epitalon', code: 'EPI', name: 'Epitalon', full: 'Epithalon tetrapeptide', cat: 'longevity',
      sizes: [sz('10mg', 44.99), sz('50mg', 149.99)], purity: 99.5,
      seq: 'Ala-Glu-Asp-Gly', formula: 'C14H22N4O9', mw: 390.3, cas: '307297-39-8',
      summary: 'A synthetic tetrapeptide modeled on epithalamin, an extract of the pineal gland.',
      research: ['Telomerase activity in cell cultures', 'Circadian and pineal-function models', 'Lifespan studies in animal models'],
      accent: '#d98a3d',
    },
    {
      id: 'mots-c', code: 'MOT', name: 'MOTS-c', full: 'Mitochondrial-derived peptide', cat: 'longevity',
      sizes: [sz('10mg', 64.99), sz('40mg', 199.99)], purity: 99.1,
      seq: 'MRWQEMGYIFYPRKLR', formula: 'C101H152N28O22S2', mw: 2174.6, cas: '1627580-64-6',
      summary: 'A 16-amino-acid peptide encoded in the mitochondrial 12S rRNA gene.',
      research: ['AMPK activation and glucose-handling models', 'Exercise-mimetic and metabolic research', 'Mitochondrial–nuclear signaling'],
      accent: '#e07a3d',
    },
    {
      id: 'glutathione', code: 'GSH', name: 'Glutathione', full: 'Reduced L-glutathione', cat: 'longevity',
      sizes: [sz('600mg', 39.99), sz('1500mg', 79.99)], purity: 99.4,
      seq: 'γ-Glu-Cys-Gly', formula: 'C10H17N3O6S', mw: 307.3, cas: '70-18-8',
      summary: 'The principal intracellular thiol antioxidant, a tripeptide of glutamate, cysteine and glycine.',
      research: ['Oxidative-stress and redox-balance assays', 'Hepatocyte detoxification models'],
      accent: '#d9b43d',
    },
    {
      id: 'selank', code: 'SEL', name: 'Selank', full: 'Tuftsin analog heptapeptide', cat: 'cognitive',
      sizes: [sz('5mg', 39.99), sz('10mg', 64.99)], purity: 99.3,
      seq: 'Thr-Lys-Pro-Arg-Pro-Gly-Pro', formula: 'C33H57N11O9', mw: 751.9, cas: '129954-34-3',
      summary: 'A synthetic analog of the immunomodulatory peptide tuftsin, extended with a Pro-Gly-Pro tail for stability.',
      research: ['Anxiety-related behavioral models (rodent)', 'GABAergic and monoamine signaling', 'Enkephalin-degrading enzyme studies'],
      accent: '#3dbfa0',
    },
    {
      id: 'semax', code: 'SMX', name: 'Semax', full: 'ACTH (4-10) analog', cat: 'cognitive',
      sizes: [sz('5mg', 39.99), sz('10mg', 64.99)], purity: 99.2,
      seq: 'Met-Glu-His-Phe-Pro-Gly-Pro', formula: 'C37H51N9O10S', mw: 813.9, cas: '80714-61-0',
      summary: 'A heptapeptide analog of the ACTH (4-10) fragment with a C-terminal Pro-Gly-Pro extension.',
      research: ['BDNF expression in neural tissue', 'Ischemia models (preclinical)', 'Attention and memory paradigms (rodent)'],
      accent: '#3da5bf',
    },
    {
      id: 'kpv', code: 'KPV', name: 'KPV', full: 'α-MSH C-terminal tripeptide', cat: 'recovery',
      sizes: [sz('10mg', 49.99)], purity: 99.5,
      seq: 'Lys-Pro-Val', formula: 'C16H30N4O4', mw: 342.4, cas: '67727-97-3',
      summary: 'The C-terminal tripeptide (11-13) of alpha-melanocyte-stimulating hormone.',
      research: ['NF-κB and inflammatory-signaling assays', 'Intestinal epithelial models', 'Dermal inflammation models'],
      accent: '#5ca8ff',
    },
    {
      id: 'bac-water', code: 'BAC', name: 'Bacteriostatic Water', vial: ['Bacteriostatic', 'Water'], full: '0.9% benzyl alcohol, sterile', cat: 'supplies', noCoa: true,
      sizes: [sz('10ml', 9.99), sz('30ml', 19.99)], purity: null,
      seq: '—', formula: 'H₂O + 0.9% C₇H₈O', mw: null, cas: '7732-18-5', appearance: 'Clear, colorless solution', liquid: true,
      summary: 'Sterile water with 0.9% benzyl alcohol preservative, used to reconstitute lyophilized research compounds.',
      research: ['Reconstitution of lyophilized peptides for in-vitro work'],
      accent: '#8aa0b8',
    },
    // Research stacks (bundles)
    {
      id: 'stack-recovery', code: 'SRC', name: 'Recovery Research Stack', cat: 'stacks', badge: 'Save 12%',
      includes: [['bpc-157', '10mg'], ['tb-500', '10mg']], sizes: [{ id: 'kit', label: 'Kit · 2 vials', price: 139.99, compare: 159.98 }],
      summary: 'BPC-157 10 mg and TB-500 10 mg — the two most-cited compounds in soft-tissue repair literature, in one kit.',
      research: ['Paired soft-tissue repair study designs', 'Each vial ships with its own lot-matched COA'],
      accent: '#7c5cff', featured: true,
    },
    {
      id: 'stack-longevity', code: 'SLG', name: 'Longevity Research Stack', cat: 'stacks', badge: 'Save 11%',
      includes: [['nad', '500mg'], ['epitalon', '10mg'], ['mots-c', '10mg']], sizes: [{ id: 'kit', label: 'Kit · 3 vials', price: 159.99, compare: 179.97 }],
      summary: 'NAD+, Epitalon and MOTS-c — three compounds used across cellular-energy and aging research.',
      research: ['Mitochondrial and metabolic study designs', 'Each vial ships with its own lot-matched COA'],
      accent: '#e0a526', featured: true,
    },
    {
      id: 'stack-gh', code: 'SGH', name: 'GH Secretagogue Stack', cat: 'stacks', badge: 'Save 9%',
      includes: [['cjc-ipa', '10mg'], ['tesamorelin', '10mg']], sizes: [{ id: 'kit', label: 'Kit · 2 vials', price: 144.99, compare: 159.98 }],
      summary: 'CJC-1295 + Ipamorelin blend and Tesamorelin for comparative GHRH-axis research.',
      research: ['Comparative GHRH analog designs', 'Each vial ships with its own lot-matched COA'],
      accent: '#5c6bff',
    },
    {
      id: 'stack-neuro', code: 'SNR', name: 'Neuropeptide Stack', cat: 'stacks', badge: 'Save 15%',
      includes: [['selank', '10mg'], ['semax', '10mg']], sizes: [{ id: 'kit', label: 'Kit · 2 vials', price: 109.99, compare: 129.98 }],
      summary: 'Selank and Semax, two Pro-Gly-Pro-stabilized heptapeptides frequently studied side by side.',
      research: ['Behavioral and neurotrophic study designs', 'Each vial ships with its own lot-matched COA'],
      accent: '#3dbfa0',
    },
  ];

  PS.faqs = [
    { group: 'Products & quality', items: [
      ['What are research peptides?', 'Peptides are short chains of amino acids. Research peptides are synthesized to a documented specification and supplied to laboratories, universities and qualified researchers for in-vitro study. Every Pepsoma product is sold strictly for research use and is not intended for human or animal consumption.'],
      ['How do you verify purity and identity?', 'Every lot is sent to an independent ISO/IEC 17025-accredited laboratory before it is listed. Testing covers purity (RP-HPLC), identity (mass spectrometry), net peptide content, endotoxins, heavy metals and sterility. Lots that miss specification are never sold.'],
      ['Where do I find the COA for my vial?', 'Every vial label carries a lot number. Enter it on our Lab Tests page to view and download the Certificate of Analysis for that exact lot. A printed COA is also included in every order.'],
      ['How should lyophilized peptides be stored?', 'Lyophilized (freeze-dried) material is stable at room temperature for shipping. For long-term storage, keep vials sealed at −20 °C and protected from light; 2–8 °C is suitable for short-term storage. Reconstituted material should be refrigerated and used according to your lab’s protocols.'],
    ] },
    { group: 'Ordering & payment', items: [
      ['Who can purchase from Pepsoma?', 'Customers must be 21 or older and must confirm at checkout that products are purchased solely for lawful laboratory research. We reserve the right to cancel any order we believe is intended for human or veterinary use.'],
      ['Do you offer volume pricing?', 'Yes. Volume savings apply automatically to one-time items: 5% off 3+ vials, 10% off 5+ vials and 15% off 10+ vials. Institutions ordering at larger scale can apply for wholesale pricing.'],
      ['How do standing orders work?', 'Choose “Standing order” on a product page to have it re-ship every 4 or 8 weeks at a discount. You can skip, change or cancel any time from your account before the next ship date — no fees.'],
      ['Which payment methods do you accept?', 'Major credit and debit cards at checkout. Wholesale and institutional accounts can also pay by ACH, wire or purchase order.'],
    ] },
    { group: 'Shipping', items: [
      ['How fast do you ship?', `Orders placed before ${PS.company.cutoff} on business days ship the same day. You’ll receive tracking by email as soon as the label is created.`],
      ['Is packaging discreet?', 'Yes. Orders ship in plain, unbranded outer packaging with vials secured in protective inserts.'],
      ['Do you ship internationally?', 'We currently ship within the United States only, including APO/FPO addresses via USPS.'],
    ] },
    { group: 'Returns & issues', items: [
      ['What if my order arrives damaged or incorrect?', 'Contact us within 7 days of delivery with your order number and a photo. We’ll replace the item or refund it — no need to send anything back.'],
      ['Can I return an opened vial?', 'For safety and integrity reasons we cannot accept returns of opened or unsealed products. Unopened items can be returned within 30 days — see our Refund & Return Policy.'],
    ] },
  ];

  PS.steps = [
    { n: '01', title: 'Choose your compounds', body: 'Browse by research area or search by name. Every listing shows the current lot’s purity and COA.' },
    { n: '02', title: 'Confirm research use', body: 'At checkout, confirm you are 21+ and purchasing for lawful in-vitro laboratory research.' },
    { n: '03', title: 'Ships within 24 hours', body: `Orders placed before ${PS.company.cutoff} ship same day in discreet packaging with a printed, lot-matched COA.` },
    { n: '04', title: 'Verify & get support', body: 'Match the lot number on your vial to its COA online. Our team answers technical questions within one business day.' },
  ];

  // Placeholder testimonials for the demo — replace with real, verifiable reviews before launch.
  PS.testimonials = [
    { title: 'Documentation is the difference', body: 'Lot-matched COAs made our incoming QC a five-minute job. Purity matched our in-house HPLC within a tenth of a percent.', who: 'Principal Investigator, academic lab' },
    { title: 'Fast and well packed', body: 'Ordered at noon, arrived next day. Vials were packed securely and labeled clearly with lot numbers. Exactly what we need.', who: 'Lab Manager, biotech R&D' },
    { title: 'Support that knows chemistry', body: 'Asked a question about counter-ions on a Friday and had a real answer from a chemist by Monday morning.', who: 'Research Associate, CRO' },
  ];

  PS.getProduct = (id) => PS.products.find((p) => p.id === id);
  PS.getCategory = (id) => PS.categories.find((c) => c.id === id);
})();
