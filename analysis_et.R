suppressMessages(library(lme4))
suppressMessages(library(car))
suppressMessages(library(emmeans))

# Collect report header
timestamp_utc <- format(Sys.time(), tz = "UTC", usetz = TRUE)
all_lines <- c(
    "Linear mixed-effects model comparisons",
    paste0("Generated: ", timestamp_utc)
)

# Import the results dataset
df <- read.csv("./et_data.csv")

# Set factor levels in the desired order
df$condition    <- factor(df$condition,    levels = c("exclusive", "focus", "contrastive"))
df$chosen_type  <- factor(df$chosen_type,  levels = c("A", "B"))
df$item         <- factor(df$item)
df$participant  <- factor(df$participant)

# Secific order for 'combined':
df$combined <- factor(df$combined, levels = c("exclusive_A","exclusive_B","focus_A","focus_B","contrastive_A","contrastive_B"))

# Define metrics to evaluate (numeric only)
metrics <- c("total_dwell", "ffd", "fixation_total", "transitions")

# Iterate through each metric, log transform, fit models, and record outputs
for (metric in metrics) {
    if (!metric %in% names(df)) {
        all_lines <- c(all_lines, "", paste0("====== Metric: ", metric, " ======"),
                       paste0("[ERROR] Missing column '", metric, "' in results.csv"))
        next
    }

    response <- df[[metric]]

    # Keep raw values
    df$ET_raw <- as.numeric(response)

    # Log transform (base e). (Use log1p to allow zeros.)
    df$ET <- log1p(df$ET_raw)

    # Fit models
    model1 <- lmer(ET ~ condition + (1|item) + (1|participant), df, REML = FALSE)
    model2 <- lmer(ET ~ condition + chosen_type:condition + (1|item) + (1|participant), df, REML = FALSE)
    model3 <- lmer(ET ~ condition + chosen_type + (1|item) + (1|participant), df, REML = FALSE)
    
    model4 <- lmer(ET ~ chosen_type + (1|item) + (1|participant), df, REML = FALSE)
    model5 <- lmer(ET ~ combined + (1|item) + (1|participant), df, REML = FALSE)

    # Anovas
    aov1_lines <- capture.output(car::Anova(model1, type = "III"))
    aov2_lines <- capture.output(car::Anova(model2, type = "III"))
    aov3_lines <- capture.output(car::Anova(model3, type = "III"))
    aov4_lines <- capture.output(car::Anova(model4, type = "III"))
    aov5_lines <- capture.output(car::Anova(model5, type = "III"))

    # Emmeans
    emmeans(model4, list(pairwise ~ chosen_type), adjust = "tukey")
    emmeans(model5, list(pairwise ~ combined), adjust = "tukey")

    emmeans4_lines <- capture.output(emmeans(model4, list(pairwise ~ chosen_type), adjust = "tukey"))
    emmeans5_lines <- capture.output(emmeans(model5, list(pairwise ~ combined), adjust = "tukey"))

    # Compare models 1, 2, and 3
    model_comp <- anova(model1, model2, model3)
    comp_lines <- capture.output(print(model_comp))

    # Report
    report <- c(
        "",
        paste0("============================================="),
        paste0("============ Metric: ", metric, " ============"),
        paste0("============================================="),
        paste0(""),
        "",
        paste0("---------------------------------------------"),
        paste0("------ Model 1 Summary [", metric, "]: ------"),
        paste0("---------------------------------------------"),
        capture.output(summary(model1)),
        "",
        paste0("----------------------------------------------------"),
        paste0("------ Type III Anova (Model 1) [", metric, "] ------"),
        paste0("----------------------------------------------------"),
        aov1_lines,
        "",
        paste0("---------------------------------------------"),
        paste0("------ Model 2 Summary [", metric, "]: ------"),
        paste0("---------------------------------------------"),
        capture.output(summary(model2)),
        "",
        paste0("----------------------------------------------------"),
        paste0("--- Type III Anova (Model 2) [", metric, "] ---"),
        paste0("----------------------------------------------------"),
        aov2_lines,
        "",
        paste0("---------------------------------------------"),
        paste0("------ Model 3 Summary [", metric, "]: ------"),
        paste0("---------------------------------------------"),
        capture.output(summary(model3)),
        "",
        paste0("----------------------------------------------------"),
        paste0("------ Type III Anova (Model 3) [", metric, "] ------"),
        paste0("----------------------------------------------------"),
        aov3_lines,
        "",
        paste0("---------------------------------------------"),
        paste0("------ Model 4 Summary [", metric, "]: ------"),
        paste0("---------------------------------------------"),
        capture.output(summary(model4)),
        "",
        paste0("----------------------------------------------------"),
        paste0("------ Type III Anova (Model 4) [", metric, "] ------"),
        paste0("----------------------------------------------------"),
        aov4_lines,
        "",
        paste0("---------------------------------------------"),
        paste0("------ Model 5 Summary [", metric, "]: ------"),
        paste0("---------------------------------------------"),
        capture.output(summary(model5)),
        "",
        paste0("----------------------------------------------------"),
        paste0("------ Type III Anova (Model 5) [", metric, "] ------"),
        paste0("----------------------------------------------------"),
        aov5_lines,
        "",
        paste0("----------------------------------------------------"),
        paste0("------ Model Comparison (1, 2, 3) (Likelihood-ratio tests) [", metric, "] ------"),
        paste0("----------------------------------------------------"),
        comp_lines,
        "",
        paste0("----------------------------------------------------"),
        paste0("------ Model 4 Summary (chosen_type) [", metric, "]: ------"),
        capture.output(summary(model4)),
        "",
        paste0("----------------------------------------------------"),
        paste0("Emmeans (model 4) [", metric, "]:"),
        emmeans4_lines,
        "",
        paste0("----------------------------------------------------"),
        paste0("------ Model 5 Summary (combined new variable) [", metric, "]: ------"),
        paste0("---------------------------------------------"),
        capture.output(summary(model5)),
        "",
        paste0("----------------------------------------------------"),
        paste0("Emmeans (model 5) [", metric, "]:"),
        paste0("---------------------------------------------"),
        emmeans5_lines,
        "",
        paste0("________________________________________________________________________________")
    )
    all_lines <- c(all_lines, report)
}

# Write the compiled report to disk
writeLines(all_lines, "results_et.txt")

########################################