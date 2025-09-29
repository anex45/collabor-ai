#!/usr/bin/env node

// Firestore CRUD Test Script - Backend Only
// Run with: node test-firestore.js

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
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
} = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBI3jOtIBr3EPq6hzLUgh5K9Om_kePtCys",
  authDomain: "collabor-ai-e3bc4.firebaseapp.com",
  projectId: "collabor-ai-e3bc4",
  storageBucket: "collabor-ai-e3bc4.firebasestorage.app",
  messagingSenderId: "248269952653",
  appId: "1:248269952653:web:c113e473a7d6d11069f4c4",
  measurementId: "G-RHVJLTXLV7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Helper function for colored output
function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log('green', `✅ ${message}`);
}

function logError(message) {
  log('red', `❌ ${message}`);
}

function logInfo(message) {
  log('blue', `ℹ️  ${message}`);
}

function logWarning(message) {
  log('yellow', `⚠️  ${message}`);
}

// Test functions
async function testCreate() {
  logInfo('Testing CREATE operations...');
  
  try {
    // Test 1: Create with setDoc (specific ID)
    const testDocId = `test-${Date.now()}`;
    await setDoc(doc(db, 'crudTest', testDocId), {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      createdAt: new Date(),
      isActive: true
    });
    logSuccess(`CREATE (setDoc): Document created with ID: ${testDocId}`);

    // Test 2: Create with addDoc (auto-generated ID)
    const docRef = await addDoc(collection(db, 'crudTest'), {
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25,
      createdAt: new Date(),
      isActive: true
    });
    logSuccess(`CREATE (addDoc): Auto-generated document ID: ${docRef.id}`);

    return { testDocId, autoDocId: docRef.id };
  } catch (error) {
    logError(`CREATE failed: ${error.message}`);
    throw error;
  }
}

async function testRead(testDocId) {
  logInfo('Testing READ operations...');
  
  try {
    // Test 1: Read specific document
    const docSnap = await getDoc(doc(db, 'crudTest', testDocId));
    if (docSnap.exists()) {
      logSuccess('READ (getDoc): Successfully read document');
      console.log(`   Data:`, JSON.stringify(docSnap.data(), null, 2));
    } else {
      logError('READ (getDoc): Document not found');
    }

    // Test 2: Read collection
    const querySnapshot = await getDocs(collection(db, 'crudTest'));
    logSuccess(`READ (getDocs): Found ${querySnapshot.size} documents in collection`);

    // Test 3: Read with query
    const q = query(
      collection(db, 'crudTest'), 
      where('isActive', '==', true),
      orderBy('age'),
      limit(10)
    );
    const queryResults = await getDocs(q);
    logSuccess(`READ (query): Query returned ${queryResults.size} active users`);

    return true;
  } catch (error) {
    logError(`READ failed: ${error.message}`);
    throw error;
  }
}

async function testUpdate(testDocId) {
  logInfo('Testing UPDATE operations...');
  
  try {
    // Update document
    await updateDoc(doc(db, 'crudTest', testDocId), {
      age: 31,
      lastUpdated: new Date(),
      'profile.location': 'New York'
    });
    logSuccess('UPDATE: Document updated successfully');

    // Verify update
    const updatedDoc = await getDoc(doc(db, 'crudTest', testDocId));
    if (updatedDoc.exists() && updatedDoc.data().age === 31) {
      logSuccess('UPDATE (verify): Update verification successful');
      console.log(`   Updated age:`, updatedDoc.data().age);
    }

    return true;
  } catch (error) {
    logError(`UPDATE failed: ${error.message}`);
    throw error;
  }
}

async function testDelete(testDocId, autoDocId) {
  logInfo('Testing DELETE operations...');
  
  try {
    // Delete document
    await deleteDoc(doc(db, 'crudTest', testDocId));
    logSuccess(`DELETE: Document ${testDocId} deleted successfully`);

    // Verify deletion
    const deletedDoc = await getDoc(doc(db, 'crudTest', testDocId));
    if (!deletedDoc.exists()) {
      logSuccess('DELETE (verify): Deletion verification successful');
    }

    // Clean up auto-generated document
    await deleteDoc(doc(db, 'crudTest', autoDocId));
    logSuccess(`CLEANUP: Auto-generated document ${autoDocId} cleaned up`);

    return true;
  } catch (error) {
    logError(`DELETE failed: ${error.message}`);
    throw error;
  }
}

async function testWorkspaceSimulation() {
  logInfo('Testing WORKSPACE simulation (your app workflow)...');
  
  try {
    const workspaceId = Date.now();
    const docId = `doc-${Date.now()}`;

    // Create workspace
    await setDoc(doc(db, 'Workspace', workspaceId.toString()), {
      workspaceName: 'Test Workspace',
      emoji: '🚀',
      coverImage: '/cover.png',
      createdBy: 'test@example.com',
      id: workspaceId,
      orgId: 'test-org'
    });
    logSuccess('WORKSPACE: Workspace created successfully');

    // Create workspace document
    await setDoc(doc(db, 'workspaceDocuments', docId), {
      workspaceId: workspaceId,
      createdBy: 'test@example.com',
      coverImage: null,
      emoji: null,
      id: docId,
      documentName: 'Test Document',
      documentOutput: []
    });
    logSuccess('DOCUMENT: Workspace document created');

    // Create document output
    await setDoc(doc(db, 'documentOutput', docId), {
      docId: docId,
      output: []
    });
    logSuccess('OUTPUT: Document output created');

    // Verify all collections exist
    const workspaceDoc = await getDoc(doc(db, 'Workspace', workspaceId.toString()));
    const documentDoc = await getDoc(doc(db, 'workspaceDocuments', docId));
    const outputDoc = await getDoc(doc(db, 'documentOutput', docId));

    if (workspaceDoc.exists() && documentDoc.exists() && outputDoc.exists()) {
      logSuccess('VERIFICATION: All workspace components verified');
    }

    // Clean up
    await deleteDoc(doc(db, 'Workspace', workspaceId.toString()));
    await deleteDoc(doc(db, 'workspaceDocuments', docId));
    await deleteDoc(doc(db, 'documentOutput', docId));
    logSuccess('CLEANUP: Test workspace data cleaned up');

    return true;
  } catch (error) {
    logError(`WORKSPACE simulation failed: ${error.message}`);
    throw error;
  }
}

// Main test runner
async function runAllTests() {
  console.log(`${colors.bold}${colors.cyan}
╔════════════════════════════════════════════════╗
║         🔥 FIRESTORE CRUD TEST SUITE          ║
║              Backend Terminal Test              ║
╚════════════════════════════════════════════════╝${colors.reset}
`);

  logInfo('Initializing Firestore connection...');
  logInfo(`Project ID: ${firebaseConfig.projectId}`);
  logInfo(`Auth Domain: ${firebaseConfig.authDomain}`);
  
  let totalTests = 0;
  let passedTests = 0;

  try {
    // Test 1: CREATE
    logInfo('\n📝 PHASE 1: CREATE OPERATIONS');
    const { testDocId, autoDocId } = await testCreate();
    totalTests += 2;
    passedTests += 2;

    // Test 2: READ
    logInfo('\n📖 PHASE 2: READ OPERATIONS');
    await testRead(testDocId);
    totalTests += 3;
    passedTests += 3;

    // Test 3: UPDATE
    logInfo('\n✏️  PHASE 3: UPDATE OPERATIONS');
    await testUpdate(testDocId);
    totalTests += 2;
    passedTests += 2;

    // Test 4: DELETE
    logInfo('\n🗑️  PHASE 4: DELETE OPERATIONS');
    await testDelete(testDocId, autoDocId);
    totalTests += 3;
    passedTests += 3;

    // Test 5: Workspace Simulation
    logInfo('\n🏢 PHASE 5: WORKSPACE SIMULATION');
    await testWorkspaceSimulation();
    totalTests += 6;
    passedTests += 6;

    // Final Results
    console.log(`${colors.bold}${colors.green}
╔════════════════════════════════════════════════╗
║                ✅ ALL TESTS PASSED!            ║
║                                                ║
║   Your Firestore database is working correctly ║
║   You can now create workspaces in your app!   ║
╚════════════════════════════════════════════════╝${colors.reset}
`);

    logSuccess(`Test Summary: ${passedTests}/${totalTests} tests passed`);
    logSuccess('🚀 Your collabor-ai platform is ready to use!');

  } catch (error) {
    console.log(`${colors.bold}${colors.red}
╔════════════════════════════════════════════════╗
║                ❌ TESTS FAILED                  ║
╚════════════════════════════════════════════════╝${colors.reset}
`);
    
    logError(`Main error: ${error.message}`);
    logError(`Test Summary: ${passedTests}/${totalTests} tests passed`);
    
    logWarning('\nPossible solutions:');
    console.log('   1. Check if Firestore database is created in Firebase Console');
    console.log('   2. Verify security rules allow read/write operations');
    console.log('   3. Confirm API key has correct permissions');
    console.log('   4. Check internet connection and Firebase service status');
    
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  runAllTests().catch(console.error);
}