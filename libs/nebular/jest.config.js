module.exports = {
  name: 'nebular',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/nebular',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
