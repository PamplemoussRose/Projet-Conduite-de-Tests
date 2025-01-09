import path from 'path';

import {
    assertFails,
    assertSucceeds,
    initializeTestEnvironment
  } from "@firebase/rules-unit-testing";
  import { setDoc } from "firebase/firestore";
  import fs from 'fs';
  
  let testEnv;
  
  beforeAll(async () => {
    const rulesPath = path.resolve(__dirname, '../firestore.rules');
    testEnv = await initializeTestEnvironment({
      projectId: "locamat-7cf78234",
      firestore: {
        host: "127.0.0.1", 
        port: 8081,
        rules: fs.readFileSync(rulesPath, "utf8"),
      },
    });
  });
  
  afterAll(async () => {
    await testEnv.cleanup();//liberer les ressources apres les tests
  });
  
  test('allows authenticated user to write to their own document', async () => {
    const alice = testEnv.authenticatedContext("alice");
    await assertSucceeds(setDoc(alice.firestore().doc('users/alice'), { name: 'Alice' }));
  });
  
  
;
  