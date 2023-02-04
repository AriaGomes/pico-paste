import axios from "axios";
import { Suspense, useState } from "react";
import { Card, DefaultButton } from "../components";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs, atomOneDarkReasonable } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Spinner } from "flowbite-react";


export const Pastes = (props: any) => {
  let [paste, setPaste] = useState("");
  let [code, setCode] = useState(false);
  let [line, setLine] = useState(false);

  axios
    .get(
      `${document.location.protocol}//${ document.location.hostname || "localhost"}:${
        process.env.PORT || 5000
      }/pastes/${document.location.pathname.substring(8)}`
    )
    .then(function (response) {
      setPaste(response.data.paste);
      setCode(response.data.options.isCode)
      setLine(response.data.options.lineNumbers)
      console.log(response.data._id);
    })
    .catch(function (error) {
      console.log(error);
    });

    const style: React.CSSProperties = { overflowY: "auto", overflowX: "hidden", maxHeight: "80vh" };
    
  return (
    <div className="p-4">
      <div className="text-wrap">
      
        {code ? (
            line ? (<Card>
                <Suspense fallback={<div>Loading...</div>}>
                    
            <SyntaxHighlighter wrapLongLines showLineNumbers customStyle={style} style={vs}>
                
              {paste}
              </SyntaxHighlighter>
              </Suspense>
            </Card>) : (<Card>
            <Suspense fallback={<div>Loading...</div>}>
                
        <SyntaxHighlighter wrapLongLines customStyle={style} style={vs}>
            
          {paste}
          </SyntaxHighlighter>
          </Suspense>
        </Card>)
        )
         : 
         (<Card>
            <Suspense fallback={<div>Loading...</div>}>
                <p className="dark:text-white">{paste}</p>
          
          </Suspense>
        </Card>)
    }

        {/* <DefaultButton onClick={() => console.log(props.isOn)}>test</DefaultButton> */}
      </div>
    </div>
  );
};
