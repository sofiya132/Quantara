# Quantum Hardware Feasibility for HCV Classification

## Dataset Context

The project uses the HCV dataset containing 615 patient records.

The target variable is `Category`, with the following classes:

- 0: Blood Donor
- 0s: Suspect Blood Donor
- 1: Hepatitis
- 2: Fibrosis
- 3: Cirrhosis

The dataset contains demographic and laboratory features including:

- Age
- Sex
- ALB
- ALP
- ALT
- AST
- BIL
- CHE
- CHOL
- CREA
- GGT
- PROT

The `Unnamed: 0` column is treated as a record identifier and is not used
as a predictive feature.

## Quantum Simulators

Quantum simulators allow quantum circuits to be executed on classical
computers without requiring physical quantum hardware.

They are useful for this project because the QML model can first be tested
using an ideal simulator before considering real quantum hardware.

However, simulation becomes computationally expensive as the number of
qubits increases.

## NISQ Devices

NISQ stands for Noisy Intermediate-Scale Quantum.

NISQ devices are current-generation quantum computers with limited quantum
resources and noisy operations.

Therefore, a QML model should not be evaluated only under ideal simulation.
Noise and hardware limitations should also be considered.

## Qubit Limitations

The HCV dataset contains multiple features, but using every feature directly
in a quantum circuit may require too many qubits depending on the encoding
method.

Therefore, feature selection or dimensionality reduction may be required
before applying the QML model.

The final number of features and required qubits will be determined during
benchmarking.

## Noise

Real quantum hardware is affected by noise and errors.

Noise can affect quantum gates, measurements and the overall output of the
quantum circuit.

The project will investigate the effect of noise on QML performance.

## Circuit Depth

Circuit depth represents the number of sequential layers of operations in
the quantum circuit.

Higher circuit depth generally increases the number of operations and can
increase sensitivity to noise.

Different circuit depths will be tested during benchmarking.

## Computational Overhead

The quantum approach will be evaluated not only by predictive performance
but also by computational and hardware requirements.

Important factors include:

- Number of input features
- Number of qubits
- Circuit depth
- Noise sensitivity
- Training time
- Simulation cost

## HCV-Specific Feasibility

The HCV dataset has 615 samples and highly imbalanced classes.

The class distribution is approximately:

| Category            | Samples |
| ------------------- | ------: |
| Blood Donor         |     533 |
| Suspect Blood Donor |       7 |
| Hepatitis           |      24 |
| Fibrosis            |      21 |
| Cirrhosis           |      30 |

Because of this imbalance, accuracy alone is not sufficient for evaluating
the models.

The QML and classical models will therefore be compared using common
metrics such as Precision, Recall, F1-score, Sensitivity, Specificity and
ROC-AUC.

## Day 1 Conclusion

The QML approach will be considered practical only after comparing its
predictive performance and computational requirements against classical
machine learning models.

Feature count, qubit count, circuit depth, noise and training time will be
considered in the final feasibility analysis.
