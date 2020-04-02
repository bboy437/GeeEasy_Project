module.exports = {
  name: 'cores',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/cores',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
