import pandas as pd
import os

def sanitize_filename(name):
    return "".join(c if c.isalnum() or c in "._-" else "_" for c in name)

# Parcours récursif de tous les fichiers .xlsx
for root, dirs, files in os.walk("."):
    for file in files:
        if file.endswith(".xlsx") and not file.startswith("~$"):  # Ignore fichiers temporaires Excel
            excel_path = os.path.join(root, file)
            print(f"🔍 Traitement du fichier : {excel_path}")

            # Charger toutes les feuilles
            xls = pd.ExcelFile(excel_path, engine="openpyxl")
            for sheet_name in xls.sheet_names:
                df = pd.read_excel(xls, sheet_name=sheet_name)

                # Générer un nom de fichier JSON propre
                base_name = os.path.splitext(file)[0]
                sanitized_sheet = sanitize_filename(sheet_name)
                json_name = f"{base_name}__{sanitized_sheet}.json"
                json_path = os.path.join(root, json_name)

                # Écrire le fichier JSON
                df.to_json(json_path, orient="records", indent=2, force_ascii=False)
                print(f"✅ {sheet_name} → {json_path}")
