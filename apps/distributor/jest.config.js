module.exports = {
  name: 'distributor',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/distributor',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
