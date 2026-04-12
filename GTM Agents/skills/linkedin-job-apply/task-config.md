# LinkedIn Job Apply — Scheduled Task Configuration

## Task Metadata

| Field | Value |
|---|---|
| **Task ID** | `linkedin-job-apply-daily` |
| **Schedule (cron)** | `0 1 * * *` (1:00 AM CT every day) |
| **Model** | Claude Sonnet 4.6 |
| **Enabled** | Yes |
| **Skill Entry Point** | `GTM Agents/skills/linkedin-job-apply/SKILL.md` |

## MCP Tools Required

| Tool | MCP Server | Purpose |
|---|---|---|
| `gmail_search_messages` | Gmail MCP | Scan LinkedIn job alert emails |
| `gmail_read_message` | Gmail MCP | Read full email body for job listings |
| `mcp__Claude_in_Chrome__navigate` | Chrome MCP | Open LinkedIn job URLs |
| `mcp__Claude_in_Chrome__read_page` | Chrome MCP | Parse job descriptions & confirm states |
| `mcp__Claude_in_Chrome__find` | Chrome MCP | Locate form fields |
| `mcp__Claude_in_Chrome__form_input` | Chrome MCP | Fill text fields, dropdowns, checkboxes |
| `mcp__Claude_in_Chrome__file_upload` | Chrome MCP | Upload resume PDF |
| `mcp__Claude_in_Chrome__left_click` | Chrome MCP | Click buttons (Easy Apply, Next, Submit) |
| `mcp__Claude_in_Chrome__tabs_context_mcp` | Chrome MCP | Manage browser tabs for ATS redirects |

## File Paths

| File | Path |
|---|---|
| Skill Instructions | `GTM Agents/skills/linkedin-job-apply/SKILL.md` |
| Application Data | `GTM Agents/skills/linkedin-job-apply/resume-data.json` |
| Application Log | `GTM Agents/skills/linkedin-job-apply/applied-jobs.json` |
| Cover Letter Template | `GTM Agents/skills/linkedin-job-apply/cover-letter-template.md` |
| Daily Run Logs | `GTM Agents/skills/linkedin-job-apply/run-logs/YYYY-MM-DD.md` |
| Resume PDF | `/Users/jake/Documents/GTM Agents/Jake Webb - AI Sales Resume.pdf` |

## Environment Requirements

- Chrome must be running and Chrome MCP must be connected
- Gmail MCP must have read access to `jakewebb2132@gmail.com`
- Resume PDF must exist at the path specified in `resume_local_path`
- `applied-jobs.json` must be valid JSON at runtime

## Notes

- The task runs silently overnight. Review `run-logs/` each morning for results.
- Jobs marked `needs_manual_review` require Jake to apply manually.
- Deduplication is handled via `job_id` — re-running the task will never double-apply.
- To disable: set Enabled to No or remove the cron schedule.
- To add new job title filters: edit the keyword table in `SKILL.md` Phase 2.
