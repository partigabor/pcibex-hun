suppressMessages(library(lme4))
suppressMessages(library(car))
suppressMessages(library(emmeans))
suppressMessages(library(ggplot2))

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
df$txc <- interaction(df$chosen_type, df$condition)

# Secific order for 'combined':
df$combined <- factor(df$combined, levels = c("exclusive_A","exclusive_B","focus_A","focus_B","contrastive_A","contrastive_B"))

# Define metrics to evaluate (numeric only)
metrics <- c("total_dwell", "ffd", "total_fixation", "transitions")

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
    model2 <- lmer(ET ~ condition + chosen_type + (1|item) + (1|participant), df, REML = FALSE)
    # model3 <- lmer(ET ~ condition + chosen_type + chosen_type:condition + (1|item) + (1|participant), df, REML = FALSE)
    model3 <- lmer(ET ~ condition*chosen_type + (1|item) + (1|participant), df, REML = FALSE)

    model4 <- lmer(ET ~ chosen_type + (1|item) + (1|participant), df, REML = FALSE)
    model5 <- lmer(ET ~ combined + (1|item) + (1|participant), df, REML = FALSE)

    # Anovas
    # aov1_lines <- capture.output(car::Anova(model1, type = "III"))
    # aov2_lines <- capture.output(car::Anova(model2, type = "III"))
    # aov3_lines <- capture.output(car::Anova(model3, type = "III"))
    # aov4_lines <- capture.output(car::Anova(model4, type = "III"))
    # aov5_lines <- capture.output(car::Anova(model5, type = "III"))

    # Emmeans
    emmeans(model4, list(pairwise ~ chosen_type), adjust = "tukey")
    emmeans(model5, list(pairwise ~ combined), adjust = "tukey")

    emmeans4_lines <- capture.output(emmeans(model4, list(pairwise ~ chosen_type), adjust = "tukey"))
    emmeans5_lines <- capture.output(emmeans(model5, list(pairwise ~ combined), adjust = "tukey"))

    # Compare models 1, 2, and 3
    model_comp <- anova(model1, model2, model3)
    comp_lines <- capture.output(print(model_comp))

    
    # Plot: EMMs (with 95% CI) + raw means, back-transformed via expm1
    emm_tbl <- as.data.frame(emmeans(model3, ~ condition * chosen_type))
    emm_tbl$pred  <- expm1(emm_tbl$emmean)
    emm_tbl$lower <- expm1(emm_tbl$lower.CL)
    emm_tbl$upper <- expm1(emm_tbl$upper.CL)

    # Choose y on raw scale for plotting
    has_raw <- "ET_raw" %in% names(df)
    if (!has_raw) df$ET_bt <- expm1(df$ET)
    y_var <- if (has_raw) "ET_raw" else "ET_bt"

    # EMMs back-transformed
    emm_tbl <- as.data.frame(emmeans(model3, ~ condition * chosen_type))
    emm_tbl$pred  <- expm1(emm_tbl$emmean)
    emm_tbl$lower <- expm1(emm_tbl$lower.CL)
    emm_tbl$upper <- expm1(emm_tbl$upper.CL)

    pd <- position_dodge(width = 0.85)
    p <- ggplot(df, aes(x = condition, y = .data[[y_var]], fill = chosen_type)) +
        geom_boxplot(position = pd, width = 0.7, outlier.shape = NA) +
        geom_jitter(aes(color = chosen_type),
                    position = position_jitterdodge(jitter.width = 0.15, dodge.width = 0.85),
                    size = 1, alpha = 0.3, show.legend = FALSE) +
        geom_errorbar(data = emm_tbl,
                    aes(x = condition, y = pred, ymin = lower, ymax = upper, group = chosen_type),
                    position = pd, width = 0.15, color = "black", inherit.aes = FALSE) +
        geom_point(data = emm_tbl,
                aes(x = condition, y = pred, fill = chosen_type, group = chosen_type),
                position = pd, shape = 23, size = 3, color = "black", inherit.aes = FALSE) +
        labs(title = paste0("Boxplots + EMMs: condition × chosen_type (", metric, ")"),
            x = "Condition",
            y = paste0(metric, " (raw scale)"),
            fill = "Chosen type") +
        theme_minimal(base_size = 12)

    ggsave(filename = paste0("boxplot_", metric, ".png"), plot = p, width = 7.5, height = 5, dpi = 300, bg = "white")

    # Report
    report <- c(
        "",
        paste0("============================================="),
        paste0("============ Metric: ", metric, " ============"),
        paste0("============================================="),
        "",
        # paste0("---------------------------------------------"),
        # paste0("------ Model 1 Summary [", metric, "]: ------"),
        # paste0("---------------------------------------------"),
        # capture.output(summary(model1)),
        # "",
        # paste0("----------------------------------------------------"),
        # paste0("------ Type III Anova (Model 1) [", metric, "] ------"),
        # paste0("----------------------------------------------------"),
        # aov1_lines,
        # "",
        # paste0("---------------------------------------------"),
        # paste0("------ Model 2 Summary [", metric, "]: ------"),
        # paste0("---------------------------------------------"),
        # capture.output(summary(model2)),
        # "",
        # paste0("----------------------------------------------------"),
        # paste0("--- Type III Anova (Model 2) [", metric, "] ---"),
        # paste0("----------------------------------------------------"),
        # aov2_lines,
        # "",
        # paste0("---------------------------------------------"),
        # paste0("------ Model 3 Summary [", metric, "]: ------"),
        # paste0("---------------------------------------------"),
        # capture.output(summary(model3)),
        # "",
        # paste0("----------------------------------------------------"),
        # paste0("------ Type III Anova (Model 3) [", metric, "] ------"),
        # paste0("----------------------------------------------------"),
        # aov3_lines,
        # "",
        # paste0("---------------------------------------------"),
        # paste0("------ Model 4 Summary [", metric, "]: ------"),
        # paste0("---------------------------------------------"),
        # capture.output(summary(model4)),
        # "",
        # paste0("----------------------------------------------------"),
        # paste0("------ Type III Anova (Model 4) [", metric, "] ------"),
        # paste0("----------------------------------------------------"),
        # aov4_lines,
        # "",
        # paste0("---------------------------------------------"),
        # paste0("------ Model 5 Summary [", metric, "]: ------"),
        # paste0("---------------------------------------------"),
        # capture.output(summary(model5)),
        # "",
        # paste0("----------------------------------------------------"),
        # paste0("------ Type III Anova (Model 5) [", metric, "] ------"),
        # paste0("----------------------------------------------------"),
        # aov5_lines,
        # "",
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