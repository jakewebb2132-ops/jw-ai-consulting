import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';

interface FAQ {
    question: string;
    answer: string;
}

interface ServiceContent {
    title: string;
    desc: string;
    definition: string;
    howItWorks: { step: string; detail: string }[];
    whoItsFor: string[];
    faqs: FAQ[];
}

const SERVICE_CONTENT: Record<string, ServiceContent> = {
    startups: {
        title: 'AI Consulting for Startups',
        desc: 'Accelerate product-market fit with intelligent architectures built for speed — not technical debt.',
        definition: 'AI consulting for startups means designing and implementing AI features that fit your early-stage product architecture without creating technical debt. JW AI Consulting builds lightweight, scalable intelligence layers — using RAG pipelines, fine-tuned LLMs, and agent frameworks — so you can ship generative features in weeks, not months. For early-stage companies in Austin and beyond, we architect AI that scales with your product rather than against it.',
        howItWorks: [
            { step: 'Discovery & Scoping', detail: 'We audit your current stack and define the highest-leverage AI integration point — the one that directly accelerates product-market fit.' },
            { step: 'Architecture Design', detail: 'We design a lightweight intelligence layer using the right model for your latency, cost, and data sensitivity requirements.' },
            { step: 'Rapid Deployment', detail: 'We build and deploy your AI feature with a focus on iteration speed — most startup integrations are live within 4–8 weeks.' },
            { step: 'Iteration & Optimization', detail: 'We monitor performance, tune prompts and retrieval systems, and expand capability as your product evolves.' },
        ],
        whoItsFor: [
            'Pre-seed through Series B startups building AI-native products',
            'Founders adding generative features to existing SaaS products',
            'CTOs evaluating LLM models, RAG vs. fine-tuning, and agent frameworks',
            'Austin-area startups in the Capital Factory and Austin Technology Council networks',
        ],
        faqs: [
            {
                question: 'What is AI consulting for startups?',
                answer: 'AI consulting for startups means designing and implementing AI features that fit your early-stage product architecture without creating technical debt. JW AI Consulting builds lightweight, scalable intelligence layers — typically using RAG pipelines and fine-tuned LLMs — so you can ship generative features in weeks, not months.',
            },
            {
                question: 'How quickly can a startup integrate AI into its product?',
                answer: 'Most startup AI integrations take 4–8 weeks from scoping to production. The timeline depends on your existing data infrastructure and the complexity of the AI feature — a chatbot assistant typically deploys faster than a predictive recommendation system.',
            },
            {
                question: 'What AI models does JW AI Consulting use for startup projects?',
                answer: 'We work with GPT-4o, Claude 3.5, Gemini, and open-source models like Llama and Mistral, selecting the right model based on your latency requirements, data sensitivity, and cost constraints. For most startups, a combination of a frontier model API and a lightweight embedding model delivers the best price-to-performance ratio.',
            },
            {
                question: 'What is the difference between RAG and fine-tuning for a startup?',
                answer: 'Retrieval-Augmented Generation (RAG) connects an LLM to your existing data — product docs, knowledge bases, customer records — without retraining the model. Fine-tuning changes the model\'s weights to specialize its behavior. For most startups, RAG is faster, cheaper, and more maintainable; fine-tuning is reserved for cases where the model needs to adopt a very specific style or specialized vocabulary.',
            },
            {
                question: 'How much does AI consulting cost for an early-stage startup?',
                answer: 'AI consulting engagements for startups typically range from $5,000 for a focused architecture sprint to $25,000 for a full integration project. JW AI Consulting offers milestone-based pricing so founders can validate value at each stage before committing to the full scope.',
            },
            {
                question: 'Does JW AI Consulting work with Austin-based startups?',
                answer: 'Yes. JW AI Consulting is an Austin-based AI consulting firm, and we work closely with startups in the Austin tech ecosystem. We also work with remote-first startups across Texas and nationally — location is not a requirement.',
            },
        ],
    },
    smb: {
        title: 'AI Consulting for Small Businesses',
        desc: 'Automate back-office workflows and unlock the data leverage sitting inside your business.',
        definition: 'AI consulting for small businesses means identifying the highest-ROI automation opportunities in your existing workflows and deploying AI tools that reduce manual labor without replacing the people who understand your customers. JW AI Consulting builds bespoke data pipelines, AI chatbots, and automation systems around the software SMBs already use — Google Workspace, QuickBooks, HubSpot, and others. Austin-area small businesses are sitting on goldmines of unstructured data; we help you turn it into operational efficiency.',
        howItWorks: [
            { step: 'Workflow Audit', detail: 'We map your current manual processes and identify the highest-volume, highest-repetition tasks — these are almost always the highest-ROI AI targets.' },
            { step: 'Tool Selection', detail: 'We select or build AI tools that integrate with your existing software stack, so you don\'t have to replace what\'s already working.' },
            { step: 'Custom Integration', detail: 'We build the automation pipeline, test it against real workloads, and train your team to use and maintain it.' },
            { step: 'ROI Tracking', detail: 'We establish baseline metrics before launch and track time savings, error reduction, and cost impact in the first 90 days.' },
        ],
        whoItsFor: [
            'Small businesses spending 10+ hours per week on manual data entry or reporting',
            'Service businesses with high-volume customer intake and follow-up workflows',
            'SMBs with unstructured data in email, PDFs, or spreadsheets that isn\'t being used',
            'Austin-area businesses looking to compete with larger companies through AI leverage',
        ],
        faqs: [
            {
                question: 'What AI services does JW AI Consulting offer for small businesses?',
                answer: 'JW AI Consulting helps small and medium businesses in Austin automate back-office workflows, extract insights from unstructured data, and deploy AI tools that reduce manual labor. Services include workflow automation, custom AI chatbots, data pipeline design, and AI-powered reporting systems.',
            },
            {
                question: 'What business processes can be automated with AI for small businesses?',
                answer: 'The highest-ROI AI automation targets for SMBs include customer intake and triage, invoice processing, appointment scheduling, inventory forecasting, and email response drafting. Most small businesses see a 60–70% reduction in time spent on these tasks within the first 90 days of deployment.',
            },
            {
                question: 'How long does it take to see ROI from AI automation?',
                answer: 'Most SMB clients see measurable time savings within 30 days of deploying their first automation. Full ROI — where the cost of the project is offset by labor savings — typically arrives within 3–6 months depending on the volume of the automated workflow.',
            },
            {
                question: 'Do I need technical staff to use AI in my small business?',
                answer: 'No. JW AI Consulting designs AI solutions around the tools you already use — Google Workspace, QuickBooks, HubSpot, Salesforce, and most common SMB platforms. You don\'t need a data team or technical staff; we build and manage the integration.',
            },
            {
                question: 'How is custom AI consulting different from off-the-shelf AI software?',
                answer: 'Off-the-shelf AI tools are built for generic use cases. Custom AI consulting builds solutions around your specific data, workflows, and business rules — meaning the output is trained on your customers, your products, and your processes. The result is significantly higher accuracy and adoption than generic SaaS AI tools.',
            },
            {
                question: 'Does JW AI Consulting serve small businesses outside Austin?',
                answer: 'Our primary market is Austin, Texas, but we serve SMBs throughout Texas and remotely nationwide. If your business has a defined AI problem — inefficient workflows, underutilized data, or customer service bottlenecks — we can help regardless of location.',
            },
        ],
    },
    enterprise: {
        title: 'Enterprise AI Context Engineering',
        desc: 'Secure, compliant, and scalable AI infrastructure — built around your proprietary data and workflows.',
        definition: 'Enterprise AI context engineering is the practice of designing AI systems that understand and operate within a company\'s specific knowledge base, policies, and data environment. Rather than using a generic AI model, context engineering embeds your proprietary documentation, compliance rules, and domain expertise directly into how the AI generates responses. JW AI Consulting specializes in RAG pipelines and private model deployments that protect your IP while empowering your workforce — without the overhead of a large consulting firm.',
        howItWorks: [
            { step: 'Discovery & Data Audit', detail: 'We assess your existing data infrastructure, identify the highest-value AI use cases, and define compliance and governance requirements before any code is written.' },
            { step: 'Architecture & Governance Design', detail: 'We design a RAG pipeline or proprietary model deployment strategy with role-based access, data residency controls, and compliance guardrails built in from the start.' },
            { step: 'Pilot Deployment', detail: 'We launch a scoped pilot within a single workflow or department — typically 8–12 weeks — to prove value and identify edge cases before organizational rollout.' },
            { step: 'Scale & Integration', detail: 'We integrate with your enterprise stack — Salesforce, Microsoft 365, SharePoint, SAP, Snowflake — and expand deployment with change management support.' },
        ],
        whoItsFor: [
            'Mid-market and growth-stage enterprises deploying AI across multiple departments',
            'Organizations in regulated industries requiring compliant AI (HIPAA, SOC 2, GDPR)',
            'CTOs and CIOs evaluating RAG, proprietary LLM deployment, and agent orchestration',
            'Companies frustrated by large firm overhead and slow time-to-value',
        ],
        faqs: [
            {
                question: 'What is enterprise AI context engineering?',
                answer: 'Enterprise context engineering is the practice of designing AI systems that understand and operate within a company\'s specific knowledge base, policies, and data environment. Rather than using a generic AI model, context engineering embeds your proprietary documentation, compliance rules, and domain expertise directly into how the AI generates responses.',
            },
            {
                question: 'What is a RAG pipeline and why does an enterprise need one?',
                answer: 'RAG (Retrieval-Augmented Generation) is an architecture that retrieves relevant documents from your internal data before generating a response. Enterprises need RAG because frontier LLMs don\'t know your proprietary products, internal processes, or current policies — RAG closes that gap without requiring the model to be retrained, keeping your IP secure and your AI answers accurate.',
            },
            {
                question: 'How does JW AI Consulting protect sensitive enterprise data in AI deployments?',
                answer: 'We implement private model deployments, data residency controls, and role-based access layers that keep your data within your infrastructure. For regulated industries, we design compliance-first architectures that meet SOC 2, HIPAA, and GDPR requirements before any AI system touches production data.',
            },
            {
                question: 'What enterprise systems does JW AI Consulting integrate with?',
                answer: 'We integrate AI workflows with Salesforce, Microsoft 365, SharePoint, SAP, ServiceNow, Workday, and most enterprise data warehouses including Snowflake and Databricks. If your stack is nonstandard, we assess integration feasibility in the discovery phase before committing to a project scope.',
            },
            {
                question: 'How long does an enterprise AI deployment typically take?',
                answer: 'An enterprise AI pilot — scoped to a single workflow or department — typically runs 8–12 weeks. A full organizational deployment with governance, training, and phased rollout takes 4–6 months. JW AI Consulting recommends a pilot-first approach to prove value and reduce organizational risk before scaling.',
            },
            {
                question: 'What makes JW AI Consulting different from large enterprise AI consulting firms?',
                answer: 'JW AI Consulting provides direct access to senior AI engineers — not junior associates managed by a partner you meet twice. Engagements are scoped precisely to your problem, not inflated to fill a large firm\'s billable hours. For mid-market enterprises and growth-stage companies, this means faster time-to-value and a tighter feedback loop throughout the project.',
            },
        ],
    },
};

const ServicePage = () => {
    const { slug } = useParams<{ slug: string }>();
    const content = slug && SERVICE_CONTENT[slug] ? SERVICE_CONTENT[slug] : null;

    if (!content) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900">
                <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
                <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 transition-colors">
                    <ArrowLeft /> Return Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6 text-slate-900">
            <SEO
                title={content.title}
                description={content.desc}
                faqs={content.faqs}
            />

            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors mb-12">
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </Link>

                {/* Hero */}
                <ScrollReveal>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm mb-6 uppercase tracking-widest shadow-sm">
                        Service Offering
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                        {content.title}
                    </h1>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <p className="text-xl text-slate-500 font-light mb-10 leading-relaxed">
                        {content.desc}
                    </p>
                </ScrollReveal>

                {/* Definition block */}
                <ScrollReveal delay={250}>
                    <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-blue-900/5 mb-14">
                        <p className="text-lg text-slate-700 leading-relaxed">{content.definition}</p>
                    </div>
                </ScrollReveal>

                {/* How It Works */}
                <ScrollReveal delay={300}>
                    <section className="mb-14">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">How It Works</h2>
                        <ol className="space-y-5">
                            {content.howItWorks.map((item, i) => (
                                <li key={i} className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 mb-1">{item.step}</h3>
                                        <p className="text-slate-600 leading-relaxed">{item.detail}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </section>
                </ScrollReveal>

                {/* Who It's For */}
                <ScrollReveal delay={350}>
                    <section className="mb-14">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Who It's For</h2>
                        <ul className="space-y-3">
                            {content.whoItsFor.map((item, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2.5" />
                                    <span className="text-slate-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </ScrollReveal>

                {/* FAQ */}
                <ScrollReveal delay={400}>
                    <section className="mb-14">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {content.faqs.map((faq, i) => (
                                <div key={i} className="border-b border-slate-200 pb-6 last:border-0 last:pb-0">
                                    <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </ScrollReveal>

                {/* CTA */}
                <ScrollReveal delay={450}>
                    <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white text-center">
                        <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
                        <p className="text-blue-100 mb-6">Let's scope your project and find the right AI leverage point for your business.</p>
                        <a
                            href="mailto:jake@jwaiconsulting.com"
                            className="inline-block bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                        >
                            Get in Touch
                        </a>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
};

export default ServicePage;
