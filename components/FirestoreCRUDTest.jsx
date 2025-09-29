"use client"
import { db } from '@/config/firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  query,
  where,
  orderBy,
  limit 
} from 'firebase/firestore';
import { useState } from 'react';

export default function FirestoreCRUDTest() {
  const [status, setStatus] = useState('Ready to test CRUD operations');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const addResult = (operation, success, message, data = null) => {
    setTestResults(prev => [...prev, {
      operation,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearResults = () => {
    setTestResults([]);
    setStatus('Ready to test CRUD operations');
  };

  const runCRUDTests = async () => {
    setLoading(true);
    setStatus('Running CRUD tests...');
    setTestResults([]);

    try {
      // 1. CREATE Operations
      setStatus('Testing CREATE operations...');
      
      // Create with setDoc (specific ID)
      const testDocId = `test-${Date.now()}`;
      await setDoc(doc(db, 'crudTest', testDocId), {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        createdAt: new Date(),
        isActive: true
      });
      addResult('CREATE (setDoc)', true, `Document created with ID: ${testDocId}`);

      // Create with addDoc (auto-generated ID)
      const docRef = await addDoc(collection(db, 'crudTest'), {
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 25,
        createdAt: new Date(),
        isActive: true
      });
      const autoDocId = docRef.id;
      addResult('CREATE (addDoc)', true, `Auto-generated document ID: ${autoDocId}`);

      // 2. READ Operations
      setStatus('Testing READ operations...');

      // Read specific document
      const docSnap = await getDoc(doc(db, 'crudTest', testDocId));
      if (docSnap.exists()) {
        addResult('READ (getDoc)', true, 'Successfully read document', docSnap.data());
      } else {
        addResult('READ (getDoc)', false, 'Document not found');
      }

      // Read collection
      const querySnapshot = await getDocs(collection(db, 'crudTest'));
      addResult('READ (getDocs)', true, `Found ${querySnapshot.size} documents in collection`);

      // Read with query
      const q = query(
        collection(db, 'crudTest'), 
        where('isActive', '==', true),
        orderBy('age'),
        limit(10)
      );
      const queryResults = await getDocs(q);
      addResult('READ (query)', true, `Query returned ${queryResults.size} active users`);

      // 3. UPDATE Operations
      setStatus('Testing UPDATE operations...');

      // Update document
      await updateDoc(doc(db, 'crudTest', testDocId), {
        age: 31,
        lastUpdated: new Date(),
        'profile.location': 'New York' // Nested field update
      });
      addResult('UPDATE', true, 'Document updated successfully');

      // Verify update
      const updatedDoc = await getDoc(doc(db, 'crudTest', testDocId));
      if (updatedDoc.exists() && updatedDoc.data().age === 31) {
        addResult('UPDATE (verify)', true, 'Update verification successful', updatedDoc.data());
      }

      // 4. DELETE Operations
      setStatus('Testing DELETE operations...');

      // Delete document
      await deleteDoc(doc(db, 'crudTest', testDocId));
      addResult('DELETE', true, `Document ${testDocId} deleted successfully`);

      // Verify deletion
      const deletedDoc = await getDoc(doc(db, 'crudTest', testDocId));
      if (!deletedDoc.exists()) {
        addResult('DELETE (verify)', true, 'Deletion verification successful');
      }

      // Clean up auto-generated document
      await deleteDoc(doc(db, 'crudTest', autoDocId));
      addResult('CLEANUP', true, `Auto-generated document ${autoDocId} cleaned up`);

      setStatus('✅ All CRUD operations completed successfully!');

    } catch (error) {
      console.error('CRUD test error:', error);
      addResult('ERROR', false, `Test failed: ${error.message}`);
      setStatus(`❌ Test failed: ${error.message}`);
    }

    setLoading(false);
  };

  const runWorkspaceSimulation = async () => {
    setLoading(true);
    setStatus('Simulating workspace creation...');
    setTestResults([]);

    try {
      // Simulate creating a workspace (like your app does)
      const workspaceId = Date.now();
      
      // Create workspace
      await setDoc(doc(db, 'Workspace', workspaceId.toString()), {
        workspaceName: 'Test Workspace',
        emoji: '🚀',
        coverImage: '/cover.png',
        createdBy: 'test@example.com',
        id: workspaceId,
        orgId: 'test-org'
      });
      addResult('WORKSPACE', true, 'Workspace created successfully');

      // Create workspace document
      const docId = `doc-${Date.now()}`;
      await setDoc(doc(db, 'workspaceDocuments', docId), {
        workspaceId: workspaceId,
        createdBy: 'test@example.com',
        coverImage: null,
        emoji: null,
        id: docId,
        documentName: 'Test Document',
        documentOutput: []
      });
      addResult('DOCUMENT', true, 'Workspace document created');

      // Create document output
      await setDoc(doc(db, 'documentOutput', docId), {
        docId: docId,
        output: []
      });
      addResult('OUTPUT', true, 'Document output created');

      // Verify all collections exist
      const workspaceDoc = await getDoc(doc(db, 'Workspace', workspaceId.toString()));
      const documentDoc = await getDoc(doc(db, 'workspaceDocuments', docId));
      const outputDoc = await getDoc(doc(db, 'documentOutput', docId));

      if (workspaceDoc.exists() && documentDoc.exists() && outputDoc.exists()) {
        addResult('VERIFICATION', true, 'All workspace components verified');
      }

      // Clean up
      await deleteDoc(doc(db, 'Workspace', workspaceId.toString()));
      await deleteDoc(doc(db, 'workspaceDocuments', docId));
      await deleteDoc(doc(db, 'documentOutput', docId));
      addResult('CLEANUP', true, 'Test data cleaned up');

      setStatus('✅ Workspace simulation completed successfully!');

    } catch (error) {
      console.error('Workspace simulation error:', error);
      addResult('ERROR', false, `Simulation failed: ${error.message}`);
      setStatus(`❌ Simulation failed: ${error.message}`);
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
      border: '2px solid #007bff', 
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      maxHeight: '80vh',
      overflow: 'auto'
    }}>
      <h2 style={{ margin: '0 0 15px 0', color: '#007bff', fontSize: '18px' }}>
        🔥 Firestore CRUD Test Suite
      </h2>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={runCRUDTests}
          disabled={loading}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            marginRight: '10px',
            fontSize: '14px'
          }}
        >
          {loading ? 'Running...' : '🧪 Run CRUD Tests'}
        </button>

        <button 
          onClick={runWorkspaceSimulation}
          disabled={loading}
          style={{
            background: '#6f42c1',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            marginRight: '10px',
            fontSize: '14px'
          }}
        >
          {loading ? 'Running...' : '🏢 Test Workspace'}
        </button>

        <button 
          onClick={clearResults}
          disabled={loading}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🗑️ Clear
        </button>
      </div>

      <div style={{ 
        marginBottom: '15px', 
        padding: '10px', 
        background: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        {status}
      </div>

      {testResults.length > 0 && (
        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#495057' }}>
            📊 Test Results ({testResults.length})
          </h3>
          {testResults.map((result, index) => (
            <div 
              key={index}
              style={{ 
                marginBottom: '8px', 
                padding: '8px', 
                background: result.success ? '#d4edda' : '#f8d7da',
                border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {result.success ? '✅' : '❌'} {result.operation} - {result.timestamp}
              </div>
              <div style={{ color: '#666' }}>{result.message}</div>
              {result.data && (
                <details style={{ marginTop: '4px' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '11px' }}>View Data</summary>
                  <pre style={{ 
                    background: '#f8f9fa', 
                    padding: '4px', 
                    borderRadius: '2px', 
                    fontSize: '10px',
                    overflow: 'auto',
                    maxHeight: '100px'
                  }}>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: '15px', 
        fontSize: '11px', 
        color: '#6c757d',
        borderTop: '1px solid #dee2e6',
        paddingTop: '10px'
      }}>
        <strong>What this tests:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
          <li>Create documents (setDoc, addDoc)</li>
          <li>Read documents (getDoc, getDocs, queries)</li>
          <li>Update documents (updateDoc)</li>
          <li>Delete documents (deleteDoc)</li>
          <li>Workspace simulation (your app's workflow)</li>
        </ul>
      </div>
    </div>
  );
}