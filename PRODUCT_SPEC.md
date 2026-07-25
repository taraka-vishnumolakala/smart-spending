# Smart Spending

Product and technical specification  
Status: Draft for product review  
Primary interface: Single-page spending workspace  
AI experience: Spending Assistant

## 1. Product summary

Smart Spending is a privacy-first personal finance application that converts uploaded bank and credit-card statements into a categorized, searchable spending history.

The product is designed around minimal human input:

1. The user uploads one or more PDF or CSV statements.
2. Smart Spending extracts and normalizes transactions.
3. Transactions are categorized automatically.
4. The dashboard immediately presents totals, charts, trends, and notable changes.
5. The user can filter the data or ask Spending Assistant questions in natural language.

Manual correction is available but is not required to reach the primary dashboard.

### Project learning objective

Smart Spending is also an AI-engineering learning project. The implementation should expose the important parts of a production-quality local AI stack rather than hiding them behind a single model call.

The project intentionally includes:

- Local model serving with Ollama.
- LangChain model, embedding, structured-output, and tool-calling integrations.
- Deterministic rules and fuzzy matching as non-AI baselines.
- Vector embeddings and semantic retrieval.
- Closed-schema LLM classification.
- Tool-grounded conversational analytics.
- Evaluation datasets, confidence measurement, and regression testing.
- Privacy, prompt-injection defenses, timeouts, fallbacks, and observability.

Educational breadth does not justify putting an LLM in deterministic workflows. Each AI component must have a measurable purpose and a simpler baseline for comparison.

### Product promise

> Upload your statements. Understand your spending.

### Product principles

- Automatic by default.
- Explain uncertainty without blocking the user.
- Perform arithmetic deterministically, never through an LLM.
- Keep financial information local whenever practical.
- Make every insight traceable to underlying transactions.
- Prefer one clear workspace over deep navigation.
- Treat corrections as durable learning signals.

## 2. Goals and success criteria

### MVP goals

- Import transactions from text-based and scanned PDF statements.
- Support multiple bank and credit-card accounts.
- Automatically identify dates, descriptions, merchants, debits, credits, and currencies.
- Automatically categorize at least 90% of ordinary consumer transactions without user input.
- Detect transfers, payments, refunds, income, and recurring charges.
- Present all analytics, filters, transactions, and chat on one page.
- Answer common spending questions using the user’s filtered transaction data.
- Allow optional correction of categories and merchants.
- Build and evaluate an end-to-end local AI-engineering stack.

### AI-engineering learning goals

- Understand how LangChain connects application services to locally served models.
- Compare exact rules, fuzzy matching, embeddings, and generative classification on the same labeled dataset.
- Learn when semantic retrieval improves categorization and when it does not.
- Enforce structured model output with Pydantic schemas.
- Build an assistant that uses constrained tools rather than guessing financial totals.
- Measure model quality, latency, confidence calibration, and failure modes.
- Keep model-provider details behind replaceable interfaces without over-abstracting the first implementation.

### Success metrics

- At least 95% transaction-row extraction accuracy on supported statement templates.
- At least 90% category accuracy without manual input.
- At least 98% accuracy for transaction amounts and debit/credit direction.
- At least 90% of uploaded statements reach a usable dashboard without intervention.
- Median processing time below 30 seconds for a 10-page text-based statement.
- Median processing time below 90 seconds for a 10-page scanned statement.
- Fewer than 5% of transactions marked low confidence after repeated use.
- Zero silent arithmetic discrepancies when statement totals permit reconciliation.

### Non-goals for the MVP

- Connecting directly to bank accounts.
- Initiating transfers or payments.
- Investment portfolio tracking.
- Credit-score monitoring.
- Tax filing or formal tax advice.
- Debt underwriting or lending decisions.
- Automatic movement of money.
- Real-time market data.
- Multi-user household collaboration.
- Native iOS or Android applications.

## 3. Target user

### Primary user

A privacy-conscious consumer who holds accounts at multiple institutions and wants a consolidated view without giving a third-party service permanent bank access.

### Primary jobs to be done

- “Show me where my money went this month.”
- “Combine spending across all my accounts.”
- “Help me identify categories I can reduce.”
- “Find subscriptions and repeated charges.”
- “Explain why spending changed.”
- “Let me find a transaction quickly.”

### User assumptions

- The user can download statements from their financial institutions.
- The user may upload PDFs from different banks with inconsistent layouts.
- The user does not want to configure a budget or taxonomy before seeing value.
- The user may never correct uncertain transactions.

## 4. Information architecture

The MVP uses one primary route:

`/dashboard`

The page contains:

1. Global header.
2. Filter bar.
3. Summary metrics.
4. Spending trend chart.
5. Category breakdown.
6. Automatic analysis cards.
7. Filterable transactions table.
8. Persistent Spending Assistant panel.

Statement upload appears as a modal or drop zone, not a separate navigation destination.

Account and application settings can be introduced later without changing the main workflow.

## 5. Single-page dashboard specification

### 5.1 Header

Required elements:

- Smart Spending name and mark.
- Local-model status.
- Add statement action.
- Export action.
- User/profile menu when authentication is added.

Add statement opens a modal that accepts PDF and CSV files.

### 5.2 Filters

Filters apply simultaneously to metrics, charts, insights, table rows, and Spending Assistant context.

Required filters:

- Date range.
- Account.
- Category.
- Merchant/description search.

Later filters:

- Amount range.
- Transaction type.
- Recurring only.
- Confidence.
- Include/exclude transfers.

Filter state should be reflected in the URL query string so a view can be bookmarked.

### 5.3 Summary metrics

Required cards:

- Total spending.
- Income.
- Net saved.
- Recurring expenses.

Rules:

- Transfers between owned accounts do not count as spending or income.
- Credit-card payments do not count as spending if the underlying charges are present.
- Refunds reduce the related category’s spending.
- Metrics always use decimal arithmetic and the selected currency.
- Comparison percentages state the comparison period.

### 5.4 Spending trend

Default visualization:

- Cumulative daily spending for the selected month.
- Comparison with the immediately preceding equivalent period.
- Hover or keyboard focus reveals date and exact totals.

For longer date ranges, aggregate by week or month.

### 5.5 Category breakdown

Display:

- Donut or horizontal-bar breakdown.
- Category name.
- Amount.
- Percentage of filtered spending.

Selecting a category filters the entire workspace.

Default MVP taxonomy:

- Dining.
- Groceries.
- Shopping.
- Transportation.
- Housing.
- Utilities and bills.
- Health.
- Entertainment.
- Travel.
- Subscriptions.
- Education.
- Personal care.
- Fees and interest.
- Gifts and donations.
- Cash withdrawal.
- Transfers.
- Income.
- Refunds.
- Other.

The presentation taxonomy can group detailed internal categories into simpler parent categories.

### 5.6 Automatic analysis

The application generates deterministic candidate insights, then uses the local model only to explain selected findings.

MVP insight types:

- Category increased or decreased significantly.
- Merchant caused a notable change.
- New recurring expense.
- Subscription price increase.
- Potentially overlapping subscriptions.
- Unusual transaction relative to the user’s history.
- High-frequency small purchases.
- Savings opportunity based on discretionary spending.

Every insight must:

- Name the relevant period.
- Include the supporting amount or percentage.
- Link to the relevant filtered transactions.
- Avoid unsupported claims.

### 5.7 Transactions table

Required columns:

- Posting date.
- Normalized merchant.
- Category.
- Account.
- Classification confidence.
- Signed amount.

Optional expandable details:

- Raw statement description.
- Transaction date.
- Statement source.
- Currency.
- Categorization reason.
- Whether web lookup was used.
- Recurring-series membership.

Required actions:

- Search.
- Filter.
- Sort.
- Open transaction details.
- Correct merchant.
- Correct category.
- Mark as transfer.
- Split transaction in a later release.

Corrections should not interrupt the initial import flow.

### 5.8 Spending Assistant

The assistant is persistent on desktop and appears below analytics or in a drawer on smaller screens.

It inherits all active dashboard filters.

Example questions:

- “How can I save $300 next month?”
- “Why did shopping increase?”
- “What subscriptions can I cancel?”
- “How much did I spend on restaurants in July?”
- “Compare groceries across the last six months.”
- “Show purchases over $100.”

The assistant must use constrained analytics tools. It must not generate arbitrary database queries or calculate totals from raw text.

Required internal tools:

- `get_spending_total(filters)`
- `get_income_total(filters)`
- `get_category_breakdown(filters)`
- `get_period_comparison(filters, comparison_period)`
- `get_top_merchants(filters, limit)`
- `get_recurring_transactions(filters)`
- `search_transactions(filters, query)`
- `get_savings_opportunities(filters, target_amount)`

Every quantitative response must be produced from a tool result.

The assistant should cite underlying transactions or offer a “Show transactions” action when appropriate.

## 6. Visual design system and color theme

### 6.1 Theme direction

The default theme is calm, trustworthy, and optimistic. It avoids the visual language of trading platforms, cryptocurrency products, and traditional bank portals.

Design characteristics:

- Warm white canvas rather than stark white.
- Deep navy text rather than pure black.
- Muted cyan, matching the reference decision-canvas page, as the primary interactive color.
- Green remains reserved for positive financial status and chart/category data.
- Teal, amber, coral, blue, and violet for category differentiation.
- Subtle borders and shadows.
- Rounded cards with generous spacing.
- Color supports meaning but never carries meaning alone.

### 6.2 Core light-theme palette

| Token | Hex | Intended use |
|---|---:|---|
| `navy-950` | `#071B35` | Primary headings, high-emphasis text, dark buttons |
| `navy-900` | `#0B2342` | Secondary dark surfaces |
| `navy-700` | `#29415F` | Body text with medium emphasis |
| `navy-500` | `#61718A` | Secondary labels and supporting copy |
| `navy-300` | `#AEB8C6` | Previous-period chart lines and disabled elements |
| `navy-150` | `#DBE1E8` | Strong input and control borders |
| `navy-100` | `#E8EDF2` | Card borders, separators, and chart gridlines |
| `canvas` | `#FBFCFA` | Application background |
| `surface` | `#FFFFFF` | Cards, header, assistant panel, menus |
| `surface-soft` | `#F5F8F6` | Table headers, hover states, muted panels |
| `accent` | `#0E8493` | Brand mark, primary buttons, active controls, assistant chrome |
| `accent-hover` | `#0B6F7B` | Hover and pressed state for primary controls |
| `accent-soft` | `#E2F3F4` | Selected-state, badge, and icon backgrounds |
| `accent-border` | `#ADD8DC` | Cyan control and suggestion borders |
| `green-700` | `#047A52` | Positive financial status and high-confidence text |
| `green-600` | `#079667` | Current-period chart line |
| `green-500` | `#16AA79` | Positive data and primary category accent |
| `green-100` | `#DDF4E9` | Positive, confidence, and category backgrounds |
| `teal-500` | `#38AEBA` | Groceries and secondary chart series |
| `teal-100` | `#DEF4F5` | Teal category-chip background |
| `amber-500` | `#E79512` | Warnings, shopping, processing |
| `amber-100` | `#FFF3D8` | Warning and medium-confidence backgrounds |
| `coral-500` | `#F16C61` | Transportation and negative-change accents |
| `coral-100` | `#FFE7E3` | Coral chip and alert backgrounds |
| `blue-500` | `#4E98D9` | Bills and utilities |
| `blue-100` | `#E5F1FB` | Blue category-chip background |
| `violet-500` | `#8F7CCF` | Entertainment and recurring items |
| `violet-100` | `#EEE9FA` | Violet category-chip background |

### 6.3 Semantic color tokens

Components should reference semantic tokens rather than hard-coded colors.

| Semantic token | Light-theme value | Usage |
|---|---:|---|
| `background-app` | `#FBFCFA` | Main page canvas |
| `background-surface` | `#FFFFFF` | Cards and panels |
| `background-muted` | `#F5F8F6` | Secondary surfaces |
| `text-primary` | `#071B35` | Primary content |
| `text-secondary` | `#61718A` | Supporting content |
| `border-default` | `#E8EDF2` | Cards and dividers |
| `border-control` | `#DBE1E8` | Inputs and buttons |
| `action-primary` | `#0E8493` | Primary actions |
| `action-primary-hover` | `#0B6F7B` | Hover and pressed states |
| `action-primary-soft` | `#E2F3F4` | Soft active and assistant states |
| `focus-ring` | `rgba(14, 132, 147, 0.30)` | Keyboard focus |
| `status-positive` | `#047A52` | Savings and favorable changes |
| `status-warning` | `#995E00` | Medium confidence and review states |
| `status-negative` | `#AD3E35` | Unfavorable changes and destructive warnings |
| `status-info` | `#2D6D9F` | Informational states |

### 6.4 Category color mapping

The same category uses the same color in charts, filters, table chips, and assistant citations.

| Category | Primary color | Soft background |
|---|---:|---:|
| Dining | `#16AA79` | `#DDF4E9` |
| Groceries | `#38AEBA` | `#DEF4F5` |
| Shopping | `#E79512` | `#FFF3D8` |
| Transportation | `#F16C61` | `#FFE7E3` |
| Housing | `#426B8D` | `#E8F0F6` |
| Utilities and bills | `#4E98D9` | `#E5F1FB` |
| Health | `#D45D87` | `#FAE6ED` |
| Entertainment | `#8F7CCF` | `#EEE9FA` |
| Travel | `#4E7BC7` | `#E7EEFA` |
| Subscriptions | `#7561B7` | `#ECE8F7` |
| Education | `#2C8A73` | `#E0F2ED` |
| Personal care | `#C46E9C` | `#F7E8F0` |
| Fees and interest | `#C65A50` | `#F9E5E2` |
| Gifts and donations | `#B97832` | `#F7ECDD` |
| Cash withdrawal | `#67768A` | `#E9EDF1` |
| Transfers | `#61718A` | `#E8EDF2` |
| Income | `#079667` | `#DDF4E9` |
| Refunds | `#218B76` | `#DFF3EE` |
| Other | `#7D8794` | `#ECEFF2` |

Category colors must not imply that normal spending is an error. Coral and amber may be used as category colors without a warning icon; warning meaning requires both a semantic label and an icon or text.

### 6.5 Confidence colors

| Confidence | Range | Foreground | Background | Treatment |
|---|---:|---:|---:|---|
| High | `0.90–1.00` | `#047A52` | `#DDF4E9` | Green dot plus percentage |
| Medium | `0.70–0.89` | `#995E00` | `#FFF3D8` | Amber dot plus percentage |
| Low | `<0.70` | `#AD3E35` | `#FFE7E3` | Coral dot, percentage, and “Review” text |

### 6.6 Chart color behavior

- Current-period line: `green-600`.
- Previous-period comparison line: `navy-300`.
- Gridlines: `navy-100`.
- Axis labels: `navy-500`.
- Current-period area fill: vertical fade from `rgba(7, 150, 103, 0.18)` to transparent.
- Category charts use the fixed mapping above.
- Selected chart segments gain a dark outline and a text label.
- Unselected segments reduce opacity but remain visible.
- Tooltips use `navy-950` with white text.
- Charts include accessible text summaries and do not depend solely on color.

### 6.7 Surface and elevation

| Token | Value | Usage |
|---|---|---|
| `radius-small` | `8px` | Chips and compact buttons |
| `radius-medium` | `12px` | Inputs and ordinary controls |
| `radius-large` | `16px` | Metric and insight cards |
| `radius-xlarge` | `22px` | Charts, table, assistant panel |
| `shadow-card` | `0 12px 34px rgba(20, 44, 66, 0.07)` | Elevated cards |
| `shadow-control` | `0 7px 16px rgba(14, 132, 147, 0.17)` | Primary button |

Shadows should remain subtle. Borders provide the primary separation between surfaces.

### 6.8 Typography

Lato is the required typeface across the entire Smart Spending website and application. This includes headings, body text, navigation, buttons, filters, form controls, metric values, charts, tables, tooltips, dialogs, and Spending Assistant messages.

Required stack:

```css
font-family:
  Lato,
  ui-sans-serif,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Implementation requirements:

- Use Lato consistently; do not mix it with another display or body typeface.
- Use weight 400 for ordinary body content.
- Use weight 700 for controls, table emphasis, and section headings.
- Use weight 900 sparingly for high-emphasis headings and metrics.
- Use Lato’s tabular-number OpenType feature for monetary values where supported.
- Self-host the required Lato `.woff2` files in production to avoid sending user requests to a third-party font service.
- Use the system fallback stack only while Lato is loading or if the font asset fails.
- The HTML prototype may load Lato from Google Fonts for convenient previewing; this does not define the production delivery method.

Suggested scale:

- Page heading: 32–40 px, 700–760 weight.
- Section heading: 18–22 px, 700–750 weight.
- Metric value: 28–34 px, 700–760 weight with tabular numerals.
- Body: 14–16 px.
- Table: 12–14 px.
- Labels and metadata: 10–12 px.

All monetary values use tabular numerals.

### 6.9 Dark theme

A dark theme is not required for the MVP. When introduced, it must be designed as a complete semantic-token override rather than by inverting colors.

Proposed starting values:

| Semantic token | Dark-theme value |
|---|---:|
| `background-app` | `#071421` |
| `background-surface` | `#0D2033` |
| `background-muted` | `#132A3F` |
| `text-primary` | `#F4F7F9` |
| `text-secondary` | `#AAB7C6` |
| `border-default` | `#20394F` |
| `border-control` | `#2A465D` |
| `action-primary` | `#5CC5CE` |
| `action-primary-hover` | `#8FC1DF` |

Category colors may need slightly higher lightness in dark mode. Contrast must be tested independently.

### 6.10 Accessibility requirements

- Normal text must meet WCAG 2.2 AA contrast of at least 4.5:1.
- Large text and meaningful icons must meet at least 3:1.
- Focus indicators must remain visible on every background.
- Status must be communicated through text or iconography in addition to color.
- Adjacent chart segments should have sufficient contrast or visible separation.
- High-contrast mode must preserve table structure and control boundaries.
- Users must be able to distinguish current and previous chart series through line style as well as color.

## 7. Statement ingestion workflow

### 7.1 Upload

Accepted formats:

- PDF.
- CSV.

MVP limits:

- Maximum 25 MB per file.
- Maximum 100 pages per PDF.
- Password-protected files return a clear error.
- Duplicate files are detected through a cryptographic file hash.

### 7.2 Document inspection

The system determines:

- Whether the PDF has an embedded text layer.
- Page count.
- Likely institution.
- Statement period.
- Account type.
- Whether OCR is required.

### 7.3 Extraction order

1. Extract embedded text with PyMuPDF.
2. Apply a supported bank adapter when detected.
3. Use Docling for layout and table reconstruction.
4. Use RapidOCR or Tesseract for scanned pages.
5. Preserve page and bounding-box provenance for every extracted value.

OCR is a fallback, not the default.

### 7.4 Normalization

Normalize:

- Transaction and posting dates.
- Signed amount.
- Debit or credit direction.
- Currency.
- Raw description.
- Merchant candidate.
- Account identifier.
- Statement period.

Use `Decimal` for monetary values.

Remove or tokenize:

- Terminal identifiers.
- Store numbers when they do not disambiguate the merchant.
- Repeated card suffixes.
- Authorization codes.
- Location noise when not required.

Preserve the original text separately for auditability.

### 7.5 Validation

Validation should detect:

- Invalid or impossible dates.
- Missing amounts.
- Duplicate transaction rows.
- Incorrect debit/credit direction.
- Totals that fail statement reconciliation.
- Transactions outside the statement period.
- Header or footer text incorrectly interpreted as transactions.

When a statement provides opening balance, closing balance, payments, and totals, reconcile extracted values before marking processing complete.

### 7.6 Deduplication

Generate a transaction fingerprint from:

- Account.
- Posting date.
- Normalized amount.
- Normalized description.
- Statement source.

Support legitimate same-day duplicates by retaining row order and source location in the fingerprint strategy.

## 8. Categorization system

### 8.1 Decision pipeline

Run the cheapest and most reliable stages first:

1. User correction rule.
2. Exact normalized merchant mapping.
3. High-precision keyword or regular-expression rule.
4. Similarity against confirmed merchant examples.
5. Local LLM classification into the closed taxonomy.
6. Optional merchant web lookup.
7. Best-effort category assignment with confidence.

The user receives a populated dashboard even when confidence is low.

### 8.2 Local model response

The classifier returns validated structured output:

```json
{
  "normalized_merchant": "Trader Joe's",
  "category": "Groceries",
  "subcategory": "Supermarket",
  "confidence": 0.98,
  "reason_code": "KNOWN_MERCHANT"
}
```

The model may select only categories provided in the request schema.

### 8.3 Confidence

Suggested thresholds:

- 0.90–1.00: High confidence; no visual warning.
- 0.70–0.89: Medium confidence; categorized and subtly marked.
- Below 0.70: Low confidence; categorized, marked for optional review, and eligible for fallback lookup.

Confidence should combine:

- Rule strength.
- Merchant-match strength.
- Embedding similarity.
- Model probability or self-consistency.
- Agreement between independent methods.

Do not treat the LLM’s stated confidence as calibrated probability by itself.

### 8.4 Learning from corrections

A correction creates:

- A user-specific merchant rule.
- A confirmed training example.
- An audit event containing old value, new value, and timestamp.

User-specific rules override shared mappings.

### 8.5 Web lookup

Use SearXNG as an optional, low-confidence fallback.

Allowed query fields:

- Normalized merchant candidate.
- Coarse location when present.
- General business-type terms.

Never send:

- Account numbers.
- Full raw statement lines.
- Transaction amounts.
- User names.
- Unrelated nearby transactions.

Cache sanitized merchant results.

## 9. Recurring transaction detection

Recurring detection considers:

- Normalized merchant.
- Amount range.
- Interval regularity.
- Account.
- Category.

Suggested series:

- Weekly.
- Biweekly.
- Monthly.
- Quarterly.
- Annual.

The system should distinguish:

- Fixed subscriptions.
- Variable utility bills.
- Paychecks.
- Transfers.

## 10. Local AI stack

### 10.1 Required implementation decision

The MVP uses the following local, open-source AI stack:

| Responsibility | Model | Ollama identifier | License |
|---|---|---|---|
| Transaction classification, merchant normalization, insight explanations, and Spending Assistant | Qwen3 8B | `qwen3:8b` | Apache 2.0 |
| Merchant similarity and semantic retrieval | Qwen3-Embedding 0.6B | `qwen3-embedding:0.6b` | Apache 2.0 |

These are the default and required MVP models. They may be made configurable later, but the initial implementation and evaluation fixtures must target these exact identifiers.

The MVP does not use a vision-language model to read monetary values. PDF text extraction, layout reconstruction, and OCR remain the responsibility of PyMuPDF, Docling, and the configured OCR engine.

### 10.2 Local model runtime

Ollama is the required local inference server.

Ollama:

- Downloads and manages model weights.
- Runs both models locally.
- Exposes the local chat and embedding APIs.
- Handles model loading, quantization, and hardware acceleration.
- Listens on `http://localhost:11434` by default.

Initial setup:

```bash
ollama pull qwen3:8b
ollama pull qwen3-embedding:0.6b
ollama serve
```

The backend must check Ollama health and required-model availability at startup. A missing model produces a clear setup error rather than silently switching to a cloud service.

There is no automatic cloud-model fallback. Adding a hosted provider requires a separate product and privacy decision.

### 10.3 Required LangChain packages

The Python backend uses:

```text
langchain
langchain-core
langchain-ollama
```

`langchain-ollama` is the provider integration between LangChain and the local Ollama server.

LangGraph is not required for the MVP. It may be added only if the product later needs durable, resumable, multi-step agent workflows.

### 10.4 LangChain connection to Ollama

Create the chat and embedding clients in one backend module and inject them into the categorization and assistant services.

```python
from langchain_ollama import ChatOllama, OllamaEmbeddings

chat_model = ChatOllama(
    model="qwen3:8b",
    base_url="http://localhost:11434",
    temperature=0,
    num_ctx=16384,
)

embedding_model = OllamaEmbeddings(
    model="qwen3-embedding:0.6b",
    base_url="http://localhost:11434",
)
```

The values must be configurable without code changes:

```text
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=qwen3:8b
OLLAMA_EMBEDDING_MODEL=qwen3-embedding:0.6b
```

The application should not construct model clients inside HTTP route handlers. The clients are long-lived application services so connections and loaded models can be reused.

### 10.5 How LangChain is used

LangChain is required for:

- Connecting FastAPI services to Ollama through `ChatOllama`.
- Connecting merchant-similarity services through `OllamaEmbeddings`.
- Constructing prompt templates.
- Enforcing Pydantic structured output for classification.
- Defining the Spending Assistant’s constrained analytics tools.
- Binding those tools to the chat model.
- Streaming assistant responses to the frontend.
- Applying timeouts, retry limits, and model-call tracing hooks.

LangChain is not used for:

- PDF parsing.
- OCR.
- Monetary calculations.
- Statement reconciliation.
- Transaction deduplication.
- Rule-based merchant matching.
- Direct or unrestricted SQL generation.
- File access or arbitrary web access.

These operations remain explicit, testable Python services.

### 10.6 Transaction-classification chain

The classification chain receives only the fields it needs:

- Normalized transaction description.
- Optional coarse location.
- Debit or credit direction.
- Closed list of allowed categories.
- A small number of relevant confirmed merchant examples.

It does not receive account numbers, statement balances, unrelated transactions, or other personal information.

The model is wrapped with a Pydantic output schema:

```python
from pydantic import BaseModel, Field


class TransactionClassification(BaseModel):
    normalized_merchant: str
    category: str
    subcategory: str | None = None
    confidence: float = Field(ge=0, le=1)
    reason_code: str


classifier = chat_model.with_structured_output(TransactionClassification)
```

Classification settings:

- Temperature: `0`.
- Batch transactions when practical, while preserving one validated result per input transaction.
- Validate every category against the closed taxonomy.
- Retry malformed structured output once.
- After a second failure, apply the best deterministic fallback and mark the transaction low confidence.
- Do not ask the model to perform arithmetic.

### 10.7 Embedding workflow

`Qwen3-Embedding-0.6B` creates embeddings for:

- Normalized merchant names.
- Confirmed merchant/category examples.
- Sanitized merchant descriptions returned by optional web lookup.

Use cosine similarity to retrieve the most relevant confirmed examples before invoking the classifier.

Embeddings are not required for ordinary numeric transaction questions. Spending Assistant uses deterministic analytics tools for those questions.

The embedding model is deliberately included in the MVP because learning semantic retrieval is a project goal. It must still prove its value through evaluation.

The categorization evaluation should compare:

1. Exact merchant rules only.
2. Exact rules plus RapidFuzz.
3. Exact rules, RapidFuzz, and embedding retrieval.
4. The hybrid pipeline plus Qwen3 classification.

Record accuracy, coverage, latency, and model calls for each stage. If embeddings do not improve the labeled evaluation set, retain the implementation as an experiment but do not place it on the production request path.

Embedding records must include:

- Model identifier.
- Embedding dimension.
- Normalization version.
- Source merchant-rule version.

Changing the embedding model or normalization version requires re-embedding stored examples.

### 10.8 Spending Assistant chain

Spending Assistant uses `ChatOllama` with LangChain tool calling. The model selects from the constrained analytics tools defined in section 5.8.

Required flow:

1. FastAPI receives the user’s message and active dashboard filters.
2. LangChain supplies the model with the allowed tool schemas.
3. Qwen3 selects a relevant analytics tool.
4. The deterministic analytics service executes the tool.
5. The tool returns validated JSON with totals and supporting transaction IDs.
6. Qwen3 explains the result in plain language.
7. The backend streams the response and transaction citations to the frontend.

The model never receives database credentials and never executes SQL directly.

Quantitative answers must be rejected or regenerated when they contain an amount not present in a tool result.

### 10.9 Configuration and failure behavior

Required timeouts:

- Health check: 2 seconds.
- Embedding request: 15 seconds.
- Classification request: 30 seconds.
- Assistant response: 60 seconds.

Required failure states:

- Ollama not running.
- Chat model not downloaded.
- Embedding model not downloaded.
- Model request timed out.
- Structured response invalid.
- Tool call invalid or unsupported.

The UI must distinguish an unavailable assistant from unavailable transaction data. Deterministic dashboard analytics remain usable when the chat model is offline.

### 10.10 Model evaluation

Before release, evaluate the pinned model identifiers against:

- A labeled merchant/category dataset.
- Transfer and credit-card-payment cases.
- Ambiguous merchant descriptions.
- Structured-output conformance.
- Tool-selection accuracy.
- Prompt-injection attempts embedded in transaction descriptions.
- The defined Spending Assistant question set.

Model changes require rerunning this evaluation and recording the results before updating the production default.

## 11. Proposed technical architecture

### Frontend

- React.
- TypeScript.
- Vite.
- TanStack Query.
- Tailwind CSS and shadcn/ui.
- Recharts.

### Backend

- Python 3.12 or later.
- FastAPI.
- Pydantic v2.
- SQLAlchemy 2.
- Alembic.

### Persistence

MVP local mode:

- SQLite.
- Local encrypted file storage or immediate source-file deletion after extraction.

Hosted multi-user mode:

- PostgreSQL.
- Object storage for source statements when retention is enabled.
- Background worker for OCR and classification.

### Document processing

- PyMuPDF.
- Docling.
- RapidOCR or Tesseract.
- Optional macOS OCR backend for local Mac deployments.

### Search

- Self-hosted SearXNG.
- Disabled by default until the user permits external merchant lookup.

### Suggested repository structure

```text
smart-spending/
  frontend/
    src/
      components/
      features/
        dashboard/
        statements/
        transactions/
        assistant/
      api/
      types/
  backend/
    app/
      api/
      models/
      schemas/
      services/
        ingestion/
        extraction/
        categorization/
        analytics/
        assistant/
        ai/
          ollama.py
          prompts.py
          schemas.py
          tools.py
      adapters/
        banks/
      workers/
      tests/
  fixtures/
    sanitized-statements/
  docs/
```

## 12. Core data model

### User

- `id`
- `created_at`
- `locale`
- `default_currency`
- `external_lookup_enabled`

### Account

- `id`
- `user_id`
- `institution`
- `display_name`
- `type`
- `currency`
- `masked_identifier`

Never store a complete card or account number.

### Statement

- `id`
- `user_id`
- `account_id`
- `file_hash`
- `original_filename`
- `period_start`
- `period_end`
- `status`
- `extraction_method`
- `reconciliation_status`
- `created_at`

### Transaction

- `id`
- `user_id`
- `account_id`
- `statement_id`
- `transaction_date`
- `posting_date`
- `description_raw`
- `merchant_normalized`
- `amount`
- `currency`
- `direction`
- `category_id`
- `confidence`
- `classification_source`
- `is_transfer`
- `is_recurring`
- `recurring_series_id`
- `source_page`
- `source_bounds`
- `fingerprint`
- `created_at`
- `updated_at`

### Category

- `id`
- `name`
- `parent_id`
- `display_color`
- `system_defined`

### Merchant rule

- `id`
- `user_id`
- `match_type`
- `match_value`
- `merchant_normalized`
- `category_id`
- `priority`
- `created_at`

### Recurring series

- `id`
- `user_id`
- `merchant_normalized`
- `frequency`
- `expected_amount_min`
- `expected_amount_max`
- `next_expected_date`
- `status`

## 13. API outline

### Statements

- `POST /v1/statements`
- `GET /v1/statements`
- `GET /v1/statements/{statement_id}`
- `DELETE /v1/statements/{statement_id}`
- `GET /v1/statements/{statement_id}/status`

### Transactions

- `GET /v1/transactions`
- `GET /v1/transactions/{transaction_id}`
- `PATCH /v1/transactions/{transaction_id}`
- `POST /v1/transactions/bulk-update`

### Analytics

- `GET /v1/analytics/summary`
- `GET /v1/analytics/trend`
- `GET /v1/analytics/categories`
- `GET /v1/analytics/insights`
- `GET /v1/analytics/recurring`

### Assistant

- `POST /v1/assistant/messages`
- `GET /v1/assistant/conversations/{conversation_id}`

Assistant requests include the active dashboard filter object.

## 14. Processing states

Statement state machine:

```text
uploaded
  → inspecting
  → extracting
  → normalizing
  → validating
  → categorizing
  → ready
```

Terminal error states:

- `unsupported`
- `password_required`
- `extraction_failed`
- `reconciliation_failed`

Reconciliation failure may still produce a reviewable result but must be clearly disclosed.

## 15. Privacy and security

### Data minimization

- Do not require bank credentials.
- Mask account identifiers.
- Avoid storing source PDFs by default after successful extraction.
- Allow the user to retain or delete source files.
- Redact financial content from application logs.
- Never use user transactions for shared model training without explicit consent.

### File safety

- Verify MIME type and file signature.
- Enforce size and page limits.
- Reject embedded executable content where possible.
- Process untrusted documents in an isolated worker.
- Apply OCR timeouts and memory limits.

### AI safety

- Treat statement text and search results as untrusted data.
- Do not allow merchant strings to provide tool instructions.
- Use a closed tool allowlist.
- Do not expose unrestricted SQL, file, shell, or network tools to the assistant.
- Validate every structured model response.

### User-facing guidance

Spending Assistant provides educational budgeting guidance, not regulated financial, tax, investment, or legal advice.

## 16. Accessibility

- Meet WCAG 2.2 AA color contrast.
- Make every filter keyboard accessible.
- Provide text alternatives for charts.
- Never rely on color alone to communicate category or confidence.
- Support 200% zoom.
- Use responsive tables or accessible row cards on small screens.
- Announce processing status and filter result counts.
- Respect reduced-motion preferences.

## 17. Error and empty states

Required states:

- First use with no statements.
- File uploading.
- Processing.
- Partially processed statement.
- Unsupported statement.
- No transactions match filters.
- Assistant unavailable.
- Local model not running.
- Web lookup disabled.
- Duplicate statement.
- Reconciliation warning.

Errors should state:

1. What happened.
2. Whether any data was imported.
3. What the user can do next.

## 18. Testing strategy

### Extraction

- Maintain sanitized statement fixtures for each supported institution and template.
- Assert exact transaction counts, amounts, dates, and debit/credit direction.
- Test text-based and scanned variants.
- Test multi-line descriptions and transactions split across pages.

### Categorization

- Maintain a labeled merchant evaluation set.
- Measure accuracy by category and confidence band.
- Test transfer and payment detection separately.
- Verify that user rules always override lower-priority methods.

### Analytics

- Use fixed fixtures and exact expected decimal totals.
- Test refunds, transfers, duplicate statements, multiple currencies, and partial months.

### Assistant

- Assert that numeric answers originate from analytics tools.
- Test prompt injection embedded in merchant descriptions.
- Test unsupported financial-advice requests.
- Test filtered and unfiltered context.

### Interface

- Keyboard navigation.
- Screen-reader names.
- Responsive layouts.
- Filter synchronization.
- Loading and error states.

## 19. MVP acceptance criteria

The MVP is ready when:

- A user can upload a supported PDF or CSV statement.
- The original file is processed locally or according to a clearly disclosed retention policy.
- Extracted transaction amounts reconcile with the fixture’s expected results.
- Every imported transaction receives a category.
- Low-confidence results do not block the dashboard.
- Corrections persist and apply to future matching transactions.
- Filters update metrics, charts, insights, table rows, and assistant context.
- Transfers and credit-card payments are excluded from spending totals.
- Spending Assistant accurately answers the defined question set.
- Every numeric assistant answer is traceable to a deterministic tool response.
- The backend connects to local Ollama through `langchain-ollama`.
- `qwen3:8b` produces schema-valid transaction classifications.
- `qwen3-embedding:0.6b` produces reusable merchant embeddings.
- The application never silently sends transaction data to a hosted model.
- Deterministic dashboard analytics remain available when Ollama is offline.
- The interface works with keyboard navigation and at common desktop and mobile widths.

## 20. Suggested delivery phases

### Phase 0 — Product validation

- Review the HTML prototype.
- Finalize category taxonomy.
- Confirm the first three supported institutions.
- Collect sanitized sample statements.
- Define statement-retention defaults.

### Phase 1 — Deterministic foundation

- FastAPI service.
- SQLite schema.
- PDF/CSV upload.
- Embedded-text extraction.
- One bank adapter.
- Transaction table and filters.
- Deterministic analytics.

### Phase 2 — Automatic categorization

- Merchant normalization.
- Rules.
- `Qwen3-Embedding-0.6B` through `OllamaEmbeddings`.
- Structured `Qwen3 8B` classifier through `ChatOllama`.
- LangChain prompt, schema, retry, and evaluation tests.
- Confidence system.
- Correction learning.

### Phase 3 — Broader document support

- Docling layout pipeline.
- OCR fallback.
- More bank adapters.
- Reconciliation warnings.
- Background processing.

### Phase 4 — Spending Assistant

- Constrained analytics tools.
- LangChain tool binding through `ChatOllama`.
- Local `qwen3:8b` assistant through Ollama.
- Filter-aware responses.
- Insight generation.
- Transaction citations.

### Phase 5 — Hardening

- Security review.
- Prompt-injection tests.
- Accessibility validation.
- Performance and large-statement testing.
- Optional SearXNG merchant lookup.

## 21. Decisions requiring product review

- Which three institutions should be supported first?
- Should source PDFs be deleted immediately by default?
- Is the first release strictly local and single-user?
- Which category taxonomy should be visible to users?
- Should web lookup be opt-in globally or requested per ambiguous merchant?
- Should low-confidence items show a count, or remain completely invisible unless the user opens details?
- Is CSV import part of the first public milestone or a fast-follow?
