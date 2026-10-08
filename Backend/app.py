from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os


# =========================================================
# Flask App
# =========================================================

app = Flask(__name__)
CORS(app)


# =========================================================
# Base Directory
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# =========================================================
# Load Trained Random Forest Pipeline
# =========================================================

MODEL_PATH = os.path.join(
    BASE_DIR,
    "..",
    "models",
    "random_forest_inspection_model.pkl"
)

model = joblib.load('../models/random_forest_inspection_model.pkl')


# =========================================================
# Baseline Cases File
# =========================================================

CASES_PATH = os.path.join(
    BASE_DIR,
    "..",
    "data",
    "Processed",
    "furniture_returns_baseline.xlsx"
)


# =========================================================
# Exact Feature-Engineering Logic
# =========================================================

# Severity Score
severity_map = {
    "low": 1,
    "medium": 2,
    "high": 3,
    "unknown": 1
}


# Safety Score
safety_map = {
    "low": 1,
    "medium": 2,
    "high": 3,
    "unknown": 1
}


# Condition Risk Score
condition_risk_map = {

    "no visible damage": 1,
    "minor scratch": 1,
    "scratched surface": 1,
    "color mismatch": 1,
    "wrong fabric": 1,
    "stained fabric": 1,
    "chipped surface": 1,
    "cosmetic damage": 1,

    "dent": 2,
    "door misalignment": 2,
    "faulty hinge": 2,
    "loose joints": 2,
    "loose parts": 2,
    "cushion damage": 2,
    "torn fabric": 2,
    "water damage": 2,
    "pest damage": 2,

    "broken frame": 3,
    "broken leg": 3,
    "broken shelf": 3,
    "cracked glass": 3,
    "cracked wood": 3,
    "structural crack": 3,
    "structural damage": 3,
    "severe damage": 3,

    "unknown": 1,
    "Unknown": 1,
    "none": 1,
    "-": 1
}


# =========================================================
# Value Risk Score
# =========================================================

VALUE_Q1 = 11580.0
VALUE_Q2 = 26326.0
VALUE_Q3 = 37459.0


def value_risk(value):

    if value <= VALUE_Q1:
        return 1

    elif value <= VALUE_Q2:
        return 2

    elif value <= VALUE_Q3:
        return 3

    else:
        return 4


# =========================================================
# Transit Risk Score
# =========================================================

def transit_risk(days):

    if days <= 2:
        return 1

    elif days <= 5:
        return 2

    elif days <= 10:
        return 3

    else:
        return 4


# =========================================================
# SLA Urgency Score
# =========================================================

def assign_sla_urgency(sla_hours):

    if sla_hours <= 24:
        return 3

    elif sla_hours <= 48:
        return 2

    else:
        return 1


# =========================================================
# Baseline Priority
# =========================================================

def assign_baseline_priority(score):

    if score >= 2.6:
        return "High"

    elif score >= 1.8:
        return "Medium"

    else:
        return "Low"


# =========================================================
# Health Check API
# =========================================================

@app.route("/health", methods=["GET"])
def health():

    return jsonify({
        "status": "online",
        "model": "Random Forest Inspection Model"
    })


# =========================================================
# Prediction API
# =========================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        # -----------------------------------------
        # Read input values
        # -----------------------------------------

        product = str(
            data["product"]
        ).strip()

        value = float(
            data["value"]
        )

        transit_days = float(
            data["transitDays"]
        )

        return_reason = str(
            data["returnReason"]
        ).strip()

        condition_hint = str(
            data["conditionHint"]
        ).strip()

        severity = str(
            data["severity"]
        ).strip().lower()

        safety = str(
            data["safety"]
        ).strip().lower()

        sla_hours = float(
            data["slaHours"]
        )

        resale_before = float(
            data["resaleBefore"]
        )


        # -----------------------------------------
        # Calculate Engineered Features
        # -----------------------------------------

        severity_score = severity_map.get(
            severity,
            1
        )

        safety_score = safety_map.get(
            safety,
            1
        )

        condition_risk_score = condition_risk_map.get(
            condition_hint,
            1
        )

        transit_risk_score = transit_risk(
            transit_days
        )

        sla_urgency_score = assign_sla_urgency(
            sla_hours
        )

        value_risk_score = value_risk(
            value
        )


        # -----------------------------------------
        # Baseline Score
        # -----------------------------------------

        baseline_score = (

            value_risk_score * 0.30

            + severity_score * 0.20

            + safety_score * 0.20

            + transit_risk_score * 0.15

            + sla_urgency_score * 0.10

            + condition_risk_score * 0.05

        )

        baseline_score = round(
            baseline_score,
            2
        )


        baseline_priority = assign_baseline_priority(
            baseline_score
        )


        # -----------------------------------------
        # Exact 14 Model Features
        # -----------------------------------------

        input_df = pd.DataFrame([{

            "Product": product,

            "Value ₹": value,

            "Transit Days": transit_days,

            "Return Reason": return_reason,

            "Condition Hint": condition_hint,

            "Severity": severity,

            "Safety": safety,

            "SLA hrs": sla_hours,

            "Resale Before ₹": resale_before,

            "Severity Score": severity_score,

            "Safety Score": safety_score,

            "Condition Risk Score": condition_risk_score,

            "Transit Risk Score": transit_risk_score,

            "SLA Urgency Score": sla_urgency_score

        }])


        # -----------------------------------------
        # Random Forest Prediction
        # -----------------------------------------

        prediction = model.predict(input_df)[0]
        probabilities = model.predict_proba(input_df)[0]
        confidence = round(float(max(probabilities)) * 100, 2)
        classes = model.classes_
        class_probabilities = {}
        for class_name, probability in zip(classes, probabilities):
            class_probabilities[str(class_name)] = round(float(probability) * 100, 2)


        # -----------------------------------------
        # Final Prediction Response
        # -----------------------------------------

        return jsonify({

            "success": True,

            "prediction": str(
                prediction
            ),

            "confidence": confidence,

            "priority": baseline_priority,

            "baselineScore": baseline_score,

            "riskScores": {

                "valueRiskScore":
                    value_risk_score,

                "severityScore":
                    severity_score,

                "safetyScore":
                    safety_score,

                "conditionRiskScore":
                    condition_risk_score,

                "transitRiskScore":
                    transit_risk_score,

                "slaUrgencyScore":
                    sla_urgency_score

            },

            "classProbabilities":
                class_probabilities

        })


    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)

        }), 400


# =========================================================
# Return Cases API
# =========================================================

@app.route("/cases", methods=["GET"])
def cases():

    try:

        # -----------------------------------------
        # Read Query Parameters
        # -----------------------------------------

        search = request.args.get(
            "search",
            ""
        ).strip().lower()

        priority = request.args.get(
            "priority",
            "All"
        ).strip()

        severity_filter = request.args.get(
            "severity",
            "All"
        ).strip().lower()

        page = int(
            request.args.get(
                "page",
                1
            )
        )

        limit = int(
            request.args.get(
                "limit",
                20
            )
        )


        # -----------------------------------------
        # Safety Limits
        # -----------------------------------------

        if page < 1:
            page = 1

        if limit < 1:
            limit = 20

        if limit > 100:
            limit = 100


        # -----------------------------------------
        # Load Baseline Dataset
        # -----------------------------------------

        if not os.path.exists(CASES_PATH):

            return jsonify({

                "success": False,

                "error":
                    "Baseline dataset not found."

            }), 404


        df = pd.read_excel(
            CASES_PATH
        )


        # -----------------------------------------
        # Clean Column Names
        # -----------------------------------------

        df.columns = [
            str(column).strip()
            for column in df.columns
        ]


        # -----------------------------------------
        # Search Filter
        # -----------------------------------------

        if search:

            search_columns = []

            possible_columns = [
                "Return ID",
                "Product",
                "Return Reason",
                "Condition Hint"
            ]

            for column in possible_columns:

                if column in df.columns:

                    search_columns.append(
                        df[column]
                        .astype(str)
                        .str.lower()
                        .str.contains(
                            search,
                            na=False
                        )
                    )


            if search_columns:

                combined_search = search_columns[0]

                for condition in search_columns[1:]:

                    combined_search = (
                        combined_search
                        | condition
                    )

                df = df[
                    combined_search
                ]


        # -----------------------------------------
        # Priority Filter
        # -----------------------------------------

        if (
            priority
            and priority.lower() != "all"
            and "Priority" in df.columns
        ):

            df = df[
                df["Priority"]
                .astype(str)
                .str.lower()
                ==
                priority.lower()
            ]


        # -----------------------------------------
        # Severity Filter
        # -----------------------------------------

        if (
            severity_filter
            and severity_filter != "all"
            and "Severity" in df.columns
        ):

            df = df[
                df["Severity"]
                .astype(str)
                .str.lower()
                ==
                severity_filter
            ]


        # -----------------------------------------
        # Priority Sorting
        # -----------------------------------------

        priority_order = {
            "High": 0,
            "Medium": 1,
            "Low": 2
        }


        if "Priority" in df.columns:

            df["_priority_order"] = (
                df["Priority"]
                .map(priority_order)
                .fillna(3)
            )

            df = df.sort_values(
                "_priority_order"
            )

            df = df.drop(
                columns=["_priority_order"]
            )


        # -----------------------------------------
        # Total After Filtering
        # -----------------------------------------

        total_cases = len(df)


        # -----------------------------------------
        # Pagination
        # -----------------------------------------

        start = (
            page - 1
        ) * limit

        end = start + limit

        page_df = df.iloc[
            start:end
        ]


        # -----------------------------------------
        # Convert DataFrame to JSON
        # -----------------------------------------

        page_df = page_df.copy()

        page_df = page_df.where(
            pd.notna(page_df),
            None
        )


        records = page_df.to_dict(
            orient="records"
        )


        # -----------------------------------------
        # Response
        # -----------------------------------------

        return jsonify({

            "success": True,

            "cases": records,

            "total": total_cases,

            "page": page,

            "limit": limit,

            "totalPages":
                (
                    total_cases + limit - 1
                ) // limit

        })


    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)

        }), 400


# =========================================================
# Start Flask Server
# =========================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )



