"use client";
import { useDashboard } from "@/app/_components/AdminContext";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.css";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/css/froala_editor.min.css";
import "froala-editor/css/froala_editor.pkgd.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.css";
import "froala-editor/css/froala_editor.min.css";
import "froala-editor/css/plugins.pkgd.css";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/plugins.pkgd.min.css";
import "froala-editor/js/plugins/video.min.js";
import * as React from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { toast } from "sonner";
import { MCQGenrator } from "@/app/_components/McqGenrator";
import { SingleImageDropzone } from "@/app/_components/image-upload";
import { Button } from "@/components/ui/button";
export default function Home() {
  const { tit, it } = useDashboard();
  const { edgestore } = useEdgeStore();
  const [img, setImg] = React.useState<File>();
  const [content, setContent] = React.useState("");
  const [dis, setDis] = React.useState(false);
  const loadContent = async () => {
    const response = await fetch("/api/topics/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tId: tit }),
    });
    const data = await response.json();
    if (data.content && data.content.length > 0) {
      setContent(`${data.content[0].con}`);
    }
  };
  const uploadImage = async () => {
    if (img) {
      toast("Uploading image");
      const res = await edgestore.publicFiles.upload({
        file: img,
      });
      setContent(
        (preContent) =>
          preContent + `<img src="${res.url}" width="250" height="250"/>`
      );
      toast("Uploaded");
    }
  };
  const handleSave = async () => {
    if (content != "") {
      setDis(true);
      const req = await fetch("/api/topics/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tId: tit, con: content }),
      });
      const data = await req.json();
      toast(data.message);
      loadContent();
      setDis(false);
    } else {
      toast("Please Add Some Content Before Saving");
    }
  };
  React.useEffect(() => {
    loadContent();
  }, []);
  React.useEffect(() => {
    uploadImage();
  }, [img]);
  return (
    <>
      <div className="flex flex-col justify-center items-center h-100vh w-100vh mx-auto max-w-xs">
        <FroalaEditor
          config={{
            placeholderText: "What to Show To the User",
            toolbarButtons: {
              moreText: {
                buttons: [
                  "bold",
                  "italic",
                  "underline",
                  "strikeThrough",
                  "subscript",
                  "superscript",
                  "fontFamily",
                  "fontSize",
                  "textColor",
                  "backgroundColor",
                  "inlineClass",
                  "inlineStyle",
                  "clearFormatting",
                ],
              },
              moreParagraph: {
                buttons: [
                  "alignLeft",
                  "alignCenter",
                  "formatOLSimple",
                  "alignRight",
                  "alignJustify",
                  "formatOL",
                  "formatUL",
                  "paragraphFormat",
                  "paragraphStyle",
                  "lineHeight",
                  "outdent",
                  "indent",
                  "quote",
                ],
              },
              moreRich: {
                buttons: [
                  "insertLink",
                  "insertImage",
                  "insertTable",
                  "emoticons",
                  "fontAwesome",
                  "specialCharacters",
                  "embedly",
                  "insertVideo",
                ],
              },
              moreMisc: {
                buttons: [
                  "undo",
                  "redo",
                  "fullscreen",
                  "print",
                  "spellChecker",
                  "selectAll",
                  "html",
                  "help",
                ],
                align: "right",
                buttonsVisible: 2,
              },
              charCounterCount: true,
            },
            events: {
              "image.removed": async function ($img: any) {
                if ($img.attr("src").startsWith("https://")) {
                  await edgestore.publicFiles.delete({ url: $img.attr("src") });
                }
              },
            },
          }}
          model={content}
          onModelChange={setContent}
        />
      </div>
      <div className="block justify-center content-center items-center mx-auto">
        <div className="w-56 h-56 mt-4">
          <SingleImageDropzone
            value={img}
            onChange={setImg}
          ></SingleImageDropzone>
        </div>
        {it && (<>
          <MCQGenrator params={{id: tit}}/>
        </>)}
        <Button
          disabled={dis}
          className="mt-4"
          onClick={() => {
            handleSave();
          }}
        >
          Save
        </Button>
      </div>
    </>
  );
}
