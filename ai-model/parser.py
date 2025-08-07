import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_file_stream):
    """Extracts text from a PDF file stream."""
    try:
        # Open the PDF from a memory stream
        doc = fitz.open(stream=pdf_file_stream.read(), filetype="pdf")
        text = ""
        # Iterate through each page and extract text
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return ""