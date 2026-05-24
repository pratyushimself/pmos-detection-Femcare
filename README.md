# FemCare AI: Intelligent PCOS/PCOD Prediction and Lifestyle Recommendation System

## Overview

FemCare AI is an AI-powered healthcare prediction platform developed for early-stage PCOS/PCOD risk assessment using Machine Learning and AutoML techniques. The system combines advanced preprocessing, synthetic data augmentation, feature selection, ensemble learning, and frontend-backend integration to provide accurate prediction and personalized lifestyle recommendations.

The project was developed as a Final Year Research Project under the Center for Artificial Intelligence & Machine Learning, Siksha ‘O’ Anusandhan (Deemed to be University).

---

## Problem Statement

Polycystic Ovary Syndrome (PCOS) is one of the most common hormonal disorders affecting women of reproductive age. Traditional diagnosis often requires multiple clinical tests and delayed medical evaluation, making early detection difficult.

This project aims to develop an intelligent and accessible AI-based system capable of predicting PCOS risk using healthcare-related features and machine learning models.

---

## Objectives

* Develop a reliable PCOS/PCOD prediction system using Machine Learning
* Improve prediction stability through synthetic data augmentation
* Compare multiple machine learning models and optimization strategies
* Implement AutoML-based pipeline optimization
* Create a responsive frontend healthcare interface
* Integrate frontend and backend systems for real-time prediction
* Generate personalized lifestyle and healthcare recommendations

---

## Technologies Used

### Frontend

* React.js
* TypeScript
* Tailwind CSS
* Axios

### Backend

* FastAPI
* Python

### Machine Learning

* Scikit-learn
* TPOT AutoML
* LightGBM
* CatBoost
* XGBoost
* Random Forest
* Gradient Boosting
* AdaBoost

### Data Processing

* Pandas
* NumPy
* CTGAN
* SMOTE

### Visualization & Utilities

* Matplotlib
* Seaborn
* Jupyter Notebook

---

## Dataset Information

The dataset used in this project was obtained from the publicly available Kaggle PCOS Dataset.

### Dataset Characteristics

* Healthcare and hormonal features
* Clinical and lifestyle-related parameters
* Binary classification dataset
* Dataset augmented using CTGAN and SMOTE

### Features Included

* Age
* Weight
* Height
* BMI
* Menstrual irregularity
* Hair growth
* Skin darkening
* Weight gain
* Acne
* Fast food consumption
* Exercise habits
* Hormonal indicators

---

## Project Workflow

### 1. Data Collection

The PCOS clinical dataset was collected and analyzed for missing values, inconsistencies, and class imbalance.

### 2. Data Preprocessing

The preprocessing stage included:

* Handling missing values
* Data cleaning
* Encoding categorical variables
* Feature normalization
* Duplicate removal

### 3. Data Augmentation

To improve class balance and model stability:

* CTGAN was used for synthetic healthcare data generation
* SMOTE was applied for minority class balancing

### 4. Feature Selection

L1 Regularization (Lasso) was used for identifying important predictive features and reducing redundant attributes.

### 5. Model Training

Multiple machine learning algorithms were trained and compared:

* Random Forest
* Extra Trees Classifier
* Gradient Boosting
* AdaBoost
* LightGBM
* CatBoost
* TPOT AutoML

### 6. Hyperparameter Optimization

Bayesian Optimization and TPOT AutoML were used to improve model performance and automate pipeline optimization.

### 7. Evaluation

Models were evaluated using:

* Accuracy
* Precision
* Recall
* F1-Score
* ROC-AUC
* Confusion Matrix

---

## Best Performing Model

### Hybrid Bayesian Optimized Random Forest

#### Performance Metrics

| Metric               | Score |
| -------------------- | ----- |
| Accuracy             | 89%   |
| Precision            | 0.89  |
| Recall / Sensitivity | 0.88  |
| Specificity          | 0.89  |
| F1-Score             | 0.89  |
| ROC-AUC              | 0.90  |

---

## Frontend System

The frontend was developed using React.js and Tailwind CSS to provide:

* Responsive healthcare interface
* Multi-stage health assessment workflow
* Real-time prediction visualization
* Symptom evaluation forms
* Lifestyle recommendation panels

### Frontend Features

* Profile collection
* Menstrual cycle analysis
* Symptom evaluation
* Lifestyle assessment
* Prediction result visualization
* Recommendation generation

---

## Backend Integration

The backend was implemented using FastAPI.

### Backend Responsibilities

* Receive healthcare data from frontend
* Preprocess incoming user inputs
* Load trained ML models
* Generate predictions
* Return prediction results and recommendations

### API Communication

Frontend and backend communicate using REST APIs and JSON-based data transfer.

---

## System Architecture

The overall workflow includes:

1. Dataset preprocessing
2. Synthetic augmentation using CTGAN + SMOTE
3. Feature selection
4. Model training and optimization
5. Backend deployment using FastAPI
6. Frontend interaction using React.js
7. Real-time PCOS risk prediction

---

## Research Contributions

* Integration of CTGAN and SMOTE for balanced healthcare prediction
* TPOT AutoML-based pipeline optimization
* Hybrid Bayesian Optimized Random Forest framework
* Real-time frontend-backend healthcare deployment
* AI-assisted lifestyle recommendation system

---

## Limitations

* Trained primarily on a publicly available Kaggle dataset
* Limited real-world clinical validation
* Requires larger multi-center healthcare datasets
* Intended for supportive healthcare screening only
* Not a replacement for professional medical diagnosis

---

## Future Scope

* Integration with wearable healthcare devices
* Real-time hormonal tracking
* Mobile application deployment
* Explainable AI integration
* Larger clinical dataset training
* Multi-language healthcare assistance
* Cloud deployment and scalability improvements

---

## Installation Guide

### Clone Repository

```bash
git clone https://github.com/your-username/femcare-ai-pcos-prediction.git
cd femcare-ai-pcos-prediction
```

### Backend Setup

```bash
pip install -r requirements.txt
uvicorn app:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Folder Structure

```bash
FemCare-AI/
│
├── backend/
│   ├── models/
│   ├── app.py
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── notebooks/
├── dataset/
├── diagrams/
├── results/
├── README.md
```

---


### Supervisor

Dr. Alakananda Tripathy
Associate Professor
Center for Artificial Intelligence & Machine Learning
Department of Computer Science & Engineering
Siksha ‘O’ Anusandhan (Deemed to be University)

---

## License

This project is developed for academic and research purposes only.

---

## Acknowledgement

The authors sincerely acknowledge the guidance and support provided by the Department of Computer Science & Engineering and the Center for Artificial Intelligence & Machine Learning during the development of this project.
