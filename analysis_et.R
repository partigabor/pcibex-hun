# Load required libraries (quietly suppressing warnings/messages)
suppressMessages(library(lme4))
suppressMessages(library(car))

# Import the results dataset
df <- read.csv("./et_data.csv")

# Define metrics to evaluate (numeric only)
metrics <- c("total_dwell", "ffd", "fixation_total", "transitions")

# Collect report header
timestamp_utc <- format(Sys.time(), tz = "UTC", usetz = TRUE)
all_lines <- c(
    "Linear mixed-effects model comparisons",
    paste0("Generated: ", timestamp_utc)
)

# Iterate through each metric, fit models, and record outputs
for (metric in metrics) {
    # Create ET response (numeric for lmer; convert factors as needed)
    if (!metric %in% names(df)) {
        all_lines <- c(all_lines, "", paste0("====== Metric: ", metric, " ======"),
                       paste0("[ERROR] Missing column '", metric, "' in results.csv"))
        next
    }

    response <- df[[metric]]

    # Numeric responses
    df$ET <- as.numeric(response)

    model1 <- lmer(ET ~ condition + (condition | item) + (condition | participant), df, REML = FALSE)
    model2 <- lmer(ET ~ condition + chosen_type:condition + (condition | item) + (condition | participant), df, REML = FALSE)
    model3 <- lmer(ET ~ condition + chosen_type + (condition | item) + (condition | participant), df, REML = FALSE)

    aov1_lines <- capture.output(car::Anova(model1, type = "III"))
    aov2_lines <- capture.output(car::Anova(model2, type = "III"))
    aov3_lines <- capture.output(car::Anova(model3, type = "III"))
    model_comp <- anova(model1, model2, model3)
    comp_lines <- capture.output(print(model_comp))

    section <- c(
        "",
        paste0("============================================="),
        paste0("============ Metric: ", metric, " ============"),
        paste0("============================================="),
        paste0(""),

        paste0("---------------------------------------------"),
        paste0("Model 1 Summary [", metric, "]:"),
        capture.output(summary(model1)),

        paste0("----------------------------------------------------"),
        paste0("------ Type III Anova (Model 1) [", metric, "] ------"),
        paste0("----------------------------------------------------"),
        aov1_lines,
        "",
        paste0("---------------------------------------------"),
        paste0("Model 2 Summary [", metric, "]:"),
        capture.output(summary(model2)),

        paste0("----------------------------------------------------"),
        paste0("--- Type III Anova (Model 2) [", metric, "] ---"),
        paste0("----------------------------------------------------"),
        aov2_lines,
        "",
        paste0("---------------------------------------------"),
        paste0("Model 3 Summary [", metric, "]:"),
        capture.output(summary(model3)),

        paste0("----------------------------------------------------"),
        paste0("------ Type III Anova (Model 3) [", metric, "] ------"),
        paste0("----------------------------------------------------"),
        aov3_lines,
        "",
        paste0("----------------------------------------------------"),
        paste0("=== Model Comparison (Likelihood-ratio tests) [", metric, "]"),
        paste0("----------------------------------------------------"),
        comp_lines,
        paste0("________________________________________________________________________________")
    )

    all_lines <- c(all_lines, section)
}

# Write the compiled report to disk
writeLines(all_lines, "results_et.txt")

########################################