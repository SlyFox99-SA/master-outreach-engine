const fs = require('fs');
const { execSync } = require('child_process');

// Revert to working-v2 for all 4 clients
const clients = {
  'zaheera-fragrances': 'zaheera-fragrances',
  'techhub-phones':     'techhub-phones',
  'monetech-sneakers':  'monetech-sneakers',
  'lumo-skincare':      'lumo-skincare'
};

for (const c of Object.values(clients)) {
  const path = 'clients/' + c + '/src/index.html';
  try {
    execSync('git checkout working-v2 -- ' + path, { stdio: 'inherit' });
    console.log('  reverted: ' + path);
  } catch (e) { console.log('  MISS ' + path); }
}