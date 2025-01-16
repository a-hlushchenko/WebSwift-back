module.exports = {
  apps: [
    {
      name: 'webswift-back',
      exec_mode: 'fork',
      instances: '1',
      script: 'dist/main.js',
    },
  ],
};
