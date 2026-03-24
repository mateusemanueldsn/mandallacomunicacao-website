import PyPDF2
import sys

def extract_text(pdf_path, txt_path):
    try:
        reader = PyPDF2.PdfReader(pdf_path)
        text = ""
        for i, page in enumerate(reader.pages):
            text += f"\n--- Page {i+1} ---\n"
            text += page.extract_text()
            if i >= 30:
                break
        
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(text)
            
        print("Success! Parsed PDF.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_text(sys.argv[1], sys.argv[2])
