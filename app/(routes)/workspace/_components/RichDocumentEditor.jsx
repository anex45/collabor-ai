'use client'
import React, { useEffect, useRef, useState } from 'react'
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter';
import Alert from 'editorjs-alert';
import List from "@editorjs/list";
import NestedList from '@editorjs/nested-list';
import Checklist from '@editorjs/checklist'
import Embed from '@editorjs/embed';
import SimpleImage from 'simple-image-editorjs';
import Table from '@editorjs/table'
import CodeTool from '@editorjs/code';
import { TextVariantTune } from '@editorjs/text-variant-tune';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { useUser } from '@clerk/nextjs';
import Paragraph from '@editorjs/paragraph';
import GenerateAITemplate from './GenerateAITemplate';


function RichDocumentEditor({ params }) {

  const ref = useRef();
  const { user } = useUser();
  const [documentOutput, setDocumentOutput] = useState([]);
  // const [isFetched,setIsFetched]=useState(false);
  let isFetched=false
  
  useEffect(() => {
    user && InitEditor();
  }, [user])

  /**
   * Handle AI generated output and render it in the editor
   */
  const handleAIOutput = async (output) => {
    try {
      if (ref.current) {
        console.log('Rendering AI output:', output);
        await ref.current.render(output);
        console.log('AI content rendered successfully');
      } else {
        console.error('Editor not initialized');
      }
    } catch (error) {
      console.error('Error rendering AI output:', error);
    }
  };

  /**
   * Used to save Document
   */
  const SaveDocument = () => {
    console.log("UPDATE")
    ref.current.save().then(async (outputData) => {
      const docRef = doc(db, 'documentOutput', params?.documentid);
      
      try {
        // Use setDoc instead of updateDoc to create or update the document
        await setDoc(docRef, {
          output: JSON.stringify(outputData),
          editedBy: user?.primaryEmailAddress?.emailAddress,
          lastModified: new Date()
        }, { merge: true }); // merge: true will update if exists, create if not
        
        console.log("Document saved successfully");
      } catch (error) {
        console.error("Error saving document:", error);
      }
    })
  }

  const GetDocumentOutput = () => {
    const unsubscribe = onSnapshot(doc(db, 'documentOutput', params?.documentid),
      (doc) => {
        if (doc.data()?.editedBy != user?.primaryEmailAddress?.emailAddress||isFetched==false)
          doc.data().editedBy&&ref.current?.render(JSON.parse(doc.data()?.output)); 
        isFetched=true  
      })
  }

  const InitEditor = () => {
    if (!ref.current) {
      const editor = new EditorJS({
        onChange: (api, event) => {
           SaveDocument()
          //ref.current.save().then(async (outputData) => {console.log(outputData)})
        },
        onReady:()=>{
          GetDocumentOutput()
        },
        /**
         * Id of Element that should contain Editor instance
         */
        holder: 'editorjs',
        tools: {
          header: Header,
          delimiter: Delimiter,
          paragraph:Paragraph,
          alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+A',
            config: {
              alertTypes: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
              defaultType: 'primary',
              messagePlaceholder: 'Enter something',
            }
          },
          table: Table,
          list: {
            class: List,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+L',
            config: {
              defaultStyle: 'unordered'
            },
          },
          checklist: {
            class: Checklist,
            shortcut: 'CMD+SHIFT+C',
            inlineToolbar: true,
          },
          image: SimpleImage,
          code: {
            class: CodeTool,
            shortcut: 'CMD+SHIFT+P'
          },
          //   textVariant: TextVariantTune


        },

      });
      ref.current = editor;
    }
  }
  return (
    <div className=' '>
      <div id='editorjs' className='w-[70%]'></div>
      <div className='fixed bottom-10 md:ml-80 left-0 z-10'>
        <GenerateAITemplate setGenerateAIOutput={(output)=>handleAIOutput(output)} />
      </div>
    </div>
  )
}

export default RichDocumentEditor