# AI-Assisted Legacy SQL to PostgreSQL Migration

**Research date**: 2026-09-22  
**Purpose**: Citation-ready evidence that AI can materially accelerate the migration of old, logic-heavy SQL databases to PostgreSQL.

## Executive takeaway

There is credible production evidence for AI-assisted legacy database migration to PostgreSQL. The defensible claim is not that an LLM autonomously migrates a mission-critical database. AI accelerates discovery, dead-code identification, SQL and stored-procedure translation, documentation, and test generation inside a conventional migration process with deterministic validation, reconciliation, human review, and controlled cutover.

## Strongest direct evidence

### Arborgold: SQL Server to Aurora PostgreSQL

Arborgold had a SQL Server estate more than ten years old, spread across five database clusters and containing 2,500 stored procedures. Caylent used a Claude-based agent system to inventory the estate, classify database objects, identify dead code, translate active procedures, and validate each conversion with a guardrail agent.

Reported results:

- 1,850 of 2,500 stored procedures were identified as unused.
- The estimated manual effort was 2,600 engineering hours.
- The migration took approximately 220 hours, a reported 90% reduction.
- Active procedures were translated 66% faster than with the general-purpose AI tools previously tested.
- Projected database costs fell 77%.

This is the closest published comparison to a large, old SQL Server estate with extensive accumulated business logic.

**Source**: [Anthropic and Caylent customer story](https://claude.com/customers/caylent?s=03)

### Large Swiss bank: Oracle and SQL Server to PostgreSQL

Infosys reports deploying its AI-assisted iDM platform in a program covering more than 1,000 databases at a large Swiss bank. More than 200 databases had been migrated at publication time. The program included Oracle-to-PostgreSQL and SQL Server-to-PostgreSQL conversions, tables as large as approximately 400 GB, automated reconciliation, and generated test cases.

The platform combines generative AI with Ora2Pg, SQLines, Apache NiFi, schema and data reconciliation, and human oversight. Infosys reports a 20% reduction in FTE requirements and a 15% reduction in operating cost. The bank is unnamed, so this evidence should be described as vendor-reported rather than independently verified.

**Source**: [Infosys iDM case study PDF](https://www.infosys.com/services/incubating-emerging-technologies/documents/generative-ai-based-solution.pdf)

### Public housing organization: private Llama migration

Resource Data documented a public housing organization in Alaska using Llama 3.1 on local hardware to migrate critical Microsoft SQL Server databases to PostgreSQL. The system translated tables, views, stored procedures, and triggers in iterative batches. Engineers reviewed and corrected inconsistencies before acceptance.

Resource Data says the pilot reduced work expected to take months to days while keeping sensitive citizen data inside private networks. The organization planned to expand the approach to nearly 80 databases.

**Source**: [Resource Data case study](https://www.resourcedata.com/insight/ai-driven-migration-enables-rapid-database-migration/)

### Datadog: critical production storage redesign

Datadog used Claude and Cursor while migrating its Stream Router storage layer from FoundationDB to PostgreSQL and DuckDB. Humans designed the new relational architecture. AI accelerated method-by-method implementation against a new storage interface.

Safety depended on three controls: comprehensive end-to-end tests, parallel blue-green infrastructure, and a validator continuously comparing old and new routing behavior. Datadog reports a production cutover without incident, a 90% reduction in database costs, and some operations improving from an estimated 45 minutes to approximately one second.

This is not a SQL Server migration, but it is a strong engineering account of AI-assisted migration around a critical live production system.

**Source**: [Datadog engineering case study](https://www.datadoghq.com/blog/engineering/ai-assisted-storage-migration/)

## Supporting platform and research evidence

### AWS DMS Schema Conversion

AWS offers generative-AI conversion for commercial database engines, including Microsoft SQL Server and Oracle, targeting Aurora PostgreSQL and RDS for PostgreSQL. AWS says the capability can convert up to 90% of a schema, including difficult stored procedures, functions, and triggers.

AWS's reference architecture uses conventional DMS Schema Conversion first, then Claude for objects that remain incomplete. Generated objects are deployed into a PostgreSQL test environment and subjected to automated validation. AWS reports that generative AI improves conversion rates by 5–10 percentage points and converts an additional 15–20% of previously unconverted code.

**Sources**:

- [AWS DMS generative AI announcement](https://aws.amazon.com/about-aws/whats-new/2024/12/aws-dms-schema-conversion-generative-ai/)
- [AWS Oracle PL/SQL-to-PostgreSQL implementation](https://aws.amazon.com/blogs/database/automate-oracle-pl-sql-to-postgresql-migration-with-amazon-bedrock-and-strands-agents/)

### Hybrid migration research

The Horizon system described in the VLDB proceedings uses a hybrid workflow: a rule-based converter handles what it can, an LLM repairs unconverted portions, deterministic parsers and database compilation detect errors, tests provide feedback, and a human reviews the final candidate. This supports the production pattern seen in the case studies: AI augments established migration tooling rather than replacing it.

**Source**: [VLDB Horizon paper](https://www.vldb.org/pvldb/vol18/p5259-emani.pdf)

## What AI is demonstrably useful for

- Inventorying tables, views, procedures, functions, triggers, jobs, and dependencies
- Identifying dead or unreachable database logic before paying to migrate it
- Explaining undocumented stored procedures and implicit business rules
- Translating T-SQL or PL/SQL into PostgreSQL and PL/pgSQL
- Generating migration scripts, compatibility views, and documentation
- Producing characterization tests based on existing behavior
- Comparing query results, execution plans, and expected invariants
- Prioritizing exceptions that require a database engineer or domain expert

## What should remain deterministic and human-controlled

- Bulk data transfer and change-data capture
- Financial, operational, and row-level reconciliation
- Decisions about which business behavior can be removed
- Transaction, locking, isolation, and concurrency semantics
- Performance acceptance criteria
- Security and access-control translation
- Cutover, rollback, and disaster-recovery procedures
- Final acceptance of translated business logic

## Recommended internal framing

Use this claim with colleagues:

> AI can reverse-engineer and translate twenty years of undocumented database behavior, while conventional migration infrastructure proves that the new PostgreSQL system behaves correctly.

Avoid claiming that AI will independently migrate the database. The strongest evidence supports a hybrid program in which AI does the high-volume reasoning and translation work, while deterministic systems and experts provide proof.

## Practical pilot

Before committing to the full migration, select one bounded but representative domain containing tables, stored procedures, triggers, messy historical data, and known business invariants. Run an AI-assisted assessment that produces:

1. A complete object and dependency inventory
2. Active-versus-dead-code classification using workload evidence
3. PostgreSQL translations for the active objects
4. Characterization and reconciliation tests
5. An exception report showing what required human correction
6. A measured comparison of manual hours, AI-assisted hours, conversion accuracy, and unresolved risk

That pilot creates company-specific social proof and a defensible estimate for the larger program.

## Evidence-quality note

Most quantified results are published by AI vendors, consultancies, or cloud providers. They are useful social proof, but should not be treated as independent audits. Datadog provides the most technically transparent engineering account. Arborgold is the closest direct business comparison. The Infosys story provides the strongest scale claim.

