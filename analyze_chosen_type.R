# Analyze chosen_type with mixed-effects models
# Input: results.csv (must be in the working directory)
# Fixed effects: condition, choice_rt, transitions
# Outcome: chosen_type
# Strategy:
# - If chosen_type has two levels -> fit a binomial GLMM (lme4::glmer) with random intercepts for participant_id and item (if available)
# - If chosen_type has >2 levels and brms is installed -> fit a categorical brms model (mixed multinomial)
# - Otherwise fall back to nnet::multinom (no random effects) and suggest installing brms for mixed multinomial

# Load packages
suppressPackageStartupMessages({
  required <- c("readr", "dplyr", "lme4", "lmerTest", "emmeans", "broom.mixed")
  for(p in required){
    if(!requireNamespace(p, quietly = TRUE)){
      stop(sprintf("Package '%s' is required but not installed. Install it with install.packages('%s') and re-run." , p, p))
    }
  }
  library(readr)
  library(dplyr)
  library(lme4)
  library(lmerTest)
  library(emmeans)
  library(broom.mixed)
})

# Optional packages
have_brms <- requireNamespace("brms", quietly = TRUE)
have_nnet <- requireNamespace("nnet", quietly = TRUE)

# Read data
df <- readr::read_csv("results.csv", show_col_types = FALSE)

# Quick sanity checks
needed_cols <- c("chosen_type", "condition", "choice_rt", "transitions", "participant_id")
miss <- setdiff(needed_cols, names(df))
if(length(miss) > 0){
  stop(paste0("Missing required columns in results.csv: ", paste(miss, collapse=", ")))
}

# Clean and prepare
df2 <- df %>%
  dplyr::filter(!is.na(chosen_type), !is.na(condition), !is.na(choice_rt), !is.na(transitions), !is.na(participant_id)) %>%
  dplyr::mutate(
    condition = factor(condition),
    chosen_type = factor(chosen_type),
    participant_id = factor(participant_id),
    item = if("item" %in% names(.) ) factor(item) else NULL
  )

if(nrow(df2) == 0) stop("No complete rows after filtering; cannot fit model.")

cat("Observations after filtering:", nrow(df2), "\n")

# Ensure chosen_type exists and is a factor, then compute number of levels robustly
if(!"chosen_type" %in% names(df2)){
  stop("After preprocessing, 'chosen_type' is missing from df2.")
}
df2$chosen_type <- factor(df2$chosen_type)
cat("Levels in chosen_type:", levels(df2$chosen_type), "\n")
n_levels <- nlevels(df2$chosen_type)
cat("n_levels (number of levels in chosen_type):", n_levels, "\n")

# Helper to save outputs
save_output <- function(obj, filename){
  tryCatch({
    saveRDS(obj, file = filename)
    cat("Saved:", filename, "\n")
  }, error = function(e){
    warning("Could not save ", filename, ": ", conditionMessage(e))
  })
}

# Save a textual summary of an object to a .txt file
save_text_summary <- function(obj, filename){
  tryCatch({
    txt <- capture.output({
      # prefer summary(), fall back to print()
      s <- try(summary(obj), silent = TRUE)
      if(inherits(s, "try-error")){
        print(obj)
      } else {
        print(s)
      }
    })
    writeLines(txt, con = filename)
    cat("Saved text summary:", filename, "\n")
  }, error = function(e){
    warning("Could not write text summary to ", filename, ": ", conditionMessage(e))
  })
}

if(n_levels == 2){
  cat("Fitting binomial GLMM (lme4::glmer)\n")
  # Ensure reference level is the first factor level (emm does sensible contrasts)
  df2$chosen_type <- relevel(df2$chosen_type, ref = levels(df2$chosen_type)[1])

  # Build formula. Include random intercept for item if present.
  if("item" %in% names(df2)){
    form <- as.formula("chosen_type ~ condition + choice_rt + transitions + (1 | participant_id) + (1 | item)")
  } else {
    form <- as.formula("chosen_type ~ condition + choice_rt + transitions + (1 | participant_id)")
  }

  # Fit model
  model <- lme4::glmer(formula = form, data = df2, family = binomial(link = "logit"),
                       control = lme4::glmerControl(optimizer = "bobyqa", optCtrl = list(maxfun = 2e5)))

  cat("Model fitted. Summary:\n")
  print(summary(model))

  # Save model summary as text
  save_text_summary(model, "chosen_type_glmm_binomial.txt")

  # emmeans for condition on response (probabilities)
  cat("Estimated marginal means (condition) on response scale:\n")
  emm_cond <- emmeans::emmeans(model, ~ condition, type = "response")
  print(emm_cond)
  print(emmeans::pairs(emm_cond))
  # Save emmeans output
  try({
    writeLines(capture.output(print(emm_cond)), con = "emmeans_condition_binomial.txt")
    writeLines(capture.output(print(emmeans::pairs(emm_cond))), con = "emmeans_condition_binomial_pairs.txt")
    cat("Saved emmeans outputs for binomial model.\n")
  }, silent = TRUE)

  # Effects (trends) for continuous predictors by condition
  cat("Estimated trends for choice_rt and transitions by condition:\n")
  # emtrends may fail for some model structures, wrap in try
  try({
    tr_choice <- emmeans::emtrends(model, ~ condition, var = "choice_rt")
    print(tr_choice)
    try(writeLines(capture.output(print(tr_choice)), con = "emtrends_choice_binomial.txt"), silent = TRUE)
  }, silent = TRUE)
  try({
    tr_trans <- emmeans::emtrends(model, ~ condition, var = "transitions")
    print(tr_trans)
    try(writeLines(capture.output(print(tr_trans)), con = "emtrends_transitions_binomial.txt"), silent = TRUE)
  }, silent = TRUE)

  # Tidy the fixed effects
  cat("Tidy fixed effects (broom.mixed):\n")
  fe_tidy <- broom.mixed::tidy(model, effects = "fixed", conf.int = TRUE)
  print(fe_tidy)
  try(writeLines(capture.output(print(fe_tidy)), con = "fixed_effects_tidy_binomial.txt"), silent = TRUE)

} else if(n_levels > 2){
  cat("Detected more than 2 levels in chosen_type (", n_levels, ")\n", sep = "")
  if(have_brms){
    cat("brms is available: fitting Bayesian categorical (mixed) model with brms\n")
    library(brms)
    if("item" %in% names(df2)){
      form_brm <- brms::bf(chosen_type ~ condition + choice_rt + transitions + (1 | participant_id) + (1 | item))
    } else {
      form_brm <- brms::bf(chosen_type ~ condition + choice_rt + transitions + (1 | participant_id))
    }
    fit_brms <- brms::brm(form_brm, data = df2, family = brms::categorical(), cores = 4, chains = 4, iter = 2000, silent = FALSE)
    cat("brms model fitted. Summary:\n")
    print(summary(fit_brms))
  # Save brms model textual summary
  save_text_summary(fit_brms, "chosen_type_brms_categorical.txt")

    # emmeans-like comparisons: use emmeans on the brmsfit
    cat("Estimated marginal means (condition) from brms model (response scale):\n")
    try({
      emm_b <- emmeans::emmeans(fit_brms, ~ condition, type = "response")
      print(emm_b)
      print(emmeans::pairs(emm_b))
      # Save emmeans outputs for brms model
      try({
        writeLines(capture.output(print(emm_b)), con = "emmeans_condition_brms.txt")
        writeLines(capture.output(print(emmeans::pairs(emm_b))), con = "emmeans_condition_brms_pairs.txt")
        cat("Saved emmeans outputs for brms model.\n")
      }, silent = TRUE)
    }, silent = FALSE)

  } else {
    cat("brms not installed. Falling back to nnet::multinom (no random effects).\n")
    if(!have_nnet) stop("Package 'nnet' is required to run multinom fallback. Install it with install.packages('nnet')")
    library(nnet)
    multinom_fit <- nnet::multinom(chosen_type ~ condition + choice_rt + transitions, data = df2, Hess = TRUE)
    cat("Multinom fitted (no random effects). Summary:\n")
    print(summary(multinom_fit))
  # Save multinom textual summary
  save_text_summary(multinom_fit, "chosen_type_multinom.txt")

    cat("Estimated marginal means (condition) on response (probabilities):\n")
    emm_m <- emmeans::emmeans(multinom_fit, ~ condition, type = "response")
    print(emm_m)
    print(emmeans::pairs(emm_m))
    # Save emmeans outputs for multinom fallback
    try({
      writeLines(capture.output(print(emm_m)), con = "emmeans_condition_multinom.txt")
      writeLines(capture.output(print(emmeans::pairs(emm_m))), con = "emmeans_condition_multinom_pairs.txt")
      cat("Saved emmeans outputs for multinom model.\n")
    }, silent = TRUE)

    cat("\nNote: multinom above is NOT a mixed-effects model. For mixed-effects multinomial/categorical models, install the 'brms' package and re-run this script.\n")
  }
} else {
  stop("No levels detected in chosen_type after preprocessing.")
}

cat("Done.\n")
