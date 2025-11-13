# Choice analysis: GLMM for binary choice by condition

suppressMessages(library(lme4))
suppressMessages(library(car))
suppressMessages(library(emmeans))

# Load dataset
df <- read.csv("et_data.csv", stringsAsFactors = FALSE)

# Keep only rows with the variables of interest and valid binary choices
required_cols <- c("chosen_type", "condition", "item", "participant")
missing_cols <- setdiff(required_cols, names(df))
if (length(missing_cols) > 0) {
	stop("Dataset is missing required columns: ", paste(missing_cols, collapse = ", "))
}

df <- subset(df, chosen_type %in% c("A", "B") & !is.na(condition) & !is.na(item) & !is.na(participant))
df$chosen_type <- droplevels(factor(df$chosen_type))
if (nlevels(df$chosen_type) != 2) {
	stop("Expected exactly two choice levels after filtering.")
}
df$chosen_type <- relevel(df$chosen_type, ref = levels(df$chosen_type)[1])
df$condition <- droplevels(factor(df$condition))
df$item <- factor(df$item)
df$participant <- factor(df$participant)

# Fit the specified GLMM (logit link for binary choice)
glmm_formula <- chosen_type ~ condition + (condition | item) + (condition | participant)
model <- glmer(
	glmm_formula,
	data = df,
	family = binomial(link = "logit"),
	control = glmerControl(optimizer = "bobyqa", optCtrl = list(maxfun = 2e5))
)

# Summaries and inferential statistics
anova_lines <- capture.output(car::Anova(model, type = "III"))
emm <- emmeans(model, ~ condition)
emm_logit <- capture.output(emm)
emm_prob <- capture.output(summary(emm, type = "response"))

# Assemble report
timestamp_utc <- format(Sys.time(), tz = "UTC", usetz = TRUE)
report_lines <- c(
	"Generalized linear mixed model for binary choice",
	paste0("Generated: ", timestamp_utc),
	paste0("Formula: ", deparse(glmm_formula)),
	paste0("Observations (n): ", nrow(df)),
	paste0("Participants: ", length(unique(df$participant))),
	paste0("Items: ", length(unique(df$item))),
	"",
	"Model summary:",
	capture.output(summary(model)),
	"",
	"Type III Anova (Wald chi-square):",
	anova_lines,
	"",
	"Estimated marginal means by condition (logit scale):",
	emm_logit,
	"",
	"Estimated marginal means by condition (probability scale):",
	emm_prob
)

writeLines(report_lines, "results_choice.txt")

