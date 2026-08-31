# QML Benchmarking & Quantum Feasibility Summary

## 1. Objective

The purpose of the benchmarking analysis is to determine whether the
Variational Quantum Classifier (VQC) provides a practical advantage over
classical machine-learning models for the HCV dataset.

The comparison uses:

- Accuracy
- Precision
- Recall / Sensitivity
- F1 Score
- Specificity
- ROC-AUC
- Training time

Quantum feasibility is additionally evaluated using:

- Number of features
- Number of qubits
- Circuit depth
- Gate count
- Noise sensitivity
- Simulation time

---

## 2. Classical vs QML Results

| Model               | Accuracy | Precision | Recall |     F1 | Sensitivity | Specificity | ROC-AUC | Training Time |
| ------------------- | -------: | --------: | -----: | -----: | ----------: | ----------: | ------: | ------------: |
| Logistic Regression |   98.37% |   100.00% | 86.67% | 92.86% |      86.67% |     100.00% |  98.64% |           N/A |
| Random Forest       |   98.37% |   100.00% | 86.67% | 92.86% |      86.67% |     100.00% |  99.20% |           N/A |
| XGBoost             |   99.19% |   100.00% | 93.33% | 96.55% |      93.33% |     100.00% |  99.75% |           N/A |
| VQC                 |   89.43% |    62.50% | 33.33% | 43.48% |      33.33% |      97.22% |  79.94% |    255.46 sec |

---

## 3. VQC Configuration

The final VQC uses:

- Features after PCA: 4
- Qubits: 4
- Variational layers: 3
- Rotation gates: 24
- CNOT gates: 9
- Approximate total gates: 33
- Best epoch: 12
- Best validation F1: 0.5263

The test set was not used during training or threshold selection.

---

## 4. Feature / Qubit Scaling

The experiment evaluated 2, 4, 6 and 8 features.

| Features | Qubits | Layers | Total Gates | Simulation Time |
| -------: | -----: | -----: | ----------: | --------------: |
|        2 |      2 |      3 |          15 |      0.0302 sec |
|        4 |      4 |      3 |          33 |      0.0495 sec |
|        6 |      6 |      3 |          51 |      0.0723 sec |
|        8 |      8 |      3 |          69 |      0.0962 sec |

Increasing the number of features/qubits increases the circuit gate count
and simulation time.

The 4-qubit configuration provides a relatively small circuit while
retaining four PCA components.

---

## 5. Circuit Depth Analysis

| Circuit Depth | Qubits | Total Gates | Simulation Time |
| ------------: | -----: | ----------: | --------------: |
|             1 |      4 |          11 |      0.0240 sec |
|             2 |      4 |          22 |      0.0342 sec |
|             3 |      4 |          33 |      0.0457 sec |
|             4 |      4 |          44 |      0.0612 sec |

Greater circuit depth increases the number of gates and simulation cost.

The current VQC uses depth 3.

---

## 6. Noise Sensitivity

The experiment used a depolarizing noise probability of 0.01.

| Measurement          |    Value |
| -------------------- | -------: |
| Ideal average output | 0.220357 |
| Noisy average output | 0.212241 |
| Absolute difference  | 0.008116 |

The observed output difference was approximately 0.0081 in this experiment.

This indicates relatively small output deviation under the tested noise
configuration. This conclusion applies specifically to the tested circuit,
noise model and noise level.

---

## 7. Quantum Hardware Feasibility

The current VQC requires:

- 4 qubits
- 3 variational layers
- 33 approximate gates
- 4 encoded features

The circuit is small enough to serve as a practical NISQ-style experiment.

However, hardware feasibility does not mean that the quantum model
currently outperforms classical models.

---

## 8. Final Conclusion

For the current HCV dataset, classical machine-learning models outperform
the evaluated VQC.

XGBoost achieved the strongest classical performance:

- Accuracy: 99.19%
- F1: 96.55%
- ROC-AUC: 99.75%
- Sensitivity: 93.33%
- Specificity: 100%

The VQC achieved:

- Accuracy: 89.43%
- F1: 43.48%
- ROC-AUC: 79.94%
- Sensitivity: 33.33%
- Specificity: 97.22%

Therefore, the current QML implementation should be presented as a
feasibility and research experiment rather than as a replacement for the
classical model.

The analysis demonstrates that a compact 4-qubit VQC can be simulated with
a relatively small circuit, while also quantifying the effects of feature
count, circuit depth and simulated noise.

### Overall assessment

**Quantum implementation: Feasible for experimentation**

**Current predictive advantage over classical ML: Not demonstrated**

**Best-performing model in this benchmark: XGBoost**
