# HCV Dataset - Data Dictionary

## Dataset Overview

The HCV dataset contains 615 patient records and 14 columns.

The dataset contains laboratory and demographic features related to
Hepatitis C disease classification.

## Target Variable

`Category` is the target variable.

Possible categories:

- `0=Blood Donor`
- `0s=suspect Blood Donor`
- `1=Hepatitis`
- `2=Fibrosis`
- `3=Cirrhosis`

## Features

| Feature | Type | Description |
|---|---|---|
| Age | Numerical | Patient age |
| Sex | Categorical | Patient sex |
| ALB | Numerical | Albumin |
| ALP | Numerical | Alkaline phosphatase |
| ALT | Numerical | Alanine transaminase |
| AST | Numerical | Aspartate transaminase |
| BIL | Numerical | Bilirubin |
| CHE | Numerical | Cholinesterase |
| CHOL | Numerical | Cholesterol |
| CREA | Numerical | Creatinine |
| GGT | Numerical | Gamma-glutamyl transferase |
| PROT | Numerical | Total protein |

## Removed Column

`Unnamed: 0`

This column is treated as a record identifier and is not used as a
predictive feature.

## Missing Values

Missing values are present in:

- ALB
- ALP
- ALT
- CHOL
- PROT

Missing numerical values are handled using the median calculated
from the training data.

## Preprocessing Pipeline

The current preprocessing pipeline performs the following steps:

1. Load the raw dataset.
2. Remove the record identifier.
3. Separate features and target.
4. Encode the categorical `Sex` feature.
5. Split the data into training and testing sets using an 80/20 split.
6. Use stratification to preserve class distribution.
7. Impute missing numerical values using training-set medians.
8. Standardize continuous numerical features using `StandardScaler`.
9. Keep the encoded `Sex_m` feature as a binary 0/1 feature.

The scaler is fitted only on the training data to prevent data leakage.

## Dataset Split

Total samples: 615

- Training set: 492 samples (80%)
- Testing set: 123 samples (20%)

## Class Imbalance

The target classes are highly imbalanced.

Approximate distribution:

| Category | Samples |
|---|---:|
| Blood Donor | 533 |
| Suspect Blood Donor | 7 |
| Hepatitis | 24 |
| Fibrosis | 21 |
| Cirrhosis | 30 |

Because of this imbalance, accuracy alone should not be used to
evaluate model performance.

The project should also consider:

- Precision
- Recall
- F1-score
- Sensitivity
- Specificity
- ROC-AUC
- Confusion Matrix

## Important Note

The current processed dataset is a baseline preprocessing version.
Feature selection, class-imbalance handling, and QML-specific
dimensionality reduction will be investigated separately.