import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Extend build by adding free plugins (if custom build banate ho toh aur features add ho sakte hain)

function App() {
  const [content, setContent] = useState("");

  return (
    <div style={{ margin: "20px" }}>
      <h2>CKEditor 5 - All Free Features Example</h2>
      <CKEditor
        editor={ClassicEditor}
        data="<p>Start typing...</p>"
        config={{
          toolbar: {
            items: [
              "heading",
              "|",
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "link",
              "blockQuote",
              "code",
              "codeBlock",
              "highlight",
              "|",
              "bulletedList",
              "numberedList",
              "todoList",
              "|",
              "insertTable",
              "imageUpload",
              "mediaEmbed",
              "|",
              "fontColor",
              "fontBackgroundColor",
              "fontSize",
              "fontFamily",
              "|",
              "alignment",
              "|",
              "undo",
              "redo",
              "findAndReplace",
            ],
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
          image: {
            toolbar: [
              "imageTextAlternative",
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
            ],
          },
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setContent(data);
        }}
      />
      <h3>Output:</h3>
      <div
        style={{
          border: "1px solid gray",
          padding: "10px",
          minHeight: "100px",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

export default App;
