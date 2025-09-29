"use client"
import { db } from '@/config/firebaseConfig';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { useState } from 'react';

export default function FirebaseTest() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testFirebaseConnection = async () => {
    setLoading(true);
    setStatus('Testing Firebase connection...');
    
    try {
      // Test 1: Try to write a test document
      const testDocRef = doc(db, 'test', 'connection-test');
      await setDoc(testDocRef, {
        message: 'Hello Firebase!',
        timestamp: new Date(),
        test: true
      });
      
      setStatus('✅ SUCCESS: Firebase connection working! You can create workspaces now.');
      
      // Test 2: Try to read the document back
      setTimeout(async () => {
        try {
          const testCollection = collection(db, 'test');
          const snapshot = await getDocs(testCollection);
          console.log('Read test successful. Documents count:', snapshot.size);
        } catch (readError) {
          console.error('Read test failed:', readError);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Firebase test failed:', error);
      setStatus(`❌ FAILED: ${error.message}`);
      
      if (error.message.includes('Missing or insufficient permissions')) {
        setStatus('❌ FAILED: Firestore security rules are too restrictive. Please set up test mode rules.');
      } else if (error.message.includes('API key')) {
        setStatus('❌ FAILED: Invalid API key. Please check your Firebase configuration.');
      }
    }
    
    setLoading(false);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      zIndex: 9999, 
      background: 'white', 
      padding: '20px', 
      border: '2px solid #ccc', 
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      maxWidth: '400px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Firebase Connection Test</h3>
      <button 
        onClick={testFirebaseConnection}
        disabled={loading}
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? 'Testing...' : 'Test Firebase Connection'}
      </button>
      {status && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          background: status.includes('SUCCESS') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${status.includes('SUCCESS') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {status}
        </div>
      )}
    </div>
  );
}