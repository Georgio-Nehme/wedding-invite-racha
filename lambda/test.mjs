// Test script for the Wedding RSVP Lambda Function
// This simulates Lambda events to test the handler

import { handler } from './index.mjs';

/**
 * Create a mock Lambda event
 */
function createEvent(method, path, body = null) {
  return {
    requestContext: {
      http: {
        method: method
      }
    },
    rawPath: path,
    body: body ? JSON.stringify(body) : null
  };
}

/**
 * Test the Lambda handler
 */
async function runTests() {
  console.log('🧪 Testing Wedding RSVP Lambda Function\n');
  console.log('=' .repeat(60));

  try {
    // Test 1: GET /invites/inv_001
    console.log('\n✅ Test 1: GET /invites/inv_001');
    console.log('-' .repeat(60));
    const test1Event = createEvent('GET', '/invites/inv_001');
    const test1Result = await handler(test1Event);
    console.log('Status:', test1Result.statusCode);
    const test1Body = JSON.parse(test1Result.body);
    console.log('Main Invitee:', test1Body.main_invitee_name);
    console.log('Family Members:', test1Body.family_members.length);
    test1Body.family_members.forEach(member => {
      console.log(`  - ${member.name}: responded=${member.responded}, status=${member.rsvp_status}`);
    });
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': test1Result.headers['Access-Control-Allow-Origin'],
      'Access-Control-Allow-Methods': test1Result.headers['Access-Control-Allow-Methods']
    });

    // Test 2: POST /invites/inv_001/rsvp
    console.log('\n✅ Test 2: POST /invites/inv_001/rsvp');
    console.log('-' .repeat(60));
    const rsvpPayload = {
      responses: [
        { member_id: "mem_001", name: "Sarah Johnson", attending: true },
        { member_id: "mem_002", name: "Michael Johnson", attending: false },
        { member_id: "mem_003", name: "Emma Johnson", attending: true },
        { member_id: "mem_004", name: "Oliver Johnson", attending: true }
      ]
    };
    const test2Event = createEvent('POST', '/invites/inv_001/rsvp', rsvpPayload);
    const test2Result = await handler(test2Event);
    console.log('Status:', test2Result.statusCode);
    const test2Body = JSON.parse(test2Result.body);
    console.log('Success:', test2Body.success);
    console.log('Message:', test2Body.message);
    console.log('Total Attending:', test2Body.total_attending);
    console.log('Total Not Attending:', test2Body.total_not_attending);
    console.log('Submitted At:', test2Body.submitted_at);

    // Test 3: Verify GET returns updated data
    console.log('\n✅ Test 3: GET /invites/inv_001 (after RSVP submission)');
    console.log('-' .repeat(60));
    const test3Event = createEvent('GET', '/invites/inv_001');
    const test3Result = await handler(test3Event);
    const test3Body = JSON.parse(test3Result.body);
    console.log('Updated Family Members:');
    test3Body.family_members.forEach(member => {
      console.log(`  - ${member.name}: responded=${member.responded}, status=${member.rsvp_status}`);
    });

    // Test 4: OPTIONS preflight
    console.log('\n✅ Test 4: OPTIONS /invites/inv_001 (CORS Preflight)');
    console.log('-' .repeat(60));
    const test4Event = createEvent('OPTIONS', '/invites/inv_001');
    const test4Result = await handler(test4Event);
    console.log('Status:', test4Result.statusCode);
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': test4Result.headers['Access-Control-Allow-Origin'],
      'Access-Control-Allow-Methods': test4Result.headers['Access-Control-Allow-Methods'],
      'Access-Control-Allow-Headers': test4Result.headers['Access-Control-Allow-Headers']
    });

    // Test 5: Invalid invite ID
    console.log('\n✅ Test 5: GET /invites/invalid_id (Not Found)');
    console.log('-' .repeat(60));
    const test5Event = createEvent('GET', '/invites/invalid_id');
    const test5Result = await handler(test5Event);
    console.log('Status:', test5Result.statusCode);
    const test5Body = JSON.parse(test5Result.body);
    console.log('Error:', test5Body.error);
    console.log('Code:', test5Body.code);

    // Test 6: Invalid POST request (missing responses array)
    console.log('\n✅ Test 6: POST /invites/inv_001/rsvp (Invalid Request)');
    console.log('-' .repeat(60));
    const invalidPayload = { invalid: "data" };
    const test6Event = createEvent('POST', '/invites/inv_001/rsvp', invalidPayload);
    const test6Result = await handler(test6Event);
    console.log('Status:', test6Result.statusCode);
    const test6Body = JSON.parse(test6Result.body);
    console.log('Error:', test6Body.error);
    console.log('Code:', test6Body.code);

    console.log('\n' + '=' .repeat(60));
    console.log('✨ All tests completed successfully!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests
runTests();
