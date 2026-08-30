import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path


# ==========================================
# 1. Load benchmark results
# ==========================================

results_path = Path(
    "results/hcv_classical_benchmark.csv"
)

df = pd.read_csv(results_path)

print("\nLoaded benchmark results:")
print(df)


# ==========================================
# 2. Create plots directory
# ==========================================

plots_dir = Path("results/plots")
plots_dir.mkdir(
    parents=True,
    exist_ok=True
)


# ==========================================
# 3. Function to create and save plots
# ==========================================

def create_plot(
    column,
    title,
    ylabel,
    filename,
    ylim=None
):

    plt.figure(figsize=(8, 5))

    plt.bar(
        df["Model"],
        df[column]
    )

    plt.title(title)

    plt.ylabel(ylabel)

    if ylim is not None:
        plt.ylim(ylim)

    plt.xticks(
        rotation=20
    )

    plt.tight_layout()

    output_path = plots_dir / filename

    plt.savefig(
        output_path,
        dpi=300,
        bbox_inches="tight"
    )

    # Close the figure so another window
    # is not opened and memory is released.
    plt.close()

    print(f"Saved: {output_path}")


# ==========================================
# 4. Generate all plots
# ==========================================

create_plot(
    column="Accuracy",
    title="HCV Model Accuracy Comparison",
    ylabel="Accuracy",
    filename="accuracy_comparison.png",
    ylim=(0, 1)
)


create_plot(
    column="Balanced Accuracy",
    title="HCV Balanced Accuracy Comparison",
    ylabel="Balanced Accuracy",
    filename="balanced_accuracy_comparison.png",
    ylim=(0, 1)
)


create_plot(
    column="Sensitivity",
    title="HCV Sensitivity Comparison",
    ylabel="Sensitivity",
    filename="sensitivity_comparison.png",
    ylim=(0, 1)
)


create_plot(
    column="Specificity",
    title="HCV Specificity Comparison",
    ylabel="Specificity",
    filename="specificity_comparison.png",
    ylim=(0, 1)
)


create_plot(
    column="F1",
    title="HCV F1 Score Comparison",
    ylabel="F1 Score",
    filename="f1_comparison.png",
    ylim=(0, 1)
)


create_plot(
    column="ROC-AUC",
    title="HCV ROC-AUC Comparison",
    ylabel="ROC-AUC",
    filename="roc_auc_comparison.png",
    ylim=(0, 1)
)


create_plot(
    column="Training Time",
    title="HCV Training Time Comparison",
    ylabel="Training Time (seconds)",
    filename="training_time_comparison.png"
)


# ==========================================
# 5. Finished
# ==========================================

print("\n========================================")
print("ALL BENCHMARK PLOTS GENERATED")
print("========================================")

print(f"Plots saved in: {plots_dir}")