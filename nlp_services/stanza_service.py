from flask import Flask, request, jsonify
from flask_cors import CORS
import stanza

app = Flask(__name__)
CORS(app)
# Load English pipeline with POS + NER
nlp = stanza.Pipeline("en", processors="tokenize,pos,lemma,ner")

@app.route("/process", methods=["POST"])
def process_text():
    try:
        data = request.get_json()
        text = data.get("text", "")

        if not text:
            return jsonify({"error": "No text provided"}), 400

        doc = nlp(text)

        results = []
        for sentence in doc.sentences:
            for token in sentence.tokens:
                word = token.words[0]   # each token may contain one word
                results.append({
                    "text": token.text,
                    "lemma": word.lemma,
                    "upos": word.upos,     # POS tag
                    "ner": token.ner       # ✅ NER tag comes from token
                })

        return jsonify({"tokens": results})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Run Flask on port 5001
    app.run(host="0.0.0.0", port=5001, debug=True)
