export type SampleRole = "Software Developer" | "Sales" | "Marketing" | "Web3" | "Writer";

export interface SampleData {
  role: SampleRole;
  resume: string;
  jobDescription: string;
}

export const sampleDataList: SampleData[] = [
  {
    role: "Software Developer",
    resume: `Software Engineer with 3 years of experience building scalable web applications.

Skills: React, TypeScript, Node.js, Python, PostgreSQL, REST APIs, Git, Docker

Experience:
• Frontend Engineer at TechCorp (2022–present)
  - Built and maintained React dashboard used by 50,000 daily active users
  - Reduced page load time by 40% through code splitting and lazy loading
  - Led migration from JavaScript to TypeScript across 3 major modules

• Junior Developer at StartupXYZ (2021–2022)
  - Developed RESTful APIs using Node.js and Express
  - Collaborated with product team to ship 2 major features per sprint

Education: B.Tech Computer Science, Delhi University (2021)`,
    jobDescription: `Senior Frontend Engineer — FinTech Startup

We're looking for a Senior Frontend Engineer to join our growing team building the next generation of personal finance tools.

Requirements:
• 4+ years of experience with React or similar frameworks
• Strong TypeScript skills
• Experience with state management (Redux, Zustand, or similar)
• Familiarity with REST APIs and GraphQL
• Experience with performance optimization
• Strong communication and ability to work in fast-paced environments

Nice to have:
• Experience with financial products
• Knowledge of accessibility standards (WCAG)
• Open source contributions

We offer competitive salary, equity, remote-first culture, and fast career growth.`,
  },
  {
    role: "Sales",
    resume: `Results-driven Sales Executive with 5 years of experience in B2B SaaS sales. Proven track record of exceeding quotas and building long-term client relationships.

Skills: B2B Sales, CRM (Salesforce), Cold Calling, Negotiation, Account Management, Pipeline Development

Experience:
• Enterprise Account Executive at CloudScale Solutions (2021–present)
  - Achieved 120% of annual quota in 2022 and 135% in 2023
  - Closed deals with average ARR of $50,000
  - Mentored 3 junior Sales Development Reps

• Sales Development Representative at DataTech Inc. (2019–2021)
  - Generated 150+ qualified leads per month
  - Improved cold email response rate by 25% through A/B testing

Education: BBA Marketing, Mumbai University (2019)`,
    jobDescription: `Enterprise Account Executive — SaaS CRM

We are looking for a hungry and experienced Enterprise Account Executive to join our rapidly growing sales team. You will be responsible for driving revenue by acquiring new enterprise clients.

Requirements:
• 3+ years of B2B SaaS sales experience
• Proven history of meeting or exceeding quotas
• Excellent presentation and negotiation skills
• Proficiency with Salesforce or similar CRM
• Ability to run a full sales cycle from prospecting to close
• Proactive, self-starter mentality

What we offer:
• Base salary + uncapped commission structure
• Comprehensive health benefits
• Flexible PTO policy`,
  },
  {
    role: "Marketing",
    resume: `Creative Content Marketer and Strategist with 4 years of experience driving brand awareness and engagement across digital channels.

Skills: SEO, Content Strategy, Copywriting, Google Analytics, Social Media Management, Email Marketing (Mailchimp)

Experience:
• Digital Marketing Specialist at TrendyApp (2021–present)
  - Grew organic blog traffic by 200% over 12 months via targeted SEO strategy
  - Managed quarterly ad budget of $20,000 with an average CAC reduction of 15%
  - Conceptualized and executed a viral social media campaign resulting in 10k new followers

• Marketing Assistant at CreativeAgency (2020–2021)
  - Assisted in drafting press releases and email newsletters
  - Conducted market research and competitor analysis for key clients

Education: BA English, JNU (2020)`,
    jobDescription: `Growth Marketing Manager — E-commerce Platform

We are seeking a data-driven Growth Marketing Manager who is passionate about finding innovative ways to drive user acquisition and retention.

Responsibilities:
• Develop and execute growth strategies across paid and organic channels
• Optimize SEO and content marketing initiatives
• Analyze A/B testing results to improve conversion rates
• Manage budgets for performance marketing (Facebook Ads, Google Ads)
• Work closely with product and design teams to optimize user flows

Requirements:
• 3+ years in growth marketing or digital marketing
• Strong analytical skills and proficiency in Google Analytics
• Experience with CRM and email marketing automation
• Creative mindset with statistical rigor`,
  },
  {
    role: "Web3",
    resume: `Passionate Smart Contract Developer specializing in Solidity and decentralized finance (DeFi) protocols.

Skills: Solidity, Ethers.js, Hardhat, React, Node.js, EVM, Smart Contract Auditing, Truffle

Experience:
• Blockchain Developer at DeFi Labs (2022–present)
  - Developed and deployed an automated market maker (AMM) protocol processing $1M+ daily volume
  - Wrote comprehensive unit tests yielding 95% test coverage for all smart contracts
  - Integrated smart contracts with frontend using wagmi and viem

• Full Stack Developer at TechSolutions (2020–2022)
  - Built full-stack web applications using React and Node.js
  - Transitioned into Web3 by contributing to open-source Ethereum projects

Education: B.Tech IT, NIT Warangal (2020)`,
    jobDescription: `Smart Contract Engineer — Web3 Innovators

Join our core engineering team to build secure and efficient smart contracts for a next-generation decentralized exchange (DEX).

Requirements:
• 2+ years of professional experience writing smart contracts in Solidity
• Deep understanding of the EVM, gas optimization, and smart contract security vulnerabilities (e.g., reentrancy)
• Experience with testing frameworks like Hardhat or Foundry
• Familiarity with Web3 frontend integration (Ethers.js/Web3.js)
• Prior experience taking a protocol to mainnet is highly preferred

Bonus:
• Understanding of Zero-Knowledge proofs
• Contributions to prominent Web3 open-source projects`,
  },
  {
    role: "Writer",
    resume: `Detail-oriented Technical Writer capable of translating complex engineering concepts into accessible, engaging documentation.

Skills: Technical Documentation, Markdown, Git, API Documentation (Swagger/OpenAPI), Developer Portals, Agile Methodologies

Experience:
• Senior Technical Writer at CloudBase (2021–present)
  - Authored comprehensive API reference guides used by 10,000+ third-party developers
  - Established a docs-as-code workflow utilizing GitHub and static site generators (Docusaurus)
  - Collaborated directly with engineering and product teams to document new features pre-release

• Content Writer at TechBlog Media (2018–2021)
  - Wrote 150+ in-depth technical blogs focusing on cloud computing and DevOps
  - Edited and proofread articles for technical accuracy

Education: MA English Literature, St. Xavier's College (2018)`,
    jobDescription: `Technical Writer — Developer Platform

We need an exceptional Technical Writer who will own our external developer documentation. If you love taking complex developer experiences and making them intuitive through words, we want you.

Responsibilities:
• Create clear, accurate, and structured documentation for our APIs and SDKs
• Build step-by-step tutorials and integration guides
• Maintain and improve our developer portal using a docs-as-code approach
• Work aggressively alongside product launches to ensure docs are ready

Requirements:
• 3+ years experience as a Technical Writer in a software/SaaS environment
• Strong grasp of API structures and the ability to test them via tools like Postman
• Proficiency in Markdown, Git, and HTML/CSS
• A portfolio of previous documentation work demonstrating clarity and structure`,
  }
];
