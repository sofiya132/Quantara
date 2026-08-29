# Feature Selection

## Feature Ranking

Features were ranked using multiple feature analysis methods during exploratory data analysis.

The ranked numerical features are:

1. AST
2. ALB
3. BIL
4. CHE
5. ALP
6. GGT
7. PROT
8. ALT
9. CREA
10. CHOL
11. Age

## Candidate Feature Sets

The following feature subsets were evaluated:

| Feature Set | Number of Features |
|---|---:|
| All Features | 12 |
| Top 8 + Sex_m | 9 |
| Top 6 + Sex_m | 7 |
| Top 4 + Sex_m | 5 |

## Initial Validation Results

Feature subsets were evaluated using a Random Forest classifier.

| Feature Set | Accuracy | Weighted F1 |
|---|---:|---:|
| All Features | 0.9350 | 0.9346 |
| Top 8 + Sex_m | **0.9431** | **0.9410** |
| Top 6 + Sex_m | 0.9350 | 0.9332 |
| Top 4 + Sex_m | 0.8699 | 0.8905 |

## Primary Candidate Feature Set

Based on the initial Random Forest feature-subset validation, the primary candidate feature set is:

- AST
- ALB
- BIL
- CHE
- ALP
- GGT
- PROT
- ALT
- Sex_m

This subset achieved the highest Accuracy and Weighted F1 score during the initial validation while reducing the number of input features.

## Note for QML Experiments

The Top 8 + Sex_m feature set is the primary candidate for further experiments.

The Top 6 + Sex_m and Top 4 + Sex_m subsets remain available for experiments requiring fewer input features or qubits.